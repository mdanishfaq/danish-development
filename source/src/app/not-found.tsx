import { Btn } from "@/components/ui";
export default function NotFound() {
  return (
    <section className="grid min-h-[80svh] place-items-center bg-sky-2 px-5 pt-24 text-center">
      <div>
        <p className="font-display text-[clamp(6rem,20vw,14rem)] font-bold leading-none text-blue">404</p>
        <h1 className="h-lg mt-4">Gus looked everywhere. This pipe goes nowhere.</h1>
        <div className="mt-8 flex justify-center gap-4"><Btn href="/">Back home</Btn><Btn href="/services/" variant="white">Services</Btn></div>
      </div>
    </section>
  );
}
