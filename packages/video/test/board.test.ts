import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { APPEAR_S, DRAW_S, edgeDrawn, edgePath, fan, MOVE_S, nodeAt, packetAt, pointOnEdge, PULSE_RUN_S, pulseAt, type BoardNode } from "../src/kit/board.ts";

const server: BoardNode = { id: "server", x: 100, y: 100, label: "Servidor", at: 2 };

describe("nodeAt", () => {
  it("appears at its time", () => {
    assert.equal(nodeAt(server, [], 1).shown, 0);
    assert.ok(Math.abs(nodeAt(server, [], 2 + APPEAR_S / 2).shown - 0.5) < 1e-9);
    assert.equal(nodeAt(server, [], 3).shown, 1);
  });

  it("is there from frame 1 without a time, and so is its edge", () => {
    const user = { id: "user", x: 0, y: 0, label: "Usuario" };
    const db = { id: "db", x: 0, y: 50, label: "Base" };
    assert.equal(nodeAt(user, [], 0).shown, 1);
    assert.equal(edgeDrawn({ from: "user", to: "db" }, new Map([["user", user], ["db", db]]), 0), 1);
  });

  it("changes state, label and place when its events come, and keeps them", () => {
    const events = [
      { at: 4, node: "server", state: "fail" as const },
      { at: 5, node: "server", x: 300, label: "Servidor 2" },
    ];
    assert.equal(nodeAt(server, events, 3.9).state, "ok");
    assert.equal(nodeAt(server, events, 4).state, "fail");
    const moving = nodeAt(server, events, 5 + MOVE_S / 2);
    assert.ok(moving.x > 100 && moving.x < 300);
    assert.deepEqual(nodeAt(server, events, 9), { x: 300, y: 100, state: "fail", label: "Servidor 2", shown: 1 });
  });
});

describe("edgeDrawn", () => {
  const nodes = new Map([
    ["user", { id: "user", x: 0, y: 0, label: "Usuario" }],
    ["server", server],
  ]);

  it("waits for both ends before drawing", () => {
    assert.equal(edgeDrawn({ from: "user", to: "server" }, nodes, 2), 0);
    assert.equal(edgeDrawn({ from: "user", to: "server" }, nodes, 2 + APPEAR_S + DRAW_S), 1);
  });

  it("names the missing node", () => {
    assert.throws(() => edgeDrawn({ from: "user", to: "db" }, nodes, 1), /db is not a node/);
  });
});

describe("packetAt", () => {
  it("travels only during its time", () => {
    assert.equal(packetAt({ from: "a", to: "b", at: 1 }, 0.5), null);
    assert.equal(packetAt({ from: "a", to: "b", at: 1, dur: 1 }, 1.5), 0.5);
    assert.equal(packetAt({ from: "a", to: "b", at: 1 }, 3), null);
  });
});

describe("curved edges", () => {
  const a = { x: 0, y: 0 };
  const b = { x: 100, y: 0 };

  it("a straight edge is the line between its ends", () => {
    assert.deepEqual(pointOnEdge(a, b, 0, 0.5), { x: 50, y: 0 });
    assert.equal(edgePath(a, b), "M 0 0 Q 50 0 100 0");
  });

  it("a curve bows square to the line and still meets both ends", () => {
    const mid = pointOnEdge(a, b, 0.2, 0.5);
    assert.equal(mid.x, 50);
    assert.ok(Math.abs(mid.y - 10) < 1e-9);
    assert.deepEqual(pointOnEdge(a, b, 0.2, 0), a);
    assert.deepEqual(pointOnEdge(a, b, 0.2, 1), b);
  });

  it("a pulse runs the line after it is drawn, once per period", () => {
    assert.equal(pulseAt(2, 5, 4.9), null);
    assert.equal(pulseAt(2, 5, 5), 0);
    assert.ok(Math.abs((pulseAt(2, 5, 5 + PULSE_RUN_S / 2) ?? -1) - 0.5) < 1e-9);
    assert.equal(pulseAt(2, 5, 5 + PULSE_RUN_S + 0.1), null);
    assert.equal(pulseAt(2, 5, 7), 0);
    assert.equal(pulseAt(undefined, 5, 6), null);
  });

  it("a fan bows its outer lines the most and keeps the middle straight", () => {
    const edges = fan(["a", "b", "c"], "agent", { curve: 0.3, glow: "#8B7CF6" });
    assert.deepEqual(
      edges.map((e) => e.curve),
      [-0.3, 0, 0.3],
    );
    assert.ok(edges.every((e) => e.to === "agent" && e.glow === "#8B7CF6"));
    assert.equal(fan(["solo"], "agent")[0].curve, 0);
  });
});
