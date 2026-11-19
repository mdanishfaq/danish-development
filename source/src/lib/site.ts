// Brass & Bolt Plumbing Co. — fictional demo brand built by Danish Ishfaq.
export const BASE = "/demo/plumbing-1";
export const SITE_URL = "https://danishishfaq.online" + BASE;

export const brand = {
  name: "Brass & Bolt",
  full: "Brass & Bolt Plumbing Co.",
  phone: "(512) 555-0148",
  tel: "+15125550148",
  email: "hello@brassandbolt.example",
  city: "Austin, TX",
  address: "2210 Riverside Dr, Austin, TX 78741",
  hours: "Mon–Sat 7am–7pm · Emergencies 24/7",
  license: "TX Master Plumber M-41187 (demo)",
  rating: "4.9",
  reviews: "1,280",
};

/** Unsplash CDN (hotlinking is how Unsplash asks images to be served). */
export const IMG = {
  plumber: "1558618666-fcd25c85cd64",
  underSink: "1676210133055-eab6ef033ce3",
  underSink2: "1676210134188-4c05dd172f89",
  faucetSplash: "1542013936693-884638332954",
  brassValve: "1781801298323-5c48a9a02c80",
  manifold: "1607472586893-edb57bdc0e39",
  copperCoil: "1584774354932-62ceb99e6053",
  copperWarm: "1655917111102-294b3b14d62d",
  copperTeal: "1769376695235-d3253548a5d7",
  wallPipes: "1768321913920-d3ac011e0683",
  tub: "1507652313519-d4e9174996dd",
  vanity: "1576698483491-8c43f0862543",
  whiteBath: "1620626011761-996317b8d101",
  kitchen: "1758240689297-d8613ca753f3",
  darkSink: "1775757586441-d6d0e3330603",
  kitchenSink: "1629078692818-c5a0443f4ae3",
  copperHeater: "1594233078955-e1f73a02ebb2",
  heatPump: "1780445392462-b7761551820c",
  heaterInstall: "1620653713380-7a34b773fef8",
  faucetStream: "1556010334-298f19160723",
  faucetSteel: "1642014586226-6de3da27a974",
  tapBokeh: "1495647688236-ed6ef40cb28b",
  dropCrown: "1769246207504-c66888c982a7",
  copperDrop: "1762655896541-11e9a3dffb3c",
  house: "1570129477492-45c003edd2be",
  house2: "1781797221329-c3d083ab6d99",
  planner: "1772442198624-4fc4d7281e89",
  worker: "1505798577917-a65157d3320a",
  toolBelt: "1646119945537-2a73112f5913",
  redGloves: "1676210134050-6f12c6898395",
  redValve: "1761758674188-2b8e4c89c5e2",
  handsBlue: "1676210134190-3f2c0d5cf58d",
  shower: "1784835556318-9889885dd71d",
  waterHands: "1768155604486-05085af972c8",
  bathModern: "1733426107854-ee00a25d72a7",
  bathVanity: "1763485956292-7b9bed7b3c10",
} as const;
export type ImgKey = keyof typeof IMG;

export const img = (k: ImgKey, w = 1200) =>
  `https://images.unsplash.com/photo-${IMG[k]}?auto=format&fit=crop&w=${w}&q=72`;
export const srcSet = (k: ImgKey) => [480, 800, 1200, 1800].map((w) => `${img(k, w)} ${w}w`).join(", ");

