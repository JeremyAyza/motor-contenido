import { EASE, lerp, unit, useClock, useCue } from "@motor/video";
import { BarRow, BigWord, Chip, Example, InlineMark, Layer, PanelBody, Small } from "../parts.tsx";
import { ACCENT, GO, INK, LINE, MUTED, RUST, SURFACE } from "../world.tsx";
import { BARS, barMark } from "./python-js.tsx";

const SERVER = { x: 112, y: 420 };
const DB = { x: 430, y: 196 };
const CACHE = { x: 238, y: 420 };
const ROAD = `M ${SERVER.x + 40} ${SERVER.y - 20} C 260 ${SERVER.y - 30}, 330 ${DB.y + 120}, ${DB.x - 30} ${DB.y + 36}`;

/** The database as a violet cylinder, centered on x, y. */
function Database({ x, y, o }: { x: number; y: number; o: number }) {
  return (
    <div className="absolute" style={{ left: x - 40, top: y - 46, width: 80, opacity: o }}>
      <svg width={80} height={92} viewBox="0 0 80 92" aria-hidden>
        <path d="M4 14 v64 a36 12 0 0 0 72 0 v-64" fill="#2B2350" stroke={ACCENT} strokeWidth={2.5} />
        <ellipse cx={40} cy={14} rx={36} ry={12} fill="#3A2F6E" stroke={ACCENT} strokeWidth={2.5} />
        <path d="M4 40 a36 12 0 0 0 72 0 M4 62 a36 12 0 0 0 72 0" fill="none" stroke={ACCENT} strokeWidth={1.5} />
      </svg>
      <div data-ui="" className="text-center font-mono text-[12px] font-bold" style={{ color: ACCENT }}>base de datos</div>
    </div>
  );
}

/**
 * The myth: the four bars stay; Python and JavaScript leave and the camera
 * zooms on Rust and Go, nearly the same. "RUST NO SIEMPRE ES MÁS RÁPIDO"
 * lands. Then the band becomes a road from your server to the database: a
 * request crawls along it while the panel shows where the time goes; a
 * cache appears next to the server and the request comes back at once.
 */
