// The referent's frames at given seconds, 4 per row, for `npm run video:comparar` (docs/reel.md, step 3).
// Paste it into javascript_tool on the referent's embedded player (https://www.instagram.com/reel/<id>/embed/)
// with the viewport at 800x1100 (resize_window), after putting the seconds in SECONDS. Then take a
// screenshot and copy its file to content/<piece>/out/referente-cuadros.jpg. It only reads the page:
// no login, nothing written to Instagram, no download. Reload the page to get the player back.
const SECONDS = [/* the 12 seconds of "Cuadros del aspecto" in referente.md */];

const player = document.querySelector("video");
if (!player) throw new Error("No <video> on this page: open the /embed/ URL of the Reel");
player.muted = true;
player.preload = "auto";
if (!player.duration) {
  player.load();
  await new Promise((done) => {
    player.addEventListener("loadeddata", done, { once: true });
    setTimeout(done, 8000);
  });
}
const src = player.currentSrc || player.src;
document.body.innerHTML = "";
// No scrollbars: they would cut the last column out of the screenshot.
document.documentElement.style.overflow = "hidden";
document.body.style.cssText = "margin:0;background:#fff;overflow:hidden;";
const grid = document.createElement("div");
grid.style.cssText = "display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:6px;width:100%;box-sizing:border-box;";
document.body.appendChild(grid);
await Promise.all(
  SECONDS.map(
    (second) =>
      new Promise((done) => {
        const cell = document.createElement("div");
        cell.style.cssText = "position:relative;";
        const video = document.createElement("video");
        video.muted = true;
        video.preload = "auto";
        video.src = src;
        video.style.cssText = "width:100%;display:block;";
        const label = document.createElement("div");
        label.textContent = `${second} s`;
        label.style.cssText = "position:absolute;top:3px;left:3px;background:#000;color:#fff;font:12px monospace;padding:1px 4px;";
        cell.append(video, label);
        grid.appendChild(cell);
        video.addEventListener("loadedmetadata", () => (video.currentTime = Math.min(second, video.duration - 0.05)), { once: true });
        video.addEventListener("seeked", done, { once: true });
        setTimeout(done, 15000);
      }),
  ),
);
({ frames: SECONDS.length, duration: player.duration, width: innerWidth, height: grid.offsetHeight });