export type Service = {
  slug: string; name: string; short: string; tag: string; from: string; time: string;
  img: ImgKey; img2: ImgKey; lede: string; signs: string[]; steps: { t: string; d: string }[];
  includes: string[]; faq: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: "emergency-plumbing", name: "Emergency Plumbing", short: "Burst pipe at 2am? A real plumber is at your door in about an hour.",
    tag: "24/7", from: "$149", time: "~60 min arrival", img: "redValve", img2: "underSink",
    lede: "Burst pipes, flooding, no water, sewage backing up. We answer every call in person, day or night, and we tell you how to stop the damage while we drive over.",
    signs: ["Water coming through a ceiling or wall", "A pipe that has split or is spraying", "Sewage coming up a drain or toilet", "No water anywhere in the house", "Smell of gas near the water heater"],
    steps: [{ t: "Call or tap SOS", d: "A dispatcher picks up, not a menu. We talk you through closing the main shut-off." }, { t: "Truck on the road", d: "You get the plumber's name, photo and a live arrival time by text." }, { t: "Stop the damage", d: "Isolate, drain and make safe first. Then a fixed price before any repair." }],
    includes: ["No call-out surcharge on weekends", "Fixed price before work starts", "Moisture check with a thermal camera", "Photos of the fix for your insurer"],
    faq: [{ q: "Do you really come out at night?", a: "Yes. Two crews are on shift every night of the year, including holidays." }, { q: "What does an emergency visit cost?", a: "The visit and diagnosis is $149. Repairs are priced before we start, and you can say no." }],
  },
  {
    slug: "leak-detection", name: "Leak Detection", short: "Thermal imaging and acoustic gear find hidden leaks without tearing up your walls.",
    tag: "Non-invasive", from: "$189", time: "1–2 hours", img: "handsBlue", img2: "wallPipes",
    lede: "A spinning water meter or a damp patch is a clue. We follow it with thermal cameras, acoustic listening and pressure tests, so we open one small hole instead of a whole wall.",
    signs: ["Water bill jumped for no reason", "Meter moves when every tap is off", "Warm spots on the floor", "Musty smell or bubbling paint", "Low water pressure upstairs"],
    steps: [{ t: "Pressure test", d: "We isolate each line to find which run is losing water." }, { t: "Pinpoint", d: "Thermal and acoustic tools narrow it to a spot the size of your hand." }, { t: "Repair & report", d: "Small access, clean repair and a photo report for insurance." }],
    includes: ["Thermal + acoustic survey", "Slab leak detection", "Written report with photos", "Fee waived if we do the repair"],
    faq: [{ q: "Will you break my walls?", a: "Usually just one small access hole, which we patch. Most leaks are found without opening anything." }, { q: "Do you work with insurers?", a: "Yes. We give you a dated report with photos and moisture readings." }],
  },
  {
    slug: "drain-cleaning", name: "Drain Cleaning", short: "Camera inspection and hydro-jetting that clears the blockage and tells you why it happened.",
    tag: "Camera-checked", from: "$129", time: "45–90 min", img: "underSink2", img2: "darkSink",
    lede: "Plungers move a clog. We remove it. A camera shows what is really in the line, then hydro-jetting scours pipes back to full width so the problem does not come back next month.",
    signs: ["Slow sinks or showers", "Gurgling sounds from drains", "Water backing up in the tub", "Bad smell from floor drains", "More than one drain is slow"],
    steps: [{ t: "Camera first", d: "We look inside the line and show you the video on a tablet." }, { t: "Clear it", d: "Cable or hydro-jet, depending on what the camera found." }, { t: "Prove it", d: "A second camera pass so you can see the pipe is clean." }],
    includes: ["Before and after camera footage", "Kitchen, bath and main lines", "Root cutting", "30-day no-reclog promise"],
    faq: [{ q: "Is hydro-jetting safe for old pipes?", a: "We check with the camera first and lower the pressure, or use a cable, on fragile pipes." }, { q: "Do you use chemical cleaners?", a: "No. They damage pipes and rarely fix the cause." }],
  },
  {
    slug: "water-heaters", name: "Water Heaters", short: "Tank, tankless and heat-pump water heaters. Repaired today or replaced tomorrow.",
    tag: "Same-day", from: "$99", time: "Same / next day", img: "copperHeater", img2: "heatPump",
    lede: "No hot water ruins a morning. We carry common parts on every truck, and when replacement makes more sense we show you the running costs of each option side by side.",
    signs: ["Lukewarm or no hot water", "Rumbling or popping from the tank", "Rusty or smelly hot water", "Water pooling around the base", "The heater is over 10 years old"],
    steps: [{ t: "Diagnose", d: "Elements, thermostat, anode and burner checked on site." }, { t: "Choose", d: "Repair vs replace, with 10-year running costs for each." }, { t: "Install", d: "Permit, haul-away and a full code-compliant install." }],
    includes: ["Tank, tankless and heat-pump units", "Permits and haul-away", "Annual flush plans", "Up to 12-year warranties"],
    faq: [{ q: "Tank or tankless?", a: "Tankless costs more upfront but lasts longer and saves energy for bigger households. We'll show the math." }, { q: "Can you install it today?", a: "If the unit is in stock, usually yes. Otherwise next morning." }],
  },
  {
    slug: "bathroom-kitchen", name: "Bathrooms & Kitchens", short: "Fixtures, showers and full re-plumbing for remodels, finished to a showroom standard.",
    tag: "Remodels", from: "$240", time: "1 day – 3 weeks", img: "bathModern", img2: "kitchen",
    lede: "From swapping a faucet to moving a whole bathroom across the house. We plan the pipe runs with your designer or contractor and leave every joint tidy, labelled and pressure-tested.",
    signs: ["Planning a remodel", "Dripping or dated fixtures", "Want a walk-in or rain shower", "Adding a kitchen island sink", "Low-flow upgrades"],
    steps: [{ t: "Site visit", d: "We measure, check the existing pipes and price it in writing." }, { t: "Rough-in", d: "New supply and drain runs, inspected before walls close." }, { t: "Finish", d: "Fixtures set, sealed, tested, and the mess gone." }],
    includes: ["Showers, tubs, vanities and sinks", "Island and pot-filler lines", "Works with your contractor", "Inspection-ready rough-in"],
    faq: [{ q: "Do you do tiling too?", a: "We partner with two local tile crews and can coordinate the whole job." }, { q: "Can I supply my own fixtures?", a: "Of course. We'll check they suit your water pressure first." }],
  },
  {
    slug: "repiping", name: "Whole-Home Repiping", short: "Swap old galvanized or polybutylene pipes for PEX or copper, usually in two days.",
    tag: "Lifetime", from: "$3,900", time: "2–3 days", img: "copperWarm", img2: "manifold",
    lede: "Old pipes fail slowly, then all at once. We repipe occupied homes room by room, keep the water on each evening, and patch every opening before we leave.",
    signs: ["Brown or metallic-tasting water", "Repeated pinhole leaks", "Galvanized or polybutylene pipes", "Very low pressure everywhere", "Home built before 1975"],
    steps: [{ t: "Plan the runs", d: "A pipe map of your home with the fewest openings possible." }, { t: "Repipe", d: "PEX-A or copper, new shut-offs, water back on each night." }, { t: "Patch & paint", d: "Drywall repaired and painted. Final pressure test with you there." }],
    includes: ["PEX-A or type-L copper", "Drywall patch and paint", "New main shut-off valve", "Lifetime workmanship warranty"],
    faq: [{ q: "Do I need to move out?", a: "No. Water is back on every evening and we work one area at a time." }, { q: "Is financing available?", a: "Yes, 0% for 18 months on approved credit (demo)." }],
  },
];

