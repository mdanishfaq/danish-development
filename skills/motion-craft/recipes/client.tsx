"use client";
// Danish Development motion recipes: the few interactive pieces. Small, no animation library.
import { useEffect, useRef, useState, type ReactNode } from "react";

/* Prompt-box hero (v0). Chips fill the box; submit goes to the real destination (e.g. /builder?brief=...). */
export function PromptHero({ action, chips, placeholder }: { action: string; chips: string[]; placeholder: string }) {
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  return (
    <form action={action} method="get" className="w-full max-w-2xl">
      <label htmlFor="brief" className="sr-only">Describe the website you want</label>
      <textarea id="brief" name="brief" ref={ref} rows={3} value={text} onChange={(e) => setText(e.target.value)}
        placeholder={placeholder} className="w-full resize-none rounded-2xl bg-white p-4 text-base text-black outline-none ring-1 ring-black/10 transition-shadow duration-200 focus:ring-2 focus:ring-black/40" />
      <div className="mt-3 flex flex-wrap gap-2">
        {chips.map((c) => (
          <button key={c} type="button" onClick={() => { setText(c); ref.current?.focus(); }}
            className="lift rounded-full px-3 py-2 text-sm ring-1 ring-current/20">{c}</button>
        ))}
        <button type="submit" className="ml-auto rounded-full bg-black px-5 py-2 text-sm font-medium text-white">Build it</button>
      </div>
    </form>
  );
}

/* Pinned chapter story (anime.js). Steps scroll on the left; the sticky stage shows the active step's demo.
   Uses IntersectionObserver (tiny) so it works in every browser; on phones the stage stacks (see motion.css). */
export function Story({ steps }: { steps: { title: string; body: ReactNode; stage: ReactNode }[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      const i = Number((e.target as HTMLElement).dataset.i);
      if (e.isIntersecting) setActive(i);
      else if (i === 0 && e.boundingClientRect.top > innerHeight / 2) setActive(0); // scrolled back above the story
    }), { rootMargin: "-45% 0px -45% 0px" });
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <div className="story">
      <div>
        {steps.map((s, i) => (
          <article key={s.title} data-i={i} ref={(el) => { refs.current[i] = el; }} className="chapter">
            <div><h3 className="text-2xl font-semibold">{s.title}</h3><div className="mt-3">{s.body}</div></div>
          </article>
        ))}
      </div>
      <div className="story-stage" aria-hidden="true">
        {steps.map((s, i) => (
          <div key={s.title} data-step={i} style={i === active ? { opacity: 1, transform: "none" } : undefined}>{s.stage}</div>
        ))}
      </div>
    </div>
  );
}

/* Tabs with a clip-path wipe (motion.dev). Accessible tablist. */
export function WipeTabs({ tabs }: { tabs: { label: string; panel: ReactNode }[] }) {
  const [a, setA] = useState(0);
  return (
    <div>
      <div role="tablist" className="flex gap-2">
        {tabs.map((t, i) => (
          <button key={t.label} role="tab" aria-selected={a === i} aria-controls={`panel-${i}`} id={`tab-${i}`} onClick={() => setA(i)}
            className={`rounded-full px-4 py-2 text-sm transition-colors duration-200 ${a === i ? "bg-black text-white" : "ring-1 ring-current/20"}`}>{t.label}</button>
        ))}
      </div>
      <div className="relative mt-4 grid">
        {tabs.map((t, i) => (
          <div key={t.label} role="tabpanel" id={`panel-${i}`} aria-labelledby={`tab-${i}`} hidden={a !== i} data-active={a === i ? "" : undefined} className="wipe [grid-area:1/1]">{t.panel}</div>
        ))}
      </div>
    </div>
  );
}
