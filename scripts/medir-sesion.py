"""Measures a Claude Code session that made a piece (docs/plan-velocidad-reels.md, "Medición").

Usage:
  python scripts/medir-sesion.py <transcript.jsonl> [--desde 2026-11-03T14:00] [--hasta 2026-11-03T16:00] [--json]

Transcripts live in ~/.claude/projects/<repo>/<session>.jsonl; a session's subagents in
<session>/subagents/*.jsonl, which are added up on their own line. --desde and --hasta (UTC, as the
transcript stores it) cut a session that made more than one piece.

It prints where the time went (model, commands, waiting for the person), the output tokens and an
estimate of how many were thinking (the transcript keeps thinking encrypted: its size is output
tokens minus the visible text), the average context, and the counts the plan tracks: full renders,
scene renders, frame sheets, typechecks, critic rounds and agy calls.
"""

import argparse
import glob
import json
import os
import re
import sys
from collections import Counter
from datetime import datetime

CHARS_PER_TOKEN = 3.5
LONG_GAP_S = 120


def parse_time(value):
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def classify(command):
    """The plan's categories for a shell command, the slowest first (a command can chain several)."""
    found = []
    if re.search(r"(^|[\s;&|])agy(\s|$)|npm run agy", command):
        found.append("agy")
    if "video:render" in command:
        found.append("render_scene" if "--escena" in command else "render_full")
    if "video:frames" in command or "remotion still" in command:
        found.append("frames")
    if "video:critique" in command and "--guion" not in command:
        found.append("critique")
    if "video:prepare" in command:
        found.append("voice")
    if re.search(r"npm run typecheck|\btsc\b|video:check", command):
        found.append("typecheck")
    return found


def in_window(t, since, until):
    return (since is None or t >= since) and (until is None or t <= until)


def analyze(path, since=None, until=None):
    messages = {}
    order = []
    events = []
    tool_starts = {}
    tool_seconds = Counter()
    counts = Counter()
    tools = Counter()
    for line in open(path, encoding="utf-8"):
        try:
            entry = json.loads(line)
        except json.JSONDecodeError:
            continue
        stamp = entry.get("timestamp")
        if not stamp:
            continue
        t = parse_time(stamp)
        if not in_window(t, since, until):
            continue
        kind = entry.get("type")
        if kind == "assistant":
            message = entry["message"]
            mid = message.get("id")
            if mid not in messages:
                messages[mid] = {"usage": {}, "visible": 0, "model": message.get("model")}
                order.append(mid)
            if message.get("usage"):
                messages[mid]["usage"] = message["usage"]
            for block in message.get("content", []):
                if block["type"] == "text":
                    messages[mid]["visible"] += len(block["text"])
                elif block["type"] == "tool_use":
                    messages[mid]["visible"] += len(json.dumps(block["input"], ensure_ascii=False))
                    tools[block["name"]] += 1
                    command = block["input"].get("command", "") if block["name"] in ("Bash", "PowerShell") else ""
                    categories = classify(command) if command else []
                    if block["name"] in ("Agent", "Task") and "critico-ciego-video" in str(block["input"].get("subagent_type")):
                        categories = ["critique_agent"]
                    for category in categories:
                        counts[category] += 1
                    tool_starts[block["id"]] = (t, categories[0] if categories else None)
            events.append((t, "model"))
        elif kind == "user":
            content = entry.get("message", {}).get("content")
            results = [c for c in content if isinstance(c, dict) and c.get("type") == "tool_result"] if isinstance(content, list) else []
            if results:
                for result in results:
                    start = tool_starts.get(result.get("tool_use_id"))
                    if start and start[1]:
                        tool_seconds[start[1]] += max(0.0, (t - start[0]).total_seconds())
                events.append((t, "tool"))
            elif not entry.get("isMeta"):
                events.append((t, "person"))

    events.sort(key=lambda e: e[0])
    seconds = Counter()
    long_gaps = 0
    for previous, current in zip(events, events[1:]):
        gap = max(0.0, (current[0] - previous[0]).total_seconds())
        seconds[current[1]] += gap
        if current[1] == "model" and gap > LONG_GAP_S:
            long_gaps += 1

    contexts = []
    output = 0
    visible = 0
    models = Counter()
    for mid in order:
        usage = messages[mid]["usage"]
        contexts.append((usage.get("input_tokens") or 0) + (usage.get("cache_read_input_tokens") or 0) + (usage.get("cache_creation_input_tokens") or 0))
        output += usage.get("output_tokens") or 0
        visible += messages[mid]["visible"]
        models[messages[mid]["model"]] += 1

    span = (events[-1][0] - events[0][0]).total_seconds() if len(events) > 1 else 0
    return {
        "file": os.path.basename(path),
        "start": events[0][0].isoformat() if events else None,
        "end": events[-1][0].isoformat() if events else None,
        "span_min": round(span / 60, 1),
        "model_min": round(seconds["model"] / 60, 1),
        "commands_min": round(seconds["tool"] / 60, 1),
        "person_min": round(seconds["person"] / 60, 1),
        "calls": len(order),
        "models": dict(models),
        "output_tokens": output,
        "thinking_tokens_est": max(0, int(output - visible / CHARS_PER_TOKEN)),
        "context_avg": int(sum(contexts) / max(1, len(contexts))),
        "model_gaps_over_2min": long_gaps,
        "counts": {
            "render_full": counts["render_full"],
            "render_scene": counts["render_scene"],
            "frames": counts["frames"],
            "typecheck": counts["typecheck"],
            "critique": max(counts["critique"], counts["critique_agent"]),
            "voice": counts["voice"],
            "agy": counts["agy"],
        },
        "command_min_by_kind": {k: round(v / 60, 1) for k, v in tool_seconds.most_common()},
        "tools": dict(tools.most_common(10)),
    }