export const areas = [
  { name: "Downtown", x: 52, y: 48, eta: "35 min" }, { name: "East Austin", x: 66, y: 50, eta: "40 min" },
  { name: "South Congress", x: 50, y: 64, eta: "40 min" }, { name: "Zilker", x: 40, y: 58, eta: "45 min" },
  { name: "Hyde Park", x: 54, y: 32, eta: "45 min" }, { name: "Mueller", x: 64, y: 36, eta: "45 min" },
  { name: "Westlake", x: 28, y: 56, eta: "50 min" }, { name: "Round Rock", x: 60, y: 10, eta: "60 min" },
  { name: "Cedar Park", x: 34, y: 14, eta: "60 min" }, { name: "Pflugerville", x: 72, y: 18, eta: "55 min" },
  { name: "Bee Cave", x: 16, y: 62, eta: "60 min" }, { name: "Buda", x: 46, y: 86, eta: "60 min" },
];

export const reviews = [
  { name: "Maya R.", area: "Hyde Park", text: "Pipe burst at 1am. Marco was here in 50 minutes, had the water off in two, and the price he quoted was the price I paid.", job: "Emergency" },
  { name: "Daniel K.", area: "Westlake", text: "They found a slab leak three other companies missed, with one hole the size of a coaster. Unreal.", job: "Leak detection" },
  { name: "Priya S.", area: "Mueller", text: "Showed me the camera footage before and after. First plumber who ever explained why my drain keeps clogging.", job: "Drain cleaning" },
  { name: "Tom & Jess", area: "Zilker", text: "Repiped our 1962 house in two days while we lived there. Walls patched, painted, spotless.", job: "Repiping" },
  { name: "Luis M.", area: "East Austin", text: "New tankless heater installed the same afternoon. They even walked me through the running costs first.", job: "Water heater" },
];

