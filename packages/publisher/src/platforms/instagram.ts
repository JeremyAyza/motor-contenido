import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { BrowserContext, Page } from "playwright-core";
import { openProfile } from "../browser.ts";
import { PublisherError } from "../errors.ts";
import { beat, click, pause, paste } from "../human.ts";
import { IG } from "./instagram.selectors.ts";
import type { Platform, PostInput, PostOptions, PostResult, Publisher } from "./platform.ts";

const SECOND = 1000;

/** Text compared without spaces or case: the caption box and the post page break lines their own way. */
const squash = (text: string) => text.normalize("NFC").toLowerCase().replace(/\s+/g, "");

export const instagram: Platform = {
  id: "instagram",
  // A carousel mixes images and videos (3 to 60 s each, same aspect ratio).
  limits: {
    maxMedia: 20,
    formats: ["jpg", "jpeg", "png", "mp4"],
    maxBytes: 12 * 1024 * 1024,
    maxVideoBytes: 250 * 1024 * 1024,
    maxCaption: 2200,
    maxHashtags: 30,
  },
  async open(profileDir) {
    const context = await openProfile(profileDir);
    const page = context.pages()[0] ?? (await context.newPage());
    return new InstagramPublisher(context, page);
  },
};

class InstagramPublisher implements Publisher {
  constructor(
    private readonly context: BrowserContext,
    private readonly page: Page,
  ) {}

  async isLoggedIn(): Promise<boolean> {
    await this.goHome();
    const home = this.page.locator(IG.homeIcon).first();
    await home.or(this.page.locator(IG.loginInput)).first().waitFor({ state: "visible", timeout: 30 * SECOND });
    return home.isVisible();
  }

  async waitForLogin(timeoutMs: number): Promise<void> {
    await this.page.locator(IG.homeIcon).first().waitFor({ state: "visible", timeout: timeoutMs });
    await beat();
  }

  async currentHandle(): Promise<string | undefined> {
    if (!this.page.url().startsWith(IG.home)) await this.goHome();
    const link = this.page
      .getByRole("link", { name: IG.profileLink })
      .or(this.page.locator('a[href^="/"]:has(img[alt*="perfil" i], img[alt*="profile" i])'))
      .first();
    try {
      await link.waitFor({ state: "visible", timeout: 10 * SECOND });
    } catch {
      return undefined;
    }
    const href = await link.getAttribute("href");
    return href?.split("/").find(Boolean)?.toLowerCase();
  }

  async post(input: PostInput, { dryRun, beforeShare }: PostOptions): Promise<PostResult> {
    await this.goHome();
    await this.dismissPrompts();
    await this.openCreateDialog(input.kind);
    await this.upload(input.media);
    if (input.kind === "reel") {
      await this.keepReelRatio();
      await this.next(); // video/crop → cover
      if (input.cover) await this.uploadCover(input.cover);
      await this.next(); // cover → caption/details
    } else {
      await this.keepOriginalRatio();
      await this.next(); // crop → filters
      await this.next(); // filters → caption
    }
    await this.writeCaption(input.caption);
    if (input.aiLabel) {
      await this.enableAiLabel();
    }
    if (dryRun) return {};

    beforeShare();
    await click(this.page.getByRole("button", { name: IG.share }).first());
    await this.page
      .getByText(IG.shared)
      .or(this.page.locator(IG.sharedIcon))
      .first()
      .waitFor({ state: "visible", timeout: 180 * SECOND });
    await beat();
    await this.closeDialog();
    return { url: await this.findPostUrl(input.handle, input.caption) };
  }

  async capture(basePath: string): Promise<string[]> {
    mkdirSync(dirname(basePath), { recursive: true });
    const screenshot = `${basePath}.png`;
    const html = `${basePath}.html`;
    await this.page.screenshot({ path: screenshot });
    writeFileSync(html, await this.page.content());
    return [screenshot, html];
  }

  async close(): Promise<void> {
    await this.context.close();
  }

  private async goHome(): Promise<void> {
    await this.page.goto(IG.home);
    await pause(2 * SECOND, 4 * SECOND);
  }

  /** Closes prompts such as "turn on notifications". */
  private async dismissPrompts(): Promise<void> {
    for (let i = 0; i < 3; i++) {
      const notNow = this.page.getByRole("button", { name: IG.notNow }).first();
      if (!(await notNow.isVisible())) return;
      await click(notNow);
    }
  }

  private async openCreateDialog(kind?: "carousel" | "reel"): Promise<void> {
    const create = this.page.getByRole("link", { name: IG.createLink }).or(this.page.locator(IG.newPostIcon)).first();
    await create.waitFor({ state: "visible", timeout: 15 * SECOND });
    await click(create);
    // "Create" opens a menu (Post, Reel...) or, in some versions, the dialog directly.
    const fileInput = this.page.locator(IG.fileInput).first();
    const reelItem = this.page.getByRole("link", { name: IG.reelMenuItem }).or(this.page.getByText(IG.reelMenuItem)).first();
    const postItem = this.page.getByRole("link", { name: IG.postMenuItem }).or(this.page.getByText(IG.postMenuItem)).first();
    if (kind === "reel" && (await reelItem.isVisible())) {
      await click(reelItem);
    } else if (await postItem.isVisible()) {
      await click(postItem);
    } else if ((await fileInput.count()) === 0) {
      // The menu's first item is Post; the keyboard reaches it when its label can't be found.
      await this.page.keyboard.press("Tab");
      await pause(300, 600);
      await this.page.keyboard.press("Enter");
      await beat();
    }
    await fileInput.waitFor({ state: "attached", timeout: 15 * SECOND });
  }

