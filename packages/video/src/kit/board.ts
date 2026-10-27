/*
 * The state of a <Board> at a moment: pure, so the tests check it without a
 * browser. A board is a plan that grows: nodes appear, change state, move and
 * get renamed when a word is said, and the edges follow them.
 */

export type NodeState = "ok" | "busy" | "fail" | "off";

export type BoardNode = {
  id: string;
  /** Center of the node, in the board's coordinates. */
  x: number;
  y: number;
  label: string;
  /** When it appears, in seconds (useStageCue in the world, useCue in a scene). Without it, it is there from frame 1. */
  at?: number;
};

/** A change of a node at `at` seconds: its state, its place or its label. */
export type BoardEvent = { at: number; node: string; state?: NodeState; x?: number; y?: number; label?: string };

export type BoardEdge = {
  from: string;
  to: string;
  at?: number;
  /**
   * How much the line bends, as a fraction of its length: 0 is straight, 0.2
   * bows to the left of the way from `from` to `to`, -0.2 to the right.
   */
  curve?: number;
  /** A color for the line and its halo, as in a neon diagram. Without it, the ink at 55%. */
  glow?: string;
  /** Seconds between lights that run along the line from `from` to `to`, once it is drawn. */
  pulse?: number;
};

type Point = { x: number; y: number };

/** The control point of an edge's curve: off its middle, square to it. */
export function edgeControl(a: Point, b: Point, curve = 0): Point {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return { x: (a.x + b.x) / 2 - dy * curve, y: (a.y + b.y) / 2 + dx * curve };
}

/** The point at fraction `p` (0 to 1) of an edge, on its curve. */
export function pointOnEdge(a: Point, b: Point, curve: number | undefined, p: number): Point {
  const c = edgeControl(a, b, curve);
  const q = 1 - p;
  return { x: q * q * a.x + 2 * q * p * c.x + p * p * b.x, y: q * q * a.y + 2 * q * p * c.y + p * p * b.y };
}

/** The SVG path of an edge. */
export function edgePath(a: Point, b: Point, curve = 0): string {
  const c = edgeControl(a, b, curve);
  return `M ${a.x} ${a.y} Q ${c.x} ${c.y} ${b.x} ${b.y}`;
}

/** How long a pulse takes to run the whole line, in seconds. */
export const PULSE_RUN_S = 0.9;

/**
 * Where the light of a pulsing edge is (0 to 1), or null between lights.
 * `drawnAt` is when the edge finished drawing; the first light leaves then.
 */
export function pulseAt(period: number | undefined, drawnAt: number, t: number): number | null {
  if (!period || t < drawnAt) return null;
  const phase = (t - drawnAt) % period;
  return phase > PULSE_RUN_S ? null : phase / PULSE_RUN_S;
}

/**
 * A fan of edges from several nodes into one (GitHub, Postgres, Slack and
 * Figma into the agent): the outer lines bow the most, and the middle one
 * stays straight, so they meet without crossing.
 */
export function fan(from: string[], to: string, { curve = 0.2, ...rest }: Omit<BoardEdge, "from" | "to"> = {}): BoardEdge[] {
  const middle = (from.length - 1) / 2;
  return from.map((id, i) => ({ from: id, to, ...rest, curve: middle ? (curve * (i - middle)) / middle : 0 }));
}

/** A dot that travels along the edge from `from` to `to`, starting at `at`, in `dur` seconds (0.8 by default). */
export type BoardPacket = { from: string; to: string; at: number; dur?: number };

export type NodeView = { x: number; y: number; state: NodeState; label: string; shown: number };

/** How long a node takes to appear and to move, in seconds. */
export const APPEAR_S = 0.35;
export const MOVE_S = 0.6;
export const DRAW_S = 0.5;

const clamp = (t: number) => Math.min(1, Math.max(0, t));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Where a node is, how it looks and how visible it is (0 to 1) at `t` seconds. */
export function nodeAt(node: BoardNode, events: BoardEvent[], t: number): NodeView {
  const shown = node.at === undefined ? 1 : clamp((t - node.at) / APPEAR_S);
  let view: NodeView = { x: node.x, y: node.y, state: "ok", label: node.label, shown };
  const own = events.filter((e) => e.node === node.id).sort((a, b) => a.at - b.at);
  for (const event of own) {
    if (t < event.at) break;
    const p = easeInOut(clamp((t - event.at) / MOVE_S));
    view = {
      ...view,
      x: event.x === undefined ? view.x : view.x + (event.x - view.x) * p,
      y: event.y === undefined ? view.y : view.y + (event.y - view.y) * p,
      state: event.state ?? view.state,
      label: event.label ?? view.label,
    };
  }
  return view;
}

/** How much of an edge is drawn (0 to 1): it starts when both ends are there and at its own `at`; without any of them, it is drawn from frame 1. */
export function edgeDrawn(edge: BoardEdge, nodes: Map<string, BoardNode>, t: number): number {
  const from = nodes.get(edge.from);
  const to = nodes.get(edge.to);
  if (!from || !to) throw new Error(`Board edge ${edge.from} → ${edge.to}: ${!from ? edge.from : edge.to} is not a node`);
  const start = edgeStart(edge, nodes);
  return start === -Infinity ? 1 : clamp((t - start) / DRAW_S);
}

/** When an edge starts drawing: when both ends are there and at its own `at`; -Infinity if it is there from frame 1. */
export function edgeStart(edge: BoardEdge, nodes: Map<string, BoardNode>): number {
  const from = nodes.get(edge.from);
  const to = nodes.get(edge.to);
  return Math.max(edge.at ?? -Infinity, from?.at === undefined ? -Infinity : from.at + APPEAR_S, to?.at === undefined ? -Infinity : to.at + APPEAR_S);
}

/** Where a packet is along its edge (0 to 1), or null when it is not traveling. */
export function packetAt(packet: BoardPacket, t: number): number | null {
  const p = (t - packet.at) / (packet.dur ?? 0.8);
  return p < 0 || p > 1 ? null : easeInOut(p);
}