export const faqs = [
  { q: "How fast can you get here?", a: "Inside central Austin most emergencies are reached in about an hour. Booked visits come in a two-hour window, and we text when the plumber is 20 minutes away." },
  { q: "Do you charge for quotes?", a: "Written quotes for planned work are free. Diagnostic visits have a fixed fee that's waived if you go ahead with the repair." },
  { q: "Are your plumbers licensed and insured?", a: "Every plumber is state-licensed, background-checked and covered by $2M liability insurance. (This is a demo brand, so these details are illustrative.)" },
  { q: "Will I know the price before you start?", a: "Always. You get a fixed, written price on the tablet. Nothing starts until you approve it." },
  { q: "What warranty do you give?", a: "One year on repairs, up to 12 years on new water heaters and lifetime workmanship on repipes." },
  { q: "Do you offer financing?", a: "Jobs over $1,000 can be split over 6–18 months at 0% on approved credit (demo)." },
  { q: "Do you clean up after?", a: "Floor protection goes down before tools come in, and we leave the space cleaner than we found it." },
  { q: "Can I book online?", a: "Yes. Pick a service and a time window on the booking page and you'll get a confirmation text straight away." },
];

export const plans = [
  { name: "Fix", price: "$129", per: "from, per job", desc: "One-off repairs with a fixed price up front.", items: ["Fixed written quote", "1-year repair warranty", "Same-day slots", "Card, Apple Pay or invoice"], cta: "Book a repair" },
  { name: "Care Club", price: "$19", per: "per month", desc: "The membership that stops emergencies before they start.", items: ["Annual whole-home inspection", "Water heater flush every year", "15% off all repairs", "Priority, skip-the-line dispatch", "No emergency surcharges"], cta: "Join Care Club", featured: true },
  { name: "Project", price: "Free", per: "written quote", desc: "Remodels, repipes and new installs, planned properly.", items: ["On-site measure", "3D pipe-run plan", "0% financing options", "Lifetime workmanship"], cta: "Get a quote" },
];

export const priceList = [
  { job: "Leaky faucet repair", price: "$129–$189" }, { job: "Toilet repair / rebuild", price: "$149–$229" },
  { job: "Drain clear (single line)", price: "$129–$199" }, { job: "Main line hydro-jet", price: "$399–$649" },
  { job: "Garbage disposal install", price: "$249–$389" }, { job: "Tank water heater install", price: "$1,650–$2,400" },
  { job: "Tankless water heater install", price: "$3,200–$4,800" }, { job: "Leak detection survey", price: "$189–$349" },
  { job: "Whole-home repipe (3 bed)", price: "$3,900–$7,500" },
];

export const nav = [
  { href: "/services/", label: "Services" },
  { href: "/pricing/", label: "Pricing" },
  { href: "/areas/", label: "Areas" },
  { href: "/about/", label: "About" },
  { href: "/faq/", label: "FAQ" },
];
