import { GusStage } from "@/components/gus/GusStage";
export const metadata = { robots: { index: false } };
export default function Render() {
  return <div className="render-root" style={{ position: "fixed", inset: 0, zIndex: 100, background: "transparent" }}><GusStage mode="hero" poster="" posterAlt="" className="h-full w-full" /></div>;
}
