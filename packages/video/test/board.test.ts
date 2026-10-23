import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { APPEAR_S, DRAW_S, edgeDrawn, MOVE_S, nodeAt, packetAt, type BoardNode } from "../src/kit/board.ts";

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
