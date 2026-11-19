// Gus & Co. Plumbing — fictional demo brand built by Danish Ishfaq (Plumbing Demo 2).
import type { StationKey } from "@/components/gus/world";

export const BASE = "/demo/plumbing-2";
export const SITE_URL = "https://danishishfaq.online" + BASE;
export const poster = (k: StationKey | "journey") => `${BASE}/posters/${k}.webp`;

export const brand = {
  name: "Gus & Co.",
  full: "Gus & Co. Plumbing",
  phone: "(602) 555-0193",
  tel: "+16025550193",
  email: "hi@gusandco.example",
  city: "Phoenix, AZ",
  address: "418 W Roosevelt St, Phoenix, AZ 85003",
  hours: "Mon–Sat 7am–7pm · Emergencies 24/7",
  rating: "4.9",
  reviews: "2,140",
};

export type Service = {
  slug: string; station: StationKey; name: string; emoji: string; color: string; short: string; from: string; time: string;
  story: string; steps: { t: string; d: string }[]; signs: string[]; includes: string[]; faq: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: "leak-detection", station: "leak", name: "Leak Detection", emoji: "💧", color: "#d8f0ff", from: "$149", time: "About 1 hour",
    short: "Gus scans the walls, finds the drip and wraps it before it becomes a flood.",
    story: "A drip behind a wall can waste 10,000 gallons a year. Gus brings a thermal scanner, finds the exact joint, and fixes it with one small opening instead of a demolished wall.",
    steps: [{ t: "Scan", d: "Thermal and acoustic scanning finds the leak without opening walls." }, { t: "Pinpoint", d: "We mark the exact joint and show you on the scanner screen." }, { t: "Fix & dry", d: "Seal or replace the joint, then check moisture levels are back to normal." }],
    signs: ["Water bill suddenly higher", "Meter spins with taps off", "Damp patch or bubbling paint", "Sound of running water at night"],
    includes: ["Thermal + acoustic scan", "Photo report for insurance", "Small-access repair", "Scan fee waived if we fix it"],
    faq: [{ q: "Will you need to open my wall?", a: "Usually only a hand-sized opening, which we patch afterwards." }, { q: "Can you find slab leaks?", a: "Yes. Under-slab leaks are one of our most common jobs in Phoenix." }],
  },
  {
    slug: "drain-cleaning", station: "drain", name: "Drain Cleaning", emoji: "🌀", color: "#e6f9e8", from: "$119", time: "45–90 min",
    short: "Slow sink? Gus plunges, snakes or jets it until the water swirls away clean.",
    story: "Grease, hair and roots don't stand a chance. Gus starts with the simplest fix, then uses a camera and hydro-jet if the clog lives deeper in the line.",
    steps: [{ t: "Clear", d: "Plunger and cable for simple clogs, right away." }, { t: "Look inside", d: "A camera shows what's really in the pipe." }, { t: "Jet clean", d: "Hydro-jetting scours the pipe back to full width." }],
    signs: ["Slow-draining sinks or tub", "Gurgling sounds", "Bad smells from drains", "Water backing up"],
    includes: ["Kitchen, bath and main lines", "Before/after camera clip", "No harsh chemicals", "30-day no-reclog promise"],
    faq: [{ q: "Do you use chemicals?", a: "Never. They damage pipes and rarely fix the cause." }, { q: "How fast can you come?", a: "Same day for most of the Phoenix metro." }],
  },
  {
    slug: "water-heaters", station: "heater", name: "Water Heaters", emoji: "🔥", color: "#fff1d6", from: "$99", time: "Same day",
    short: "No hot water? Gus fixes the valve, relights the burner and gets your shower steaming again.",
    story: "Tank, tankless or heat pump: Gus carries common parts on the truck, and when a replacement makes more sense he shows you the running costs side by side.",
    steps: [{ t: "Diagnose", d: "Thermostat, elements, valve and burner checked on the spot." }, { t: "Repair or replace", d: "Clear options with 10-year running costs." }, { t: "Hot again", d: "Install, test, and haul the old unit away." }],
    signs: ["Lukewarm water", "Popping or rumbling tank", "Rusty water", "Puddle around the base"],
    includes: ["Tank, tankless and heat pump", "Permits and haul-away", "Yearly flush plans", "Up to 12-year warranty"],
    faq: [{ q: "Tank or tankless?", a: "Tankless costs more upfront but saves energy for bigger households. We'll show you the math." }, { q: "Same-day install?", a: "If the unit's in stock, yes." }],
  },
  {
    slug: "fixtures", station: "faucet", name: "Faucets & Fixtures", emoji: "🚿", color: "#ece6ff", from: "$179", time: "1–3 hours",
    short: "New faucet, shower or toilet? Gus installs it, tests it and leaves it sparkling.",
    story: "From a dripping kitchen tap to a full bathroom refresh, Gus fits fixtures properly the first time, with sealed joints and no wobbles.",
    steps: [{ t: "Pick", d: "Bring your own fixture or choose from ours." }, { t: "Install", d: "Shut-offs, supply lines and seals done right." }, { t: "Test & tidy", d: "Pressure test, polish and clean-up." }],
    signs: ["Dripping faucet", "Wobbly toilet", "Low shower pressure", "Dated fixtures"],
    includes: ["Faucets, showers, toilets", "New shut-off valves", "Works with your remodel", "1-year workmanship warranty"],
    faq: [{ q: "Can I supply my own faucet?", a: "Of course. We'll check it suits your water pressure first." }, { q: "Do you remove the old one?", a: "Yes, and we recycle it." }],
  },
  {
    slug: "emergency", station: "emergency", name: "24/7 Emergencies", emoji: "🚨", color: "#ffe2df", from: "$169", time: "~45 min arrival",
    short: "Burst pipe at midnight? Gus grabs the flashlight, runs in and shuts the water off fast.",
    story: "A real dispatcher answers every call, talks you through finding your main shut-off, and sends the nearest Gus & Co. van with a live ETA.",
    steps: [{ t: "Call", d: "A real person answers, day or night." }, { t: "Shut off", d: "We talk you through stopping the water, then race over." }, { t: "Fix", d: "Make safe, then a fixed price before any repair." }],
    signs: ["Burst or spraying pipe", "Water through a ceiling", "Sewage backing up", "No water at all"],
    includes: ["No night or weekend surcharge", "~45 minute arrival", "Moisture check", "Photos for your insurer"],
    faq: [{ q: "Do you really come at 3am?", a: "Yes. Crews are on shift every night of the year." }, { q: "What does it cost?", a: "$169 to come out and diagnose. Repairs are priced before we start." }],
  },
];

