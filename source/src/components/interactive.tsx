"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";


/* ---------- 3D tilt card with glare ---------- */
export function Tilt({ children, className = "", max = 10, style }: { children: ReactNode; className?: string; max?: number; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current!; const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${(x - .5) * max * 2}deg`); el.style.setProperty("--rx", `${(.5 - y) * max * 2}deg`);
    el.style.setProperty("--mx", `${x * 100}%`); el.style.setProperty("--my", `${y * 100}%`);
  };
  const off = () => { const el = ref.current!; el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); };
  return <div ref={ref} onPointerMove={on} onPointerLeave={off} className={`tilt relative ${className}`} style={style}>{children}<span className="glare" aria-hidden="true" /></div>;
}

/* ---------- Multi-step booking ---------- */
export function BookingForm({ services }: { services: { slug: string; name: string }[] }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ service: "", when: "", name: "", phone: "", zip: "", note: "" });
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof data, v: string) => setData((d) => ({ ...d, [k]: v }));
  const steps = ["Service", "Time", "Details"];
  const can = step === 0 ? !!data.service : step === 1 ? !!data.when : data.name.length > 1 && data.phone.length > 6 && data.zip.length > 3;
  const slots = ["ASAP (emergency)", "Today 12–2pm", "Today 4–6pm", "Tomorrow 8–10am", "Tomorrow 12–2pm", "Pick another day"];
  if (done) return (
    <div className="mx-dialog rounded-[2rem] bg-navy p-10 text-white">
      <div className="mx-pop grid h-16 w-16 place-items-center rounded-full bg-mint text-ink"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg></div>
      <h3 className="h-lg mt-6">You&apos;re booked, {data.name.split(" ")[0]}.</h3>
      <p className="mt-4 text-white/80">{data.service} · {data.when}. We&apos;ll text {data.phone} with your plumber&apos;s name and photo. <span className="text-sun">(Demo: nothing was sent.)</span></p>
    </div>
  );
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (step < 2) setStep(step + 1); else setDone(true); }} className="rounded-[2rem] bg-white p-6 text-ink shadow-[0_40px_120px_-40px_rgba(7,17,31,.45)] ring-1 ring-ink/10 md:p-10">
      <ol className="mb-8 flex gap-2" aria-label="Progress">
        {steps.map((s, i) => (
          <li key={s} className="flex-1">
            <span className="block h-1.5 overflow-hidden rounded-full bg-ink/10"><span className="block h-full origin-left bg-sun transition-transform duration-700 [transition-timing-function:var(--ease-expo)]" style={{ transform: `scaleX(${i <= step ? 1 : 0})` }} /></span>
            <span className={`mt-2 block text-xs font-semibold uppercase tracking-widest ${i === step ? "text-ink" : "text-ink/75"}`} aria-current={i === step ? "step" : undefined}>{i + 1}. {s}</span>
          </li>
        ))}
      </ol>
      <div key={step} className="mx-panel min-h-[18rem]">
        {step === 0 && (
          <fieldset><legend className="font-display text-2xl font-bold">What can we help with?</legend>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {[...services.map((s) => s.name), "Something else"].map((n) => (
                <label key={n} className={`cursor-pointer rounded-2xl p-4 font-semibold ring-1 transition ${data.service === n ? "bg-navy text-white ring-ink" : "ring-ink/15 hover:ring-ink/40"}`}>
                  <input type="radio" name="service" value={n} className="sr-only" checked={data.service === n} onChange={() => set("service", n)} />{n}
                </label>
              ))}
            </div>
          </fieldset>
        )}
        {step === 1 && (
          <fieldset><legend className="font-display text-2xl font-bold">When suits you?</legend>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {slots.map((n) => (
                <label key={n} className={`cursor-pointer rounded-2xl p-4 font-semibold ring-1 transition ${data.when === n ? "bg-navy text-white ring-ink" : "ring-ink/15 hover:ring-ink/40"} ${n.startsWith("ASAP") ? "text-coral" : ""}`}>
                  <input type="radio" name="when" value={n} className="sr-only" checked={data.when === n} onChange={() => set("when", n)} />{n}
                </label>
              ))}
            </div>
          </fieldset>
        )}
        {step === 2 && (
          <fieldset className="grid gap-4 sm:grid-cols-2"><legend className="font-display mb-5 text-2xl font-bold">Where should we come?</legend>
            {([["name", "Your name", "text", "name"], ["phone", "Mobile number", "tel", "tel"], ["zip", "ZIP code", "text", "postal-code"]] as const).map(([k, l, t, ac]) => (
              <label key={k} className="block"><span className="text-sm font-semibold">{l}</span>
                <input required type={t} autoComplete={ac} value={data[k]} onChange={(e) => set(k, e.target.value)} className="mt-1.5 block h-12 w-full rounded-xl bg-sky-2 px-4 outline-none ring-1 ring-ink/10 transition focus:ring-2 focus:ring-blue" />
              </label>
            ))}
            <label className="block sm:col-span-2"><span className="text-sm font-semibold">What&apos;s happening? (optional)</span>
              <textarea rows={3} value={data.note} onChange={(e) => set("note", e.target.value)} className="mt-1.5 block w-full rounded-xl bg-sky-2 p-4 outline-none ring-1 ring-ink/10 transition focus:ring-2 focus:ring-blue" />
            </label>
          </fieldset>
        )}
      </div>
      <div className="mt-8 flex items-center justify-between gap-3">
        <button type="button" onClick={() => setStep(Math.max(0, step - 1))} className={`text-sm font-semibold underline underline-offset-4 ${step === 0 ? "invisible" : ""}`}>Back</button>
        <button type="submit" disabled={!can} className="btn btn-blue disabled:cursor-not-allowed disabled:opacity-40">{step < 2 ? "Continue" : "Confirm booking"}</button>
      </div>
    </form>
  );
}

/* ---------- Draggable reviews rail ---------- */
export function DragRail({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!; let down = false, sx = 0, sl = 0, v = 0, last = 0, raf = 0;
    const d = (e: PointerEvent) => { if (e.pointerType !== "mouse") return; down = true; sx = e.clientX; sl = el.scrollLeft; last = e.clientX; cancelAnimationFrame(raf); el.style.cursor = "grabbing"; };
    const m = (e: PointerEvent) => { if (!down) return; el.scrollLeft = sl - (e.clientX - sx); v = e.clientX - last; last = e.clientX; };
    const u = () => { if (!down) return; down = false; el.style.cursor = ""; const glide = () => { el.scrollLeft -= v; v *= 0.94; if (Math.abs(v) > .5) raf = requestAnimationFrame(glide); }; glide(); };
    el.addEventListener("pointerdown", d); addEventListener("pointermove", m); addEventListener("pointerup", u);
    return () => { el.removeEventListener("pointerdown", d); removeEventListener("pointermove", m); removeEventListener("pointerup", u); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} data-lenis-prevent-wheel className={`flex cursor-grab snap-x gap-5 overflow-x-auto pb-6 [scrollbar-width:none] ${className}`}>{children}</div>;
}
