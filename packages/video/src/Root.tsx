import { Composition, Still } from "remotion";
import { InstagramUi } from "./instagram-ui.tsx";
import { calculatePieceMetadata, PieceVideo } from "./PieceVideo.tsx";
import { PIECES } from "./pieces.ts";
import { FPS, HEIGHT, WIDTH } from "./timeline.ts";

/**
 * One composition per piece with a video.tsx. Studio and render get a single
 * piece through REMOTION_PIECE, because each piece has its own public folder.
 * The instagram-ui still is the mock overlay for reviews (instagram-ui.tsx).
 */
export function Root() {
  const only = process.env.REMOTION_PIECE;
  return (
    <>
      {PIECES.filter((p) => !only || p.id === only).map((p) => (
        <Composition
          key={p.id}
          id={p.id}
          component={PieceVideo}
          calculateMetadata={calculatePieceMetadata}
          defaultProps={{ piece: p.id, timeline: null, inspect: null }}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
          durationInFrames={FPS}
        />
      ))}
      <Still id="instagram-ui" component={InstagramUi} defaultProps={{ handle: "@cuenta" }} width={WIDTH} height={HEIGHT} />
    </>
  );
}
