import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { revisarVisuales, type Brief } from "../src/brief.ts";

const entrada = (recurso?: string) => ({
  afirmacion: "Una afirmación de la lámina",
  prueba: "Un dato de facts.json",
  ...(recurso ? { visual: { recurso, que: "Lo que se ve, descrito en concreto" } } : {}),
});

const conEsqueleto = (esqueleto: ReturnType<typeof entrada>[]) => ({ esqueleto }) as unknown as Brief;

describe("revisarVisuales", () => {
  it("no pide visual a la portada ni al cierre", () => {
    assert.deepEqual(revisarVisuales(conEsqueleto([entrada(), entrada("proceso"), entrada("datos"), entrada("metafora"), entrada()])), []);
  });

  it("avisa qué láminas interiores no tienen visual", () => {
    const [aviso] = revisarVisuales(conEsqueleto([entrada(), entrada("proceso"), entrada(), entrada(), entrada()]));
    assert.match(aviso, /Las láminas 3 y 4 del esqueleto no tienen visual/);
  });

  it("avisa si un recurso ocupa más de la mitad de las interiores", () => {
    const avisos = revisarVisuales(conEsqueleto([entrada(), entrada("proceso"), entrada("proceso"), entrada("datos"), entrada("proceso"), entrada()]));
    assert.match(avisos.join("\n"), /"Diagrama de proceso" está en 3 de 4 láminas interiores/);
  });
});
