"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { img, type ImgKey, type Service, areas } from "@/lib/site";

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

/* ---------- Service list with a cursor-following image (spring) ---------- */
export function ServiceReveal({ items }: { items: Service[] }) {
  const box = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  useEffect(() => {
    let x = 0, y = 0, cx = 0, cy = 0, vx = 0, vy = 0, raf = 0, rot = 0;
    const move = (e: PointerEvent) => { const r = box.current!.getBoundingClientRect(); x = e.clientX - r.left; y = e.clientY - r.top; };
    const tick = () => {
      // spring (stiffness 170, damping 18)
      const ax = (x - cx) * 0.09 - vx * 0.32, ay = (y - cy) * 0.09 - vy * 0.32;
      vx += ax; vy += ay; cx += vx; cy += vy; rot = Math.max(-12, Math.min(12, vx * 0.6));
      if (card.current) card.current.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%) rotate(${rot}deg)`;
      raf = requestAnimationFrame(tick);
    };
    const el = box.current!; el.addEventListener("pointermove", move); raf = requestAnimationFrame(tick);
    return () => { el.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div ref={box} className="relative" onPointerLeave={() => setActive(null)}>
      <ul className="border-t border-ink/15">
        {items.map((s, i) => (
          <li key={s.slug} onPointerEnter={() => setActive(i)} className="mx-blur-up mx-on-view border-b border-ink/15">
            <Link href={`/services/${s.slug}/`} className="group grid grid-cols-[3rem_1fr_auto] items-center gap-4 py-7 md:grid-cols-[5rem_1fr_1fr_auto] md:py-9">
              <span className="font-display text-sm font-semibold text-ink/40">0{i + 1}</span>
              <span className="font-display text-3xl font-bold tracking-tight transition-transform duration-500 [transition-timing-function:var(--ease-expo)] group-hover:translate-x-3 md:text-5xl">{s.name}</span>
              <span className="hidden max-w-sm text-ink/60 md:block">{s.short}</span>
              <span className="grid h-12 w-12 place-items-center rounded-full ring-1 ring-ink/20 transition-all duration-500 group-hover:rotate-[-45deg] group-hover:bg-ink group-hover:text-brass">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div ref={card} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-10 hidden h-64 w-52 overflow-hidden rounded-3xl shadow-2xl transition-[opacity,scale] duration-300 md:block"
        style={{ opacity: active === null ? 0 : 1, scale: active === null ? ".6" : "1" }}>
        {items.map((s, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={s.slug} width={500} height={620} src={img(s.img, 500)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300" style={{ opacity: active === i ? 1 : 0 }} />
        ))}
        <span className="absolute bottom-3 left-3 rounded-full bg-brass px-3 py-1 text-xs font-bold text-ink">{active !== null ? `From ${items[active].from}` : ""}</span>
      </div>
    </div>
  );
}

/* ---------- Before / after drag slider ---------- */
export function BeforeAfter({ before, after, beforeLabel = "Before", afterLabel = "After", alt }: { before: ImgKey; after: ImgKey; beforeLabel?: string; afterLabel?: string; alt: string }) {
  const [v, setV] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const drag = (e: React.PointerEvent) => {
    if (e.buttons !== 1 && e.type !== "pointerdown") return;
    const r = ref.current!.getBoundingClientRect(); setV(Math.max(2, Math.min(98, ((e.clientX - r.left) / r.width) * 100)));
  };
  return (
    <div ref={ref} className="relative aspect-[16/10] w-full touch-pan-y select-none overflow-hidden rounded-blob" onPointerDown={drag} onPointerMove={drag}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img width={1600} height={1000} src={img(after, 1600)} alt={`${alt}: ${afterLabel}`} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - v}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img width={1600} height={1000} src={img(before, 1600)} alt={`${alt}: ${beforeLabel}`} className="absolute inset-0 h-full w-full object-cover grayscale-[.4] sepia-[.25]" loading="lazy" />
      </div>
      <span className="absolute left-5 top-5 rounded-full bg-ink/80 px-3 py-1 text-xs font-bold uppercase tracking-widest text-paper backdrop-blur">{beforeLabel}</span>
      <span className="absolute right-5 top-5 rounded-full bg-brass px-3 py-1 text-xs font-bold uppercase tracking-widest text-ink">{afterLabel}</span>
      <div className="absolute inset-y-0 w-0.5 bg-paper" style={{ left: `${v}%` }} aria-hidden="true">
        <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink shadow-xl">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 6l-6 6 6 6M15 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </span>
      </div>
      <input type="range" min={2} max={98} value={v} onChange={(e) => setV(+e.target.value)} aria-label="Compare before and after" className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" />
    </div>
  );
}

/* ---------- Hotspots over the house cutaway ---------- */
export function Hotspots({ spots, children }: { spots: { x: number; y: number; title: string; text: string; href: string }[]; children: ReactNode }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="relative">
      {children}
      {spots.map((s, i) => (
        <div key={i} style={{ left: `${s.x}%`, top: `${s.y}%` }} className="absolute">
          <button type="button" className="hotspot mx-pop mx-on-view" style={{ ["--i" as string]: i }} aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} aria-label={s.title}>{i + 1}</button>
          {open === i && (
            <div className={`mx-dialog absolute top-8 z-10 w-64 rounded-2xl bg-paper p-5 text-ink shadow-2xl ${s.x > 60 ? "right-0" : "left-0"}`}>
              <p className="font-display text-lg font-bold">{s.title}</p>
              <p className="mt-1 text-sm text-ink/65">{s.text}</p>
              <Link href={s.href} className="mt-3 inline-block text-sm font-semibold text-brass-3 underline underline-offset-4">See the service</Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------- Price estimator ---------- */
const JOBS = [
  { id: "leak", label: "Leak or drip", base: [129, 189] }, { id: "drain", label: "Blocked drain", base: [129, 199] },
  { id: "heater", label: "Water heater", base: [1650, 2400] }, { id: "toilet", label: "Toilet", base: [149, 229] },
  { id: "repipe", label: "Repiping", base: [3900, 7500] }, { id: "remodel", label: "Remodel plumbing", base: [2400, 9000] },
];
export function Estimator() {
  const [job, setJob] = useState(JOBS[0]);
  const [urgent, setUrgent] = useState(false);
  const [member, setMember] = useState(false);
  const [size, setSize] = useState(2);
  const mult = (urgent ? 1.25 : 1) * (member ? 0.85 : 1) * (job.id === "repipe" || job.id === "remodel" ? 0.7 + size * 0.15 : 1);
  const lo = Math.round((job.base[0] * mult) / 5) * 5, hi = Math.round((job.base[1] * mult) / 5) * 5;
  return (
    <div className="grid gap-8 rounded-blob bg-ink p-6 text-paper md:p-10 lg:grid-cols-[1.2fr_1fr]">
      <div>
        <p className="eyebrow text-brass-2">1. What needs fixing?</p>
        <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Job type">
          {JOBS.map((j) => (
            <button key={j.id} type="button" role="radio" aria-checked={job.id === j.id} onClick={() => setJob(j)}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold ring-1 transition-all duration-300 ${job.id === j.id ? "bg-brass text-ink ring-brass" : "ring-white/20 hover:ring-white/50"}`}>{j.label}</button>
          ))}
        </div>
        {(job.id === "repipe" || job.id === "remodel") && (
          <label className="mx-blur-up mt-8 block">
            <span className="eyebrow text-brass-2">2. Home size: {size + 1} bedrooms</span>
            <input type="range" min={0} max={4} value={size} onChange={(e) => setSize(+e.target.value)} className="mt-4 w-full accent-[#e2a33b]" />
          </label>
        )}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Toggle on={urgent} set={setUrgent} title="It's urgent" sub="Within 2 hours" />
          <Toggle on={member} set={setMember} title="Care Club member" sub="15% off" />
        </div>
      </div>
      <div className="relative flex flex-col justify-between overflow-hidden rounded-[1.6rem] bg-ink-3 p-8">
        <div aria-hidden="true" className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brass/30 blur-3xl" />
        <p className="eyebrow relative text-bone/60">Typical price</p>
        <p className="font-display relative mt-4 text-5xl font-bold tracking-tight md:text-6xl" aria-live="polite">
          <span key={`${lo}-${hi}`} className="mx-roll-in inline-block">${lo.toLocaleString()}<span className="text-bone/40">–</span>${hi.toLocaleString()}</span>
        </p>
        <p className="relative mt-4 text-sm text-bone/60">A guide only. You always get a fixed written price before we start.</p>
        <Link href="/contact/" className="btn btn-brass relative mt-8 self-start">Book this job<span className="arrow"><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#000" strokeWidth="1.8" strokeLinecap="round" /></svg></span></Link>
      </div>
    </div>
  );
}
function Toggle({ on, set, title, sub }: { on: boolean; set: (b: boolean) => void; title: string; sub: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => set(!on)} className={`flex items-center justify-between rounded-2xl p-4 text-left ring-1 transition ${on ? "bg-white/10 ring-brass" : "ring-white/15"}`}>
      <span><span className="block font-semibold">{title}</span><span className="text-sm text-bone/55">{sub}</span></span>
      <span className={`relative h-7 w-12 rounded-full transition-colors ${on ? "bg-brass" : "bg-white/15"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-paper transition-all duration-300 [transition-timing-function:var(--ease-quint)] ${on ? "left-6" : "left-1"}`} /></span>
    </button>
  );
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
    <div className="mx-dialog rounded-blob bg-ink p-10 text-paper">
      <div className="mx-pop grid h-16 w-16 place-items-center rounded-full bg-aqua text-ink"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg></div>
      <h3 className="h-lg mt-6">You&apos;re booked, {data.name.split(" ")[0]}.</h3>
      <p className="mt-4 text-bone/70">{data.service} · {data.when}. We&apos;ll text {data.phone} with your plumber&apos;s name and photo. <span className="text-brass-2">(Demo: nothing was sent.)</span></p>
    </div>
  );
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (step < 2) setStep(step + 1); else setDone(true); }} className="rounded-blob bg-paper p-6 text-ink shadow-[0_40px_120px_-40px_rgba(7,17,31,.45)] ring-1 ring-ink/10 md:p-10">
      <ol className="mb-8 flex gap-2" aria-label="Progress">
        {steps.map((s, i) => (
          <li key={s} className="flex-1">
            <span className="block h-1.5 overflow-hidden rounded-full bg-ink/10"><span className="block h-full origin-left bg-brass transition-transform duration-700 [transition-timing-function:var(--ease-expo)]" style={{ transform: `scaleX(${i <= step ? 1 : 0})` }} /></span>
            <span className={`mt-2 block text-xs font-semibold uppercase tracking-widest ${i === step ? "text-ink" : "text-ink/40"}`} aria-current={i === step ? "step" : undefined}>{i + 1}. {s}</span>
          </li>
        ))}
      </ol>
      <div key={step} className="mx-panel min-h-[18rem]">
        {step === 0 && (
          <fieldset><legend className="font-display text-2xl font-bold">What can we help with?</legend>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {[...services.map((s) => s.name), "Something else"].map((n) => (
                <label key={n} className={`cursor-pointer rounded-2xl p-4 font-semibold ring-1 transition ${data.service === n ? "bg-ink text-paper ring-ink" : "ring-ink/15 hover:ring-ink/40"}`}>
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
                <label key={n} className={`cursor-pointer rounded-2xl p-4 font-semibold ring-1 transition ${data.when === n ? "bg-ink text-paper ring-ink" : "ring-ink/15 hover:ring-ink/40"} ${n.startsWith("ASAP") ? "text-signal" : ""}`}>
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
                <input required type={t} autoComplete={ac} value={data[k]} onChange={(e) => set(k, e.target.value)} className="mt-1.5 block h-12 w-full rounded-xl bg-bone px-4 outline-none ring-1 ring-ink/10 transition focus:ring-2 focus:ring-brass" />
              </label>
            ))}
            <label className="block sm:col-span-2"><span className="text-sm font-semibold">What&apos;s happening? (optional)</span>
              <textarea rows={3} value={data.note} onChange={(e) => set("note", e.target.value)} className="mt-1.5 block w-full rounded-xl bg-bone p-4 outline-none ring-1 ring-ink/10 transition focus:ring-2 focus:ring-brass" />
            </label>
          </fieldset>
        )}
      </div>
      <div className="mt-8 flex items-center justify-between gap-3">
        <button type="button" onClick={() => setStep(Math.max(0, step - 1))} className={`text-sm font-semibold underline underline-offset-4 ${step === 0 ? "invisible" : ""}`}>Back</button>
        <button type="submit" disabled={!can} className="btn btn-ink disabled:cursor-not-allowed disabled:opacity-40">{step < 2 ? "Continue" : "Confirm booking"}<span className="arrow"><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#000" strokeWidth="1.8" strokeLinecap="round" /></svg></span></button>
      </div>
    </form>
  );
}