export function Mito() {
  const t = useClock();
  const mito = useCue("mito:");
  const rust = useCue("Rust");
  const siempre = useCue("siempre");
  const servidor = useCue("servidor");
  const esperando = useCue("esperando");
  const datos = useCue("datos");
  const cache = useCue("caché");
  const lenguaje = useCue("lenguaje.");
  const others = EASE.in(unit(t, rust - 0.2, 0.3));
  const zoom = EASE.inOut(unit(t, rust, 0.6));
  const barsOut = EASE.in(unit(t, servidor - 0.5, 0.3));
  const road = EASE.out(unit(t, servidor, 0.5));
  const cached = t >= cache;
  // The request: slow to the database and back; with the cache, a short hop.
  const slow = (((t - esperando) / 2.4) % 1 + 1) % 1;
  const fast = (((t - cache) / 0.5) % 1 + 1) % 1;
  const reqPos = cached ? { x: lerp(SERVER.x + 40, CACHE.x - 30, Math.sin(fast * Math.PI)), y: SERVER.y - 20 } : null;
  return (
    <Layer>
      <div style={{ opacity: 1 - barsOut }}>
        <Small x={270} y={112} at={mito} center w={300} color={INK} size={14}>un mito común</Small>
        {BARS.map((b, i) => {
          const keep = b.id === "rust" || b.id === "go";
          if (!keep && others >= 1) return null;
          return (
            <div key={b.id} style={{ opacity: keep ? 1 : 1 - others }}>
              <BarRow x={36} y={keep ? lerp(150 + i * 82, 156 + i * 76, zoom) : 150 + i * 82} label={b.label} mark={barMark(b.id)} value={b.value} max={lerp(81, 15.5, keep ? zoom : 0)} width={360} color={b.color} at={-1} />
            </div>
          );
        })}
        <Small x={36} y={300} at={rust + 0.5} color={MUTED}>de cerca: las mismas dos barras</Small>
        <BigWord text="Rust no siempre es más rápido" x={270} y={340} align="center" size={38} width={468} color={INK} at={siempre} />
      </div>
      {road > 0 ? (
        <>
          <svg className="absolute left-0 top-0" width={540} height={960} aria-hidden style={{ opacity: road }}>
            <path d={ROAD} fill="none" stroke="#17191C" strokeWidth={22} strokeLinecap="round" />
            <path d={ROAD} fill="none" stroke="#5A6068" strokeWidth={2} strokeDasharray="10 10" />
          </svg>
          <div className="absolute flex items-center justify-center gap-[8px] rounded-[6px]" style={{ left: SERVER.x - 46, top: SERVER.y - 44, width: 92, height: 56, background: SURFACE, border: `2px solid ${LINE}`, opacity: road }}>
            <InlineMark lang="go" size={34} />
            <InlineMark lang="rust" size={30} />
          </div>
          <Small x={SERVER.x} y={SERVER.y + 18} at={servidor} center w={140} color={INK}>tu servidor</Small>
          <Database x={DB.x} y={DB.y} o={road} />
          {!cached && t >= esperando ? <Packet t={slow} /> : null}
          {reqPos ? <div className="absolute h-[14px] w-[22px] rounded-[2px]" style={{ left: reqPos.x - 11, top: reqPos.y - 7, background: "#EDE8DC" }} /> : null}
          {cached ? (
            <div data-ui="" className="absolute flex items-center justify-center rounded-[6px] font-mono text-[14px] font-bold" style={{ left: CACHE.x - 36, top: CACHE.y - 40, width: 72, height: 44, background: "#2B2350", border: `2px solid ${ACCENT}`, color: ACCENT, transform: `scale(${Math.min(1, EASE.out(unit(t, cache, 0.3)) * 1.05)})` }}>
              caché
            </div>
          ) : null}
          <div className="absolute" style={{ left: 36, top: 140, opacity: EASE.out(unit(t, datos, 0.3)) * (1 - EASE.in(unit(t, cache - 0.2, 0.25))) }}>
            <div data-ui="" className="font-mono text-[13px] font-bold" style={{ color: RUST }}>Rust: código 1,7x más rápido</div>
            <div className="font-display text-[58px] font-black leading-[1]" style={{ color: INK }}>0,03 %</div>
            <div data-ui="" className="font-mono text-[13px] font-bold" style={{ color: MUTED }}>más rápida la petición completa</div>
          </div>
          <div className="absolute" style={{ left: 36, top: 140, opacity: EASE.out(unit(t, cache + 0.1, 0.3)) }}>
            <div data-ui="" className="font-mono text-[13px] font-bold" style={{ color: ACCENT }}>con caché, en cualquier lenguaje</div>
            <div className="font-display text-[58px] font-black leading-[1]" style={{ color: ACCENT }}>20× más</div>
            <div data-ui="" className="font-mono text-[13px] font-bold" style={{ color: MUTED }}>rápida la petición</div>
          </div>
          <Chip x={370} y={470} at={lenguaje - 0.3} color={INK}>más que cambiar de lenguaje</Chip>
        </>
      ) : null}
      <PanelBody at={0}>
        <div className="font-mono text-[12px]" style={{ color: MUTED }}>Rust contra Go, mismo trabajo</div>
        <div className="mt-[4px] font-display text-[40px] font-black leading-[1]" style={{ color: INK }}>13,5 · 13,9</div>
        <div className="font-mono text-[12px]" style={{ color: MUTED }}>milisegundos</div>
        <div className="mt-[14px]" style={{ opacity: EASE.out(unit(t, esperando, 0.3)) }}>
          <div className="font-mono text-[12px]" style={{ color: INK }}>esperando a la base: 20 ms</div>
          <div className="mt-[3px] h-[12px] rounded-[2px]" style={{ width: cached ? 13 : 270, background: ACCENT, transition: "none" }} />
          <div className="mt-[8px] font-mono text-[12px]" style={{ color: INK }}>tu código: 17 µs Go, 10,2 µs Rust</div>
          <div className="mt-[3px] h-[12px] w-[3px] rounded-[1px]" style={{ background: GO }} />
          <div className="mt-[8px] font-mono text-[12px] font-bold" style={{ color: ACCENT, opacity: cached ? 1 : 0 }}>caché: 1 ms</div>
        </div>
      </PanelBody>
      <Example x={216} y={772} at={0} />
    </Layer>
  );
}

/** The request crawling along the road to the database and back. */
function Packet({ t }: { t: number }) {
  // Sample the cubic road by hand: the same control points as ROAD.
  const k = t < 0.5 ? t * 2 : (1 - t) * 2;
  const p0 = [SERVER.x + 40, SERVER.y - 20];
  const p1 = [260, SERVER.y - 30];
  const p2 = [330, DB.y + 120];
  const p3 = [DB.x - 30, DB.y + 36];
  const u = 1 - k;
  const x = u * u * u * p0[0] + 3 * u * u * k * p1[0] + 3 * u * k * k * p2[0] + k * k * k * p3[0];
  const y = u * u * u * p0[1] + 3 * u * u * k * p1[1] + 3 * u * k * k * p2[1] + k * k * k * p3[1];
  return <div className="absolute h-[14px] w-[22px] rounded-[2px]" style={{ left: x - 11, top: y - 7, background: "#EDE8DC", boxShadow: "0 2px 0 rgba(0,0,0,0.5)" }} />;
}
