import { EASE, keys, unit, useClock, useCue } from "@motor/video";
import { DIM, INK, MUTED, OK, TUX } from "../world.tsx";
import { Big, Card, Chip, Hi, Ic, Layer, Note, Rise, Rows, SIDE, Term } from "../parts.tsx";

/**
 * Control: "CONTROL" right of the presenter over the distro's layers, with a
 * "CAMBIAR" chip on the desktop. Then the desktop is swapped (GNOME out, KDE
 * in), the file manager too, the processes at boot count down from 148 to
 * 31 next to a terminal, and "$0" lands as a seal.
 */
export function Control() {
  const t = useClock();
  const control = useCue("control");
  const no = useCue("¿No");
  const escritorio = useCue("escritorio?");
  const cambias = useCue("Cambias");
  const kde = useCue("KDE.");
  const explorador = useCue("explorador");
  const tambien = useCue("También.");
  const quieres = useCue("¿Quieres");
  const nada = useCue("nada");
  const personalizar = useCue("personalizar");
  const se = useCue("Se");
  const siempre = useCue("siempre,");
  const swapDesk = EASE.inOut(unit(t, cambias, 0.45));
  const swapFiles = EASE.inOut(unit(t, tambien - 0.1, 0.45));
  const procs = Math.round(keys(t, [[nada - 0.2, 148], [nada + 0.9, 31]]));
  return (
    <Layer>
      <Rows
        x={56}
        y={180}
        w={428}
        rowH={56}
        gap={8}
        at={-0.3}
        until={no - 0.1}
        size={17}
        rows={[
          { text: "Software y valores", tag: "cada distro", at: -1, color: TUX },
          { text: "Escritorio", tag: "cambiar", at: control, color: TUX },
          { text: "Gestor de paquetes", tag: "cambiar", at: control + 0.2, color: TUX },
          { text: "Kernel de Linux", tag: "compartido", at: -1, color: OK },
        ]}
      />
      <Big x={SIDE.x} y={SIDE.y + 14} w={SIDE.w} size={48} at={control - 0.1} until={no} color={TUX} upper>
        Control
      </Big>
      <Rise x={36} y={170} w={468} h={270} at={escritorio - 0.4} until={quieres - 0.1}>
        <div className="absolute inset-0 overflow-hidden rounded-[8px]">
          <div className="absolute inset-0" style={{ transform: `translateX(${-swapDesk * 110}%)`, display: swapDesk >= 1 ? "none" : undefined }}>
            <Card border="#2A3441" bg="#3B1D4A">
              <div className="absolute inset-0" style={{ background: "linear-gradient(140deg, #2C1340, #7B2F6B 60%, #C1576A)" }} />
              <div className="absolute left-0 right-0 top-0 h-[18px]" style={{ background: "#111" }} />
              <div className="absolute bottom-[14px] left-1/2 flex -translate-x-1/2 gap-[8px] rounded-[10px] px-[10px] py-[6px]" style={{ background: "rgba(20,20,24,0.75)" }}>
                {["#E95420", "#3584E4", "#F6D32D", "#33D17A", "#9141AC"].map((c) => (
                  <span key={c} className="block h-[22px] w-[22px] rounded-[6px]" style={{ background: c }} />
                ))}
              </div>
              {swapDesk <= 0 ? <Chip x={60} y={44} at={-5} color={INK} size={12}>GNOME</Chip> : null}
            </Card>
          </div>
          <div className="absolute inset-0" style={{ transform: `translateX(${(1 - swapDesk) * 110}%)`, display: swapDesk <= 0 ? "none" : undefined }}>
            <Card border="#2A3441" bg="#0E2340">
              <div className="absolute inset-0" style={{ background: "linear-gradient(200deg, #F5B37A, #E86D58 40%, #2B3F7A 85%)" }} />
              <div className="absolute bottom-0 left-0 right-0 flex h-[26px] items-center gap-[8px] px-[10px]" style={{ background: "rgba(16,22,34,0.88)" }}>
                <span className="block h-[14px] w-[14px] rounded-full" style={{ background: "#3DAEE9" }} />
                {[0, 1, 2].map((i) => (
                  <span key={i} className="block h-[12px] w-[28px] rounded-[3px]" style={{ background: "#4B5B78" }} />
                ))}
              </div>
              {swapDesk >= 1 ? <Chip x={44} y={30} at={-5} color={INK} size={12}>KDE</Chip> : null}
            </Card>
          </div>
        </div>
      </Rise>
      <Big x={270} y={452} w={468} size={34} at={cambias} until={quieres - 0.1} align="center">
        ¿No te gusta? <Hi color={TUX}>Cámbialo.</Hi>
      </Big>
      <Rise x={96} y={510} w={348} h={190} at={explorador - 0.2} until={quieres - 0.1}>
        <div className="absolute inset-0 overflow-hidden rounded-[8px]">
          {swapFiles < 1 ? (
            <div className="absolute inset-0" style={{ transform: `translateX(${-swapFiles * 110}%)`, opacity: 1 - swapFiles }}>
              <FileManager name="Archivos" side="left" labels={swapFiles <= 0} />
            </div>
          ) : null}
          {swapFiles > 0 ? (
            <div className="absolute inset-0" style={{ transform: `translateX(${(1 - swapFiles) * 110}%)`, opacity: swapFiles }}>
              <FileManager name="Otro, a tu gusto" side="top" labels={swapFiles >= 1} />
            </div>
          ) : null}
        </div>
      </Rise>
      <Rise x={36} y={180} w={210} h={200} at={quieres - 0.1} until={siempre - 0.2}>
        <Card border="#2A3441">
          <div data-ui="" className="px-[14px] pt-[12px] font-mono text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: MUTED }}>Procesos al arrancar</div>
          <div className="px-[14px] font-display text-[78px] font-black leading-none" style={{ color: TUX }}>{procs}</div>
          <div className="mx-[14px] mt-[10px] h-[8px] rounded-full" style={{ background: "#232B36" }}>
            <div className="h-full rounded-full" style={{ width: `${(procs / 148) * 100}%`, background: TUX }} />
          </div>
        </Card>
      </Rise>
      <Rise x={258} y={180} w={246} h={200} at={quieres} until={siempre - 0.2}>
        <Term
          title="bash"
          size={13}
          lines={[
            { text: "ps -e | wc -l", at: quieres + 0.1, prompt: true },
            { text: "148", at: quieres + 0.6, color: TUX },
            { text: "systemctl disable …", at: nada, prompt: true },
            { text: "ps -e | wc -l", at: nada + 0.6, prompt: true },
            { text: "31", at: nada + 1.0, color: TUX },
          ]}
        />
      </Rise>
      <Note x={270} y={388} at={quieres + 0.3} until={siempre - 0.2} size={12}>Ejemplo ilustrativo</Note>
      <Chip x={160} y={438} at={nada + 0.2} until={siempre - 0.2} color={TUX} size={14}>casi nada corriendo</Chip>
      <Note x={270} y={428} at={personalizar - 0.3} until={siempre - 0.2} size={15} color={DIM}>o</Note>
      <Chip x={390} y={438} at={personalizar} until={siempre - 0.2} color={TUX} size={14}>todo a tu medida</Chip>
      <Big x={270} y={492} w={468} size={34} at={se} until={siempre - 0.2} align="center">
        Las dos se <Hi color={TUX}>pueden.</Hi>
      </Big>
      <Big x={270} y={330} w={468} size={170} at={siempre - 0.1} align="center" color={OK}>
        $0
      </Big>
      <Note x={270} y={530} at={siempre + 0.1} size={20} color={OK}>normalmente gratis</Note>
    </Layer>
  );
}

/** A file manager drawn in code; while it slides, its labels are off so no text crosses the frame's margin. */
function FileManager({ name, side, labels }: { name: string; side: "left" | "top"; labels: boolean }) {
  const folders = ["Documentos", "Descargas", "Imágenes", "Música", "Proyectos", "Videos"];
  return (
    <Card border="#2A3441" bg="#1B2029">
      <div data-ui="" className="flex h-[26px] items-center px-[10px] font-sans text-[13px] font-bold" style={{ background: "#232A35", color: INK }}>
        {labels ? name : ""}
      </div>
      <div className="flex" style={{ height: "calc(100% - 26px)", flexDirection: side === "left" ? "row" : "column" }}>
        <div style={{ width: side === "left" ? 78 : "100%", height: side === "left" ? "100%" : 22, background: "#161B22" }} />
        <div className="grid flex-1 grid-cols-3 gap-[8px] p-[10px]">
          {folders.map((f) => (
            <div key={f} data-ui="" className="flex flex-col items-center gap-[2px]">
              <Ic name="folder" size={24} color={side === "left" ? "#5E9BE8" : TUX} />
              <span className="font-sans text-[12px]" style={{ color: "#BAC3CF" }}>{labels ? f : " "}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
