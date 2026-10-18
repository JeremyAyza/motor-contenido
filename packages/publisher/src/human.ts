import type { Locator, Page } from "playwright-core";

/** A random integer between min and max, both included. */
export function randomBetween(min: number, max: number, random = Math.random): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

export const sleep = (ms: number) => new Promise<void>((done) => setTimeout(done, ms));

/** Waits a random time between min and max milliseconds. */
export const pause = (min: number, max: number) => sleep(randomBetween(min, max));

/** The pause between two actions: half a second to 3 seconds. */
export const beat = () => pause(500, 3000);

/** Hovers, hesitates a moment, clicks and takes a beat. */
export async function click(target: Locator): Promise<void> {
  await target.hover();
  await pause(150, 450);
  await target.click();
  await beat();
}

/** Replaces the field's text in one go, the way a person pastes it. */
export async function paste(page: Page, field: Locator, text: string): Promise<void> {
  await field.click();
  await pause(300, 800);
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.press("Backspace");
  await pause(200, 500);
  await page.keyboard.insertText(text);
  await beat();
}
