import type { CSSProperties, ReactNode } from "react";
import { edgeDrawn, nodeAt, packetAt, type BoardEdge, type BoardEvent, type BoardNode, type BoardPacket, type NodeState } from "./board.ts";
import { cx } from "../../../carousel/src/ui/index.tsx";
import { useClock, useStage } from "./scene.ts";

/**
 * A zone of the stage's world with a name (defineVideo({ stage: { spots } })):
 * it places its children over that box, in the world's coordinates, so the
 * camera frames exactly what is drawn there. Children position themselves
 * inside it (absolute coordinates from the spot's top left corner).
 */
export function Spot({ id, className, style, children }: { id: string; className?: string; style?: CSSProperties; children?: ReactNode }) {
  const { spots } = useStage();
  const box = spots[id];
  if (!box) throw new Error(`<Spot id="${id}">: "${id}" is not in stage.spots. Spots: ${Object.keys(spots).join(", ") || "none"}`);
  return (
    <div data-spot={id} className={cx("absolute", className)} style={{ left: box.x, top: box.y, width: box.w, height: box.h, ...style }}>
      {children}
    </div>
  );
}

export type LabelPlace = "top-left" | "top" | "top-right" | "center" | "bottom-left" | "bottom" | "bottom-right";
export type LabelTone = "solid" | "line" | "accent" | "alert";

const PLACE: Record<LabelPlace, string> = {
  "top-left": "left-3 top-3",
  top: "left-1/2 top-3 -translate-x-1/2",
  "top-right": "right-3 top-3",
  center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
  "bottom-left": "bottom-3 left-3",
  bottom: "bottom-3 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-3 right-3",
};

const LABEL_TONE: Record<LabelTone, string> = {
  solid: "bg-ink text-bg",
  line: "bg-bg text-ink ring-2 ring-ink/60",
  accent: "bg-accent text-accent-ink",
  alert: "bg-red-600 text-white",
};

/**
 * A label of 1 to 3 words pinned to a spot of the world: the system's
 * signage (TU APP, RUNTIME, MEMORIA). It appears at `at` seconds (useStageCue);
 * without `at`, it is there from frame 1.
 * Keep it short: the inspector counts longer labels as text to read.
 */
export function Label({ spot, at, place = "top-left", tone = "solid", className, children }: { spot: string; at?: number; place?: LabelPlace; tone?: LabelTone; className?: string; children: ReactNode }) {
  const t = useClock();
  const shown = at === undefined ? 1 : Math.min(1, Math.max(0, (t - at) / 0.3));
  return (
    <Spot id={spot} className="pointer-events-none">
      <span
        className={cx("absolute whitespace-nowrap rounded-md px-2.5 py-1 font-mono text-[20px] font-bold uppercase leading-none", PLACE[place], LABEL_TONE[tone], className)}
        // transform, not translate: Tailwind's -translate-x-1/2 of `place` uses the translate property.
        style={{ opacity: shown, transform: `translateY(${(1 - shown) * 6}px)` }}
      >
        {children}
      </span>
    </Spot>
  );
}

const NODE_STATE: Record<NodeState, string> = {
  ok: "border-ink/35",
  busy: "border-accent",
  fail: "border-red-600",
  off: "border-ink/20",
};

/**
 * A plan that grows (docs/analisis-reels-2026-10-22.md, the system design Reel):
 * nodes that appear, change state (ok, busy, fail with a red X, off), move and
 * get renamed by `events`, edges that draw when both ends are there and follow
 * them, and packets that travel along the edges. Times are seconds on the
 * clock of where it is (useStageCue in the world, useCue in a scene).
 * Coordinates are the board's own; place it inside a <Spot> or the world.
 */
export function Board({
  nodes,
  edges = [],
  events = [],
  packets = [],
  icons = {},
  width,
  height,
  className,
}: {
  nodes: BoardNode[];
  edges?: BoardEdge[];
  events?: BoardEvent[];
  packets?: BoardPacket[];
  /** An icon per node id: an official <Logo> or an <Icono>. */
  icons?: Record<string, ReactNode>;
  width: number;
  height: number;
  className?: string;
}) {
  const t = useClock();
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const views = new Map(nodes.map((n) => [n.id, nodeAt(n, events, t)]));
  const point = (id: string) => {
    const view = views.get(id);
    if (!view) throw new Error(`Board: "${id}" is not a node`);
    return view;
  };
  const pulse = 0.5 + 0.5 * Math.sin(t * Math.PI * 2);
  return (
    <div className={cx("absolute left-0 top-0", className)} style={{ width, height }}>
      <svg className="absolute inset-0 overflow-visible" width={width} height={height}>
        {edges.map((edge) => {
          const [a, b] = [point(edge.from), point(edge.to)];
          const drawn = edgeDrawn(edge, byId, t);
          const off = a.state === "off" || b.state === "off";
          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={a.x}
              y1={a.y}
              x2={a.x + (b.x - a.x) * drawn}
              y2={a.y + (b.y - a.y) * drawn}
              stroke="currentColor"
              strokeOpacity={off ? 0.2 : 0.55}
              strokeWidth={3}
              strokeDasharray={off ? "6 6" : undefined}
            />
          );
        })}
        {packets.map((packet, i) => {
          const p = packetAt(packet, t);
          if (p === null) return null;
          const [a, b] = [point(packet.from), point(packet.to)];
          return <circle key={i} cx={a.x + (b.x - a.x) * p} cy={a.y + (b.y - a.y) * p} r={7} className="fill-accent" />;
        })}
      </svg>
      {nodes.map((node) => {
        const view = point(node.id);
        if (view.shown <= 0) return null;
        return (
          <div
            key={node.id}
            data-board-node={node.id}
            className={cx("absolute flex items-center gap-2 whitespace-nowrap rounded-xl border-[3px] bg-surface px-3 py-2", NODE_STATE[view.state])}
            style={{
              left: view.x,
              top: view.y,
              translate: "-50% -50%",
              scale: `${0.85 + 0.15 * view.shown}`,
              opacity: view.state === "off" ? 0.4 * view.shown : view.shown,
              boxShadow: view.state === "busy" ? `0 0 0 ${4 + 6 * pulse}px color-mix(in srgb, var(--piece-accent) ${Math.round(35 * (1 - pulse))}%, transparent)` : undefined,
            }}
          >
            {icons[node.id] ? <span className="shrink-0">{icons[node.id]}</span> : null}
            <span className="font-mono text-[20px] font-bold uppercase leading-none">{view.label}</span>
            {view.state === "fail" ? (
              <svg className="absolute -right-3 -top-3" width={26} height={26} viewBox="0 0 26 26" aria-hidden>
                <circle cx={13} cy={13} r={13} className="fill-red-600" />
                <path d="M8 8 L18 18 M18 8 L8 18" stroke="white" strokeWidth={3.5} strokeLinecap="round" />
              </svg>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