export const journey: { station: StationKey; kicker: string; title: string; text: string; href?: string; cta?: string }[] = [
  { station: "hero", kicker: "Hi, I'm Gus 👋", title: "Your friendly neighborhood plumber.", text: "Scroll along and follow me through a day on the job. Leaks, clogs, cold showers, midnight floods: I fix them all, and you always know the price first.", href: "/contact/", cta: "Book Gus" },
  { station: "leak", kicker: "Stop 1 · Leak detection", title: "Drip, drip… found you!", text: "My scanner sees heat and hears water inside walls. One tiny opening, one fixed joint, no ruined drywall.", href: "/services/leak-detection/", cta: "Leak detection" },
  { station: "drain", kicker: "Stop 2 · Drain cleaning", title: "Clogs, meet my plunger.", text: "Gunky sink? A few pumps and the water swirls away clean. Deeper clogs get a camera and a hydro-jet.", href: "/services/drain-cleaning/", cta: "Drain cleaning" },
  { station: "heater", kicker: "Stop 3 · Water heaters", title: "Cold shower? Not on my watch.", text: "I tighten the valve, relight the burner and the steam's back. Same-day repairs and installs.", href: "/services/water-heaters/", cta: "Water heaters" },
  { station: "faucet", kicker: "Stop 4 · Faucets & fixtures", title: "New faucet, zero wobble.", text: "Faucets, showers, toilets: installed, sealed, tested, and left sparkling.", href: "/services/fixtures/", cta: "Fixtures" },
  { station: "emergency", kicker: "Stop 5 · 24/7 emergencies", title: "Midnight burst? I'm already running.", text: "A real person answers, tells you how to stop the water, and I'm at your door in about 45 minutes.", href: "/services/emergency/", cta: "Emergency help" },
  { station: "finale", kicker: "Job done ✔", title: "Happy home. Happy Gus.", text: "4.9 stars from 2,140 Phoenix neighbors. Fixed prices, tidy work, and a high-five on the way out.", href: "/contact/", cta: "Book your visit" },
];

export const reviews = [
  { name: "Carla M.", area: "Arcadia", text: "Gus found a slab leak in 20 minutes that two companies missed. Price was exactly what he quoted." },
  { name: "Dev P.", area: "Tempe", text: "Burst pipe at 1am, real person answered, van here in 40 minutes. Lifesavers." },
  { name: "The Ortiz family", area: "Mesa", text: "Our kids now ask when 'the plumber with the glasses' is coming back." },
  { name: "Hannah K.", area: "Scottsdale", text: "New tankless heater same day, and he explained every option without any pressure." },
];

export const faqs = [
  { q: "Is Gus a real person?", a: "Gus is our mascot (and this is a demo brand). Every visit is done by a licensed, background-checked plumber." },
  { q: "Will I know the price first?", a: "Always. You get a fixed written price before any work starts." },
  { q: "How fast can you come?", a: "Same day for most jobs in the Phoenix metro, and about 45 minutes for emergencies." },
  { q: "Do you charge extra at night?", a: "No night or weekend surcharges, ever." },
  { q: "What warranty do I get?", a: "One year on all repairs and up to 12 years on new water heaters." },
  { q: "Which areas do you cover?", a: "Phoenix, Tempe, Mesa, Scottsdale, Chandler, Gilbert, Glendale and Peoria." },
];

export const plans = [
  { name: "Quick Fix", price: "$119", per: "from, per job", items: ["Fixed price upfront", "Same-day slots", "1-year warranty"], color: "#d8f0ff" },
  { name: "Gus Club", price: "$15", per: "per month", items: ["Yearly home plumbing check", "Water heater flush", "15% off all repairs", "Skip-the-line booking"], color: "#ffe9a8", featured: true },
  { name: "Big Project", price: "Free", per: "written quote", items: ["Remodels & repipes", "On-site measure", "0% financing (demo)"], color: "#e6f9e8" },
];

export const nav = [
  { href: "/services/", label: "Services" },
  { href: "/pricing/", label: "Pricing" },
  { href: "/about/", label: "Meet Gus" },
  { href: "/faq/", label: "FAQ" },
];