/* ---------- Service area map ---------- */
export function AreaMap() {
  const [hover, setHover] = useState<number | null>(null);
  const [q, setQ] = useState("");
  const match = q.trim().length > 1 ? areas.findIndex((a) => a.name.toLowerCase().includes(q.trim().toLowerCase())) : -1;
  const sel = hover ?? (match >= 0 ? match : null);
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-center">
      <div>
        <label className="block">
          <span className="eyebrow text-brass-2">Check your neighborhood</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Zilker, Round Rock…" className="mt-4 h-14 w-full rounded-full bg-white/10 px-6 text-lg text-paper outline-none ring-1 ring-white/15 placeholder:text-bone/40 focus:ring-2 focus:ring-brass" />
        </label>
        <p className="mt-4 min-h-[1.5rem] text-bone/75" aria-live="polite">
          {q.trim().length > 1 ? (match >= 0 ? <>Yes! We cover <b className="text-aqua">{areas[match].name}</b>. Typical emergency arrival: <b className="text-paper">{areas[match].eta}</b>.</> : "Not on our list yet, but call us. We often travel further for planned work.") : "12 neighborhoods, 9 trucks on the road."}
        </p>
        <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-1">
          {areas.map((a, i) => (
            <li key={a.name} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)} className={`flex justify-between border-b border-white/10 py-2.5 text-sm transition-colors ${sel === i ? "text-brass-2" : "text-bone/75"}`}>
              <span>{a.name}</span><span className="text-bone/40">{a.eta}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative aspect-square w-full overflow-hidden rounded-blob bg-ink-2 ring-1 ring-white/10">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M5 0H0V5" fill="none" stroke="rgba(255,255,255,.05)" strokeWidth=".3" /></pattern>
            <radialGradient id="cov"><stop offset="0" stopColor="#e2a33b" stopOpacity=".35" /><stop offset="1" stopColor="#e2a33b" stopOpacity="0" /></radialGradient>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
          <circle cx="50" cy="48" r="46" fill="url(#cov)" />
          <path d="M-5 70 C 20 62, 30 58, 45 56 S 70 52, 105 40" fill="none" stroke="#46e3d6" strokeOpacity=".5" strokeWidth="2.2" pathLength={1} className="mx-draw mx-on-view" />
          <path d="M55 -5 L 54 30 L 52 48 L 50 70 L 47 105" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth=".8" strokeDasharray="2 1.5" />
          <path d="M-5 30 L 30 40 L 52 48 L 75 46 L 105 52" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth=".6" />
          {areas.map((a, i) => (
            <g key={a.name} className="mx-pop mx-on-view" style={{ ["--i" as string]: i, transformOrigin: `${a.x}px ${a.y}px`, transformBox: "view-box" } as CSSProperties}>
              <circle cx={a.x} cy={a.y} r={sel === i ? 4.5 : 0} fill="#e2a33b" fillOpacity=".25" style={{ transition: "r .4s var(--ease-quint)" }} />
              <circle cx={a.x} cy={a.y} r={sel === i ? 1.9 : 1.3} fill={sel === i ? "#46e3d6" : "#e2a33b"} style={{ transition: "r .3s" }} />
              <text x={a.x + 2.6} y={a.y + 1} fontSize="2.6" fill={sel === i ? "#fff" : "rgba(243,238,228,.55)"} fontWeight={600}>{a.name}</text>
            </g>
          ))}
          <g><circle cx="50" cy="56" r="2.6" fill="#ff5a36" /><text x="53.5" y="59.5" fontSize="2.6" fill="#ff5a36" fontWeight={700}>HQ</text></g>
        </svg>
      </div>
    </div>
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