def print_report(report, subagents):
    c = report["counts"]
    print(f"{report['file']}  {report['start']} -> {report['end']}  ({report['span_min']} min)")
    print(f"  time: model {report['model_min']} min, commands {report['commands_min']} min, waiting for the person {report['person_min']} min")
    print(f"  tokens: {report['output_tokens']:,} output, ~{report['thinking_tokens_est']:,} thinking, context {report['context_avg']:,} on average ({report['calls']} calls)")
    print(f"  full renders {c['render_full']}, scene renders {c['render_scene']}, frame sheets {c['frames']}, typechecks {c['typecheck']}, critic rounds {c['critique']}, voice {c['voice']}, agy {c['agy']}")
    if report["command_min_by_kind"]:
        print("  command minutes: " + ", ".join(f"{k} {v}" for k, v in report["command_min_by_kind"].items()))
    print(f"  model gaps over 2 min: {report['model_gaps_over_2min']}")
    for sub in subagents:
        print(f"  subagent {sub['file'][:28]}: {sub['span_min']} min, {sub['output_tokens']:,} output, models {sub['models']}")


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("transcript")
    parser.add_argument("--desde", help="UTC start, e.g. 2026-11-03T14:00")
    parser.add_argument("--hasta", help="UTC end")
    parser.add_argument("--json", action="store_true", help="print JSON instead of the summary")
    args = parser.parse_args()
    since = parse_time(args.desde + ("" if "+" in args.desde or args.desde.endswith("Z") else "+00:00")) if args.desde else None
    until = parse_time(args.hasta + ("" if "+" in args.hasta or args.hasta.endswith("Z") else "+00:00")) if args.hasta else None
    report = analyze(args.transcript, since, until)
    sub_dir = os.path.join(args.transcript[: -len(".jsonl")], "subagents")
    subagents = [analyze(p, since, until) for p in sorted(glob.glob(os.path.join(sub_dir, "*.jsonl")))]
    subagents = [s for s in subagents if s["calls"]]
    if args.json:
        print(json.dumps({"session": report, "subagents": subagents}, ensure_ascii=False, indent=2))
    else:
        print_report(report, subagents)


if __name__ == "__main__":
    main()
