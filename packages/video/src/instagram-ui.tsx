import { Camera, Ellipsis, Heart, MessageCircle, Music, Send } from "lucide-static";
import { AbsoluteFill } from "remotion";

/*
 * An approximate mock of what Instagram draws over a Reel, for reviews only:
 * the top bar, the action rail, the bottom gradient with the account, the
 * post text and the audio. It is a transparent still that video:render lays
 * over the video for the preview and the review sheet, so the person judges
 * the composition as it looks in the app. It never goes into the published
 * file. Sizes are design px (540×960) and approximate the app as of October
 * 2026; the inspector's safe zone is the rule, this is only a picture of it.
 */

const icon = (svg: string, size: number) => (
  <span
    className="block"
    style={{ width: size, height: size, filter: "drop-shadow(0 1px 2px rgba(0,0,0,.45))" }}
    dangerouslySetInnerHTML={{ __html: svg.replace("<svg", `<svg width="${size}" height="${size}" stroke-width="2.2"`) }}
  />
);

const shadow = { textShadow: "0 1px 2px rgba(0,0,0,.5)" };

export function InstagramUi({ handle }: { handle: string }) {
  return (
    <AbsoluteFill style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif", color: "white" }}>
      <div className="absolute inset-x-0 bottom-0" style={{ height: 260, background: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,.5))" }} />
      <div className="absolute left-5 right-5 top-6 flex items-center justify-between" style={shadow}>
        <span className="text-[22px] font-bold">Reels</span>
        {icon(Camera, 26)}
      </div>
      <div className="absolute right-3 flex flex-col items-center gap-5" style={{ top: 560 }}>
        {[
          [Heart, "1.204"],
          [MessageCircle, "86"],
          [Send, "312"],
        ].map(([svg, count]) => (
          <div key={count} className="flex flex-col items-center gap-1 text-[12px] font-semibold" style={shadow}>
            {icon(svg, 30)}
            {count}
          </div>
        ))}
        {icon(Ellipsis, 26)}
      </div>
      <div className="absolute bottom-6 left-4 right-[70px] flex flex-col gap-2 text-[14px]" style={shadow}>
        <div className="flex items-center gap-2 font-semibold">
          <span className="block rounded-full bg-white/70" style={{ width: 28, height: 28 }} />
          {handle.replace(/^@/, "")}
          <span className="rounded-md border border-white/80 px-2 py-0.5 text-[12px]">Seguir</span>
        </div>
        <div className="leading-snug opacity-95">Texto del post, su primera línea… más</div>
        <div className="flex items-center gap-1.5 text-[12px]">
          {icon(Music, 14)}
          Audio original
        </div>
      </div>
    </AbsoluteFill>
  );
}
