import { evolvePath, interpolatePath } from "@remotion/paths";
import type { SVGProps } from "react";
import { DUR, EASE, unit } from "./grammar.tsx";
import { useClock } from "./scene.ts";
import { Sfx, usePop } from "./sfx.tsx";

/*
 * Drawing with paths, on @remotion/paths (Remotion's own, frame by frame):
 * a stroke that draws itself, a shape that turns into another and words that
 * pop in one by one. What travels along a path is <Along> (props.tsx). Times
 * are seconds on the clock of where the component is (useCue in a scene,
 * useStageCue in a stage's world).
 */

type PathProps = Omit<SVGProps<SVGPathElement>, "d" | "ref">;

/** How much of a stroke is drawn at `t`: the dash props for a <path>, from nothing at `at` to all of it at `at + dur`. */
export function drawn(d: string, t: number, at: number, dur: number = DUR.slow, ease: (p: number) => number = EASE.inOut) {
  return evolvePath(ease(unit(t, at, dur)), d);
}

/**
 * A stroke that draws itself from `at`, in `dur` seconds: an arrow being
 * traced, a connection, the line of a chart. It is a <path>, so it goes
 * inside the scene's <svg>; the rest of the props (stroke, strokeWidth...)
 * are the path's. Before `at` it is not there.
 */
export function DrawPath({ d, at, dur = DUR.slow, ease = EASE.inOut, stroke = "currentColor", strokeWidth = 6, fill = "none", ...rest }: PathProps & { d: string; at: number; dur?: number; ease?: (p: number) => number }) {
  const t = useClock();
  if (t < at) return null;
  return <path d={d} stroke={stroke} strokeWidth={strokeWidth} fill={fill} strokeLinecap="round" strokeLinejoin="round" {...drawn(d, t, at, dur, ease)} {...rest} />;
}

/**
 * A shape that turns into another from `at`, in `dur` seconds: the world
 * changing state instead of being replaced (a box that becomes a server, a
 * cloud that becomes a lock). Both paths in the same coordinates; it works
 * best when they have a similar number of points. A <path>, inside an <svg>.
 */
export function Morph({ from, to, at, dur = DUR.slow, ease = EASE.inOut, ...rest }: PathProps & { from: string; to: string; at: number; dur?: number; ease?: (p: number) => number }) {
  const t = useClock();
  const p = ease(unit(t, at, dur));
  return <path d={p <= 0 ? from : p >= 1 ? to : interpolatePath(p, from, to)} {...rest} />;
}

/**
 * A sentence whose words pop in one by one from `at`, `stagger` seconds
 * apart, with a soft blip on the first: for the words that build the idea
 * on screen (not the captions). Six words at most, like any text on screen.
 */
export function SplitWords({ text, at, stagger = 0.08, sound = "blip", className }: { text: string; at: number; stagger?: number; sound?: string | null; className?: string }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <span className={`inline-flex flex-wrap justify-center gap-x-[0.28em] ${className ?? ""}`}>
      {sound ? <Sfx id={sound} at={at} /> : null}
      {words.map((word, i) => (
        <Word key={i} at={at + i * stagger}>
          {word}
        </Word>
      ))}
    </span>
  );
}

function Word({ at, children }: { at: number; children: string }) {
  const p = usePop(at);
  return (
    <span className="inline-block" style={{ opacity: Math.min(1, p * 2), transform: `translateY(${(1 - Math.min(1, p)) * 18}px) scale(${0.8 + 0.2 * p})` }}>
      {children}
    </span>
  );
}
