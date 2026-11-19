import { Btn } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="grain relative flex min-h-[80svh] items-center overflow-hidden bg-ink pt-24 text-paper">
      <div className="ripples pointer-events-none absolute inset-0" aria-hidden="true"><span /><span /><span /></div>
      <div className="relative mx-auto max-w-[88rem] px-5 md:px-10">
        <p className="font-display text-[clamp(6rem,22vw,18rem)] font-extrabold leading-[.8] tracking-[-0.06em] text-brass">404</p>
        <h1 className="h-lg mt-6">This pipe leads nowhere.</h1>
        <p className="mt-4 max-w-md text-bone/70">The page you wanted has drained away. Let&apos;s get you back to something useful.</p>
        <div className="mt-10 flex flex-wrap gap-3"><Btn href="/">Back home</Btn><Btn href="/services/" variant="ghost" className="text-paper">See services</Btn></div>
      </div>
    </section>
  );
}