  private async upload(media: readonly string[]): Promise<void> {
    await this.page.locator(IG.fileInput).first().setInputFiles([...media]);
    const okBtn = this.page.getByRole("button", { name: IG.videoDismissOk }).first();
    try {
      await okBtn.waitFor({ state: "visible", timeout: 3 * SECOND });
      await click(okBtn);
    } catch {
      // Prompt not shown, proceed
    }
    const ready = this.page.locator(IG.cropIcon).or(this.page.getByRole("button", { name: IG.next })).first();
    await ready.waitFor({ state: "visible", timeout: 60 * SECOND });
    await beat();
  }

  /** Instagram crops to a square by default; "Original" keeps the 4:5 slides whole. */
  private async keepOriginalRatio(): Promise<void> {
    await click(this.page.locator(IG.cropIcon).first());
    const original = this.page.getByText(IG.originalRatio).first();
    await original.waitFor({ state: "visible", timeout: 10 * SECOND });
    await click(original);
  }

  /** Keeps 9:16 vertical ratio for Reels if crop selection is present. */
  private async keepReelRatio(): Promise<void> {
    const crop = this.page.locator(IG.cropIcon).first();
    if (await crop.isVisible()) {
      await click(crop);
      const ratio = this.page.getByText(IG.nineSixteenRatio).or(this.page.getByText(IG.originalRatio)).first();
      if (await ratio.isVisible({ timeout: 3 * SECOND }).catch(() => false)) {
        await click(ratio);
      } else {
        await click(crop);
      }
    }
  }

  private async uploadCover(coverPath: string): Promise<void> {
    const uploadBtn = this.page.getByText(IG.uploadCoverBtn).first();
    try {
      await uploadBtn.waitFor({ state: "visible", timeout: 8 * SECOND });
      const [fileChooser] = await Promise.all([
        this.page.waitForEvent("filechooser", { timeout: 10 * SECOND }).catch(() => null),
        click(uploadBtn),
      ]);
      if (fileChooser) {
        await fileChooser.setFiles(coverPath);
      } else {
        const fileInputs = this.page.locator('input[type="file"]');
        const count = await fileInputs.count();
        if (count > 0) await fileInputs.nth(count - 1).setInputFiles(coverPath);
      }
      await beat();
    } catch {
      // Proceed with default frame if cover upload button is not interactable
    }
  }

  private async enableAiLabel(): Promise<void> {
    const advanced = this.page.getByText(IG.advancedSettings).first();
    if (await advanced.isVisible({ timeout: 5 * SECOND }).catch(() => false)) {
      await click(advanced);
      await beat();
    }
    const labelSection = this.page.getByText(IG.aiLabelHeading).first();
    if (await labelSection.isVisible({ timeout: 5 * SECOND }).catch(() => false)) {
      const switchLocator = this.page.locator('input[type="checkbox"], div[role="switch"]').first();
      if (await switchLocator.isVisible()) {
        const isChecked = (await switchLocator.getAttribute("aria-checked")) === "true" || (await switchLocator.isChecked().catch(() => false));
        if (!isChecked) {
          await click(switchLocator);
          await beat();
          const confirm = this.page.getByRole("button", { name: IG.aiLabelConfirm }).first();
          if (await confirm.isVisible({ timeout: 3 * SECOND }).catch(() => false)) {
            await click(confirm);
            await beat();
          }
        }
      }
    }
  }

  private async next(): Promise<void> {
    const button = this.page.getByRole("button", { name: IG.next }).first();
    await button.waitFor({ state: "visible", timeout: 15 * SECOND });
    await click(button);
  }

  private async writeCaption(caption: string): Promise<void> {
    const box = this.page.locator(IG.captionBox).first();
    await box.waitFor({ state: "visible", timeout: 15 * SECOND });
    await paste(this.page, box, caption);
    if (squash(await box.innerText()) !== squash(caption)) {
      throw new PublisherError("The caption box doesn't match the manifest after pasting; nothing was shared");
    }
  }

  private async closeDialog(): Promise<void> {
    const close = this.page.locator(IG.closeIcon).first();
    if (await close.isVisible()) await click(close);
  }

  /**
   * The shared post's URL: the newest post on the profile whose page text starts
   * like the caption. Pinned posts come first in the grid, so it checks a few,
   * and it retries once because a new post can take a moment to show up.
   */
  private async findPostUrl(handle: string, caption: string): Promise<string | undefined> {
    const start = squash(caption).slice(0, 30);
    for (let attempt = 0; attempt < 2; attempt++) {
      if (attempt > 0) await pause(5 * SECOND, 10 * SECOND);
      await this.page.goto(IG.profile(handle));
      await beat();
      const links = this.page.locator(IG.postLink);
      try {
        await links.first().waitFor({ state: "visible", timeout: 20 * SECOND });
      } catch {
        continue;
      }
      const hrefs = await links.evaluateAll((anchors) => anchors.map((a) => a.getAttribute("href") ?? ""));
      const codes = [...new Set(hrefs.map((href) => IG.postCode.exec(href)?.[1]).filter((code) => code !== undefined))].slice(0, 6);
      for (const code of codes) {
        const targetUrl = hrefs.find((h) => h.includes(`/reel/${code}`)) ? IG.reel(code) : IG.post(code);
        await this.page.goto(targetUrl);
        await pause(800, 1600);
        const text = await this.page.evaluate(() =>
          [document.title, ...Array.from(document.querySelectorAll("meta[property^='og:'], meta[name='description']"), (m) => m.getAttribute("content") ?? "")].join(" "),
        );
        if (squash(text).includes(start)) return targetUrl;
      }
    }
    return undefined;
  }
}
