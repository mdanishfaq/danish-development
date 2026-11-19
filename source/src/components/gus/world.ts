// Gus & Co. — the toy-style 3D world. Pure three.js (no React), loaded only after the visitor interacts.
import * as T from "three";

export const STATIONS = ["hero", "leak", "drain", "heater", "faucet", "emergency", "finale"] as const;
export type StationKey = (typeof STATIONS)[number];
const GAP = 12;
const SX = (i: number) => i * GAP;

type Opts = { canvas: HTMLCanvasElement; mode: "journey" | StationKey; getProgress?: () => number; preserve?: boolean; fixedW?: number; onNight?: (n: number) => void };

const C = {
  skin: 0xf6c9a4, cap: 0xffc93c, overalls: 0x34425e, shirt: 0x38b6e8, boot: 0x5a3b28, mustache: 0x7a4a26,
  pipe: 0xb8c4d1, copper: 0xd98b52, wall: 0xfff3dc, tile: 0xcdeafe, counter: 0xf2f2f2, wood: 0xe8b07a,
  water: 0x4cc3ff, dirty: 0x9b8a5a, red: 0xff5b4d, green: 0x3ccf7a, path: 0xffe7a8, grass: 0x8fdc6b, white: 0xffffff, dark: 0x203047,
};
const mat = (color: number, extra: Partial<T.MeshStandardMaterialParameters> = {}) => new T.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0, ...extra });
const box = (w: number, h: number, d: number, m: T.Material, r = 0) => {
  const g = r > 0 ? roundedBox(w, h, d, r) : new T.BoxGeometry(w, h, d);
  return new T.Mesh(g, m);
};
function roundedBox(w: number, h: number, d: number, r: number) {
  // cheap rounded box: extruded rounded rectangle
  const s = new T.Shape(); const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  const g = new T.ExtrudeGeometry(s, { depth: d - r * 2, bevelEnabled: true, bevelSize: r, bevelThickness: r, bevelSegments: 3, curveSegments: 6 });
  g.translate(0, 0, -(d - r * 2) / 2); return g;
}
const sph = (r: number, m: T.Material, ws = 20) => new T.Mesh(new T.SphereGeometry(r, ws, Math.round(ws * 0.75)), m);
const cyl = (rt: number, rb: number, h: number, m: T.Material, seg = 24) => new T.Mesh(new T.CylinderGeometry(rt, rb, h, seg), m);
/** limb hanging down from its pivot (pivot at the top) */
const limb = (r: number, len: number, m: T.Material) => { const g = new T.CapsuleGeometry(r, len, 6, 14); g.translate(0, -len / 2 - r * 0.2, 0); return new T.Mesh(g, m); };

/* ======================= GUS ======================= */
function makeGus() {
  const M = { skin: mat(C.skin), cap: mat(C.cap), ov: mat(C.overalls), shirt: mat(C.shirt), boot: mat(C.boot), mus: mat(C.mustache, { roughness: 0.8 }), eye: mat(0x1b1b1b, { roughness: 0.3 }), white: mat(C.white), btn: mat(C.cap, { metalness: 0.4, roughness: 0.3 }) };
  const root = new T.Group();
  const hips = new T.Group(); hips.position.y = 1.02; root.add(hips);
  const pelvis = box(0.78, 0.36, 0.5, M.ov, 0.12); hips.add(pelvis);
  const torso = new T.Group(); torso.position.y = 0.12; hips.add(torso);
  const chest = new T.Mesh(new T.CapsuleGeometry(0.42, 0.42, 6, 20), M.shirt); chest.position.y = 0.42; chest.scale.set(1, 1, 0.82); torso.add(chest);
  const belly = new T.Mesh(new T.CapsuleGeometry(0.43, 0.12, 6, 20), M.shirt); belly.position.y = 0.12; belly.scale.set(1, 1, 0.85); torso.add(belly);
  const belt = cyl(0.47, 0.47, 0.14, M.cap, 28); belt.scale.z = 0.86; belt.position.y = -0.02; torso.add(belt);
  for (const sx of [-1, 1]) { const pouch = box(0.2, 0.22, 0.14, mat(0xe0a92a), 0.04); pouch.position.set(sx * 0.32, -0.1, 0.3); pouch.rotation.y = sx * 0.5; torso.add(pouch); }
  const buckle = box(0.14, 0.11, 0.05, mat(0xdfe6ee, { metalness: 0.6, roughness: 0.3 }), 0.02); buckle.position.set(0, -0.02, 0.41); torso.add(buckle);
  const collar = new T.Mesh(new T.TorusGeometry(0.2, 0.05, 8, 20), M.shirt); collar.rotation.x = Math.PI / 2; collar.position.y = 0.92; torso.add(collar);
  const name = box(0.2, 0.08, 0.03, M.white, 0.01); name.position.set(0.2, 0.52, 0.36); torso.add(name);
  // head
  const head = new T.Group(); head.position.y = 1.08; torso.add(head);
  const neck = cyl(0.13, 0.15, 0.2, M.skin); neck.position.y = -0.14; head.add(neck);
  const skull = sph(0.4, M.skin, 28); skull.position.y = 0.22; skull.scale.set(1, 1.02, 0.95); head.add(skull);
  const nose = sph(0.11, mat(0xf1b08a), 16); nose.position.set(0, 0.17, 0.39); head.add(nose);
  for (const sx of [-1, 1]) {
    const eyeW = sph(0.075, M.white, 14); eyeW.position.set(sx * 0.14, 0.32, 0.33); eyeW.scale.z = 0.6; head.add(eyeW);
    const eye = sph(0.045, M.eye, 12); eye.position.set(sx * 0.14, 0.32, 0.375); head.add(eye);
    const lens = new T.Mesh(new T.TorusGeometry(0.1, 0.022, 8, 20), mat(0x1d2a40)); lens.position.set(sx * 0.14, 0.32, 0.38); head.add(lens);
    const ear = sph(0.08, M.skin, 12); ear.position.set(sx * 0.39, 0.2, 0); head.add(ear);
    const brow = box(0.14, 0.035, 0.04, M.mus); brow.position.set(sx * 0.14, 0.43, 0.35); brow.rotation.z = sx * 0.12; head.add(brow);
  }
  const beard = new T.Mesh(new T.SphereGeometry(0.4, 24, 14, 0, Math.PI * 2, Math.PI * 0.52, Math.PI * 0.48), M.mus); beard.position.set(0, 0.24, 0.03); beard.scale.set(1.04, 1.05, 1.02); head.add(beard);
  const bridge = box(0.08, 0.02, 0.02, mat(0x1d2a40)); bridge.position.set(0, 0.33, 0.4); head.add(bridge);
  const smile = new T.Mesh(new T.TorusGeometry(0.08, 0.022, 8, 16, Math.PI), mat(0xffffff)); smile.position.set(0, 0.06, 0.39); smile.rotation.z = Math.PI; head.add(smile);
  const capTop = new T.Mesh(new T.SphereGeometry(0.42, 26, 14, 0, Math.PI * 2, 0, Math.PI / 2), M.cap); capTop.position.y = 0.36; capTop.scale.set(1.04, 0.72, 1.04); head.add(capTop);
  const brim = cyl(0.3, 0.3, 0.05, M.cap, 26); brim.scale.set(1.1, 1, 0.75); brim.position.set(0, 0.4, 0.36); brim.rotation.x = 0.12; head.add(brim);
  const badge = cyl(0.09, 0.09, 0.02, mat(C.overalls), 18); badge.rotation.x = Math.PI / 2 - 0.5; badge.position.set(0, 0.55, 0.36); head.add(badge);
  // arms
  const arms: { sh: T.Group; el: T.Group; hand: T.Group }[] = [];
  for (const sx of [-1, 1]) {
    const sh = new T.Group(); sh.position.set(sx * 0.5, 0.7, 0); torso.add(sh);
    const ua = limb(0.13, 0.32, M.shirt); sh.add(ua);
    const el = new T.Group(); el.position.y = -0.48; sh.add(el);
    const fa = limb(0.12, 0.3, M.skin); el.add(fa);
    const hand = new T.Group(); hand.position.y = -0.46; el.add(hand);
    const palm = sph(0.14, M.skin, 14); hand.add(palm);
    sh.rotation.z = sx * 0.12;
    arms.push({ sh, el, hand });
  }
  // legs
  const legs: { hip: T.Group; knee: T.Group }[] = [];
  for (const sx of [-1, 1]) {
    const hip = new T.Group(); hip.position.set(sx * 0.2, -0.1, 0); hips.add(hip);
    const th = limb(0.17, 0.26, M.ov); hip.add(th);
    const knee = new T.Group(); knee.position.y = -0.44; hip.add(knee);
    const sh = limb(0.15, 0.22, M.ov); knee.add(sh);
    const boot = box(0.3, 0.18, 0.42, M.boot, 0.07); boot.position.set(0, -0.44, 0.07); knee.add(boot);
    legs.push({ hip, knee });
  }
  // blob shadow
  const shadow = new T.Mesh(new T.CircleGeometry(0.7, 28), new T.MeshBasicMaterial({ color: 0x14304f, transparent: true, opacity: 0.18, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.012; root.add(shadow);
  return { root, hips, torso, head, arms, legs, shadow };
}
type Gus = ReturnType<typeof makeGus>;

/* ======================= TOOLS ======================= */
function makeTools() {
  const steel = mat(0xb9c3cf, { metalness: 0.6, roughness: 0.3 });
  const wrench = new T.Group();
  const handle = box(0.09, 0.62, 0.05, mat(C.red, { roughness: 0.4 }), 0.02); handle.position.y = -0.3; wrench.add(handle);
  const jaw = new T.Mesh(new T.TorusGeometry(0.11, 0.04, 8, 16, Math.PI * 1.5), steel); jaw.position.y = -0.66; jaw.rotation.z = Math.PI * 0.75; wrench.add(jaw);
  const scanner = new T.Group();
  const sb = box(0.28, 0.42, 0.12, mat(0x26324a), 0.04); sb.position.y = -0.18; scanner.add(sb);
  const screen = box(0.2, 0.18, 0.02, new T.MeshBasicMaterial({ color: 0x5cf2c2 })); screen.position.set(0, -0.1, 0.07); scanner.add(screen);
  const plunger = new T.Group();
  const stick = cyl(0.035, 0.035, 1.0, mat(C.wood)); stick.position.y = -0.45; plunger.add(stick);
  const cup = new T.Mesh(new T.SphereGeometry(0.2, 18, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat(C.red, { side: T.DoubleSide })); cup.position.y = -0.95; plunger.add(cup);
  const torch = new T.Group();
  const tb = cyl(0.07, 0.09, 0.4, mat(0xffd23f)); tb.rotation.x = Math.PI / 2; tb.position.z = 0.15; torch.add(tb);
  const beam = new T.Mesh(new T.ConeGeometry(0.9, 3.2, 24, 1, true), new T.MeshBasicMaterial({ color: 0xfff6b0, transparent: true, opacity: 0.18, depthWrite: false, side: T.DoubleSide }));
  beam.rotation.x = -Math.PI / 2; beam.position.z = 1.9; torch.add(beam);
  return { wrench, scanner, plunger, torch };
}

/* ======================= SCENERY & STATIONS ======================= */
function particles(n: number, r: number, m: T.Material) {
  const im = new T.InstancedMesh(new T.SphereGeometry(r, 8, 6), m, n); im.frustumCulled = false; return im;
}
function textTexture(lines: string[], w = 512, h = 256, bg = "#ffc93c", fg = "#10223a") {
  const c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d")!;
  x.fillStyle = bg; x.fillRect(0, 0, w, h); x.fillStyle = fg; x.textAlign = "center"; x.textBaseline = "middle";
  x.font = "bold 92px system-ui, sans-serif"; x.fillText(lines[0], w / 2, h * 0.42);
  if (lines[1]) { x.font = "bold 40px system-ui, sans-serif"; x.fillText(lines[1], w / 2, h * 0.78); }
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; return t;
}

function makeVan() {
  const g = new T.Group();
  const body = box(3.4, 1.55, 1.7, mat(C.white), 0.22); body.position.set(0, 1.25, 0); g.add(body);
  const cab = box(1.1, 1.1, 1.66, mat(C.white), 0.2); cab.position.set(2.0, 1.02, 0); g.add(cab);
  const stripe = box(4.4, 0.22, 1.74, mat(C.cap)); stripe.position.set(0.5, 0.78, 0); g.add(stripe);
  const sign = new T.Mesh(new T.PlaneGeometry(2.4, 1.0), new T.MeshBasicMaterial({ map: textTexture(["GUS & CO.", "PLUMBING · 24/7"]) })); sign.position.set(-0.2, 1.42, 0.87); g.add(sign);
  const win = box(0.7, 0.5, 1.68, mat(0x9fd8ff, { roughness: 0.15, metalness: 0.2 }), 0.08); win.position.set(2.2, 1.25, 0); g.add(win);
  for (const [x, z] of [[-1.1, 0.85], [1.8, 0.85], [-1.1, -0.85], [1.8, -0.85]]) {
    const w = cyl(0.36, 0.36, 0.28, mat(0x2a2f3a), 22); w.rotation.x = Math.PI / 2; w.position.set(x, 0.36, z); g.add(w);
    const hub = cyl(0.15, 0.15, 0.3, mat(0xd7dde6, { metalness: 0.5 }), 14); hub.rotation.x = Math.PI / 2; hub.position.set(x, 0.36, z); g.add(hub);
  }
  const ladder = new T.Group(); for (let i = 0; i < 6; i++) { const r = box(0.06, 0.06, 0.6, mat(0xc7ced8)); r.position.set(-1.3 + i * 0.45, 2.12, 0); ladder.add(r); }
  for (const z of [-0.3, 0.3]) { const s = box(2.4, 0.06, 0.06, mat(0xc7ced8)); s.position.set(-0.2, 2.12, z); ladder.add(s); }
  g.add(ladder);
  const light = box(0.5, 0.14, 0.3, mat(0xff8a3d, { emissive: 0xff6a00, emissiveIntensity: 0.6 }), 0.05); light.position.set(2.0, 1.66, 0); g.add(light);
  return g;
}

function makeTree(s = 1) {
  const g = new T.Group();
  const trunk = cyl(0.12 * s, 0.16 * s, 0.9 * s, mat(0x9a6a42)); trunk.position.y = 0.45 * s; g.add(trunk);
  const crown = sph(0.75 * s, mat(0x66c95c), 14); crown.position.y = 1.4 * s; g.add(crown);
  const crown2 = sph(0.5 * s, mat(0x7bd86c), 12); crown2.position.set(0.35 * s, 1.8 * s, 0.1); g.add(crown2);
  return g;
}

function makeWorld(scene: T.Scene) {
  const world = new T.Group(); scene.add(world);
  const len = GAP * (STATIONS.length - 1) + 40;
  const path = box(len, 0.3, 4.2, mat(C.path), 0.12); path.position.set(len / 2 - 20, -0.15, 0); world.add(path);
  const grass = box(len, 0.2, 10, mat(C.grass)); grass.position.set(len / 2 - 20, -0.3, -3); world.add(grass);
  const front = box(len, 0.2, 6, mat(0x7fd35e)); front.position.set(len / 2 - 20, -0.32, 5); world.add(front);
  // dashes on the path
  for (let x = -16; x < len - 20; x += 2.2) { const d = box(0.9, 0.02, 0.16, mat(0xffffff)); d.position.set(x, 0.01, 1.4); world.add(d); }
  // trees, bushes, clouds
  for (let i = -1; i < STATIONS.length; i++) {
    const t = makeTree(0.9 + ((i * 37) % 5) / 10); t.position.set(SX(i) + 6, 0, -3.4); world.add(t);
    const b = sph(0.45, mat(0x5cc152), 12); b.scale.y = 0.7; b.position.set(SX(i) + 4.6, 0.2, -2.6); world.add(b);
  }
  const clouds: T.Group[] = [];
  for (let i = 0; i < 14; i++) {
    const c = new T.Group(); const m = mat(0xffffff, { roughness: 1 });
    for (let k = 0; k < 4; k++) { const s = sph(0.6 + (k % 2) * 0.35, m, 12); s.position.set(k * 0.6 - 0.9, (k % 2) * 0.25, 0); c.add(s); }
    c.position.set(-10 + i * 7.3, 6 + (i % 3) * 0.9, -12 - (i % 2) * 3); clouds.push(c); world.add(c);
  }
  return { world, clouds };
}

type Station = { group: T.Group; gusOffset: number; face: number; update: (w: number, t: number, dt: number, night: number) => void; pose: (g: Gus, w: number, t: number, tools: ReturnType<typeof makeTools>) => void };

function stations(scene: T.Scene, tools: ReturnType<typeof makeTools>): Record<StationKey, Station> {
  const S = {} as Record<StationKey, Station>;
  const waterM = mat(C.water, { roughness: 0.1, transparent: true, opacity: 0.9, emissive: 0x0a3a66, emissiveIntensity: 0.2 });
  const pipeM = mat(C.pipe, { metalness: 0.5, roughness: 0.3 });
  const copperM = mat(C.copper, { metalness: 0.6, roughness: 0.3 });
  const dummy = new T.Object3D();

  /* ---- HERO: van ---- */
  {
    const g = new T.Group(); g.position.x = SX(0); scene.add(g);
    const van = makeVan(); van.position.set(1.6, 0, -1.4); van.rotation.y = -0.25; g.add(van);
    const toolbox = box(0.7, 0.4, 0.4, mat(C.red), 0.06); toolbox.position.set(-1.3, 0.2, 0.6); g.add(toolbox);
    S.hero = {
      group: g, gusOffset: -0.9, face: 0.25,
      update: () => {},
      pose: (gus, w, t) => { wave(gus, t); },
    };
  }

  /* ---- LEAK: wall pipe dripping; scan, then wrap ---- */
  {
    const g = new T.Group(); g.position.x = SX(1); scene.add(g);
    const wall = box(4.4, 3.6, 0.3, mat(C.wall), 0.08); wall.position.set(1.2, 1.8, -1.6); g.add(wall);
    for (let i = 0; i < 5; i++) { const tl = box(4.4, 0.04, 0.32, mat(0xf3e2c4)); tl.position.set(1.2, 0.6 + i * 0.7, -1.6); g.add(tl); }
    const p1 = cyl(0.13, 0.13, 3.2, pipeM); p1.rotation.z = Math.PI / 2; p1.position.set(1.2, 2.5, -1.3); g.add(p1);
    const p2 = cyl(0.13, 0.13, 2.2, pipeM); p2.position.set(2.8, 1.4, -1.3); g.add(p2);
    const elbow = sph(0.17, pipeM, 14); elbow.position.set(2.8, 2.5, -1.3); g.add(elbow);
    const joint = cyl(0.19, 0.19, 0.3, mat(0x9aa6b4, { metalness: 0.6 })); joint.rotation.z = Math.PI / 2; joint.position.set(1.4, 2.5, -1.3); g.add(joint);
    const tape = cyl(0.21, 0.21, 0.34, mat(0x2f7df6)); tape.rotation.z = Math.PI / 2; tape.position.copy(joint.position); tape.scale.setScalar(0.001); g.add(tape);
    const drops = particles(6, 0.07, waterM); g.add(drops);
    const puddle = new T.Mesh(new T.CircleGeometry(0.6, 28), waterM); puddle.rotation.x = -Math.PI / 2; puddle.position.set(1.4, 0.02, -0.9); g.add(puddle);
    const check = makeCheck(); check.position.set(1.4, 3.3, -1.1); g.add(check);
    const ring = new T.Mesh(new T.RingGeometry(0.25, 0.32, 32), new T.MeshBasicMaterial({ color: 0x5cf2c2, transparent: true, opacity: 0.8, side: T.DoubleSide })); ring.position.set(1.4, 2.5, -1.05); g.add(ring);
    S.leak = {
      group: g, gusOffset: -0.2, face: 0.55,
      update: (w, t) => {
        const fixed = smooth(0.55, 0.75, w);
        for (let i = 0; i < 6; i++) {
          const ph = (t * 0.9 + i / 6) % 1; const y = 2.35 - ph * 2.3;
          dummy.position.set(1.4, y, -1.25); dummy.scale.setScalar((1 - fixed) * (ph < 0.95 ? 1 : 0)); dummy.updateMatrix(); drops.setMatrixAt(i, dummy.matrix);
        }
        drops.instanceMatrix.needsUpdate = true;
        puddle.scale.setScalar(0.4 + (1 - fixed) * 0.8 + Math.sin(t * 3) * 0.02);
        tape.scale.setScalar(Math.max(0.001, smooth(0.5, 0.7, w)));
        ring.visible = w > 0.1 && w < 0.6; ring.scale.setScalar(1 + ((t * 1.5) % 1) * 1.5); (ring.material as T.MeshBasicMaterial).opacity = 0.8 * (1 - ((t * 1.5) % 1));
        popCheck(check, smooth(0.75, 0.9, w), t);
      },
      pose: (gus, w, t, tl) => {
        idle(gus, t);
        hold(gus, w < 0.5 ? tl.scanner : tl.wrench);
        const r = gus.arms[1];
        if (w < 0.5) { r.sh.rotation.set(-1.9 + Math.sin(t * 2) * 0.15, 0, -0.3 + Math.sin(t * 1.3) * 0.3); r.el.rotation.x = -0.4; }
        else { r.sh.rotation.set(-2.4, 0, -0.2); r.el.rotation.x = -0.6 + Math.sin(t * 9) * 0.35; gus.arms[0].sh.rotation.set(-2.2, 0, 0.4); gus.arms[0].el.rotation.x = -0.6; }
        gus.head.rotation.x = -0.45;
      },
    };
  }

  /* ---- DRAIN: clogged sink, plunge ---- */
  {
    const g = new T.Group(); g.position.x = SX(2); scene.add(g);
    const cab = box(2.6, 1.3, 1.2, mat(0x9fd8ff), 0.08); cab.position.set(1.3, 0.65, -0.9); g.add(cab);
    const top = box(2.8, 0.14, 1.4, mat(C.counter), 0.05); top.position.set(1.3, 1.36, -0.9); g.add(top);
    const basin = box(1.2, 0.5, 0.8, mat(0xdfe6ee, { metalness: 0.3, roughness: 0.25 }), 0.08); basin.position.set(1.1, 1.18, -0.9); g.add(basin);
    const water = box(1.04, 0.05, 0.64, mat(C.dirty, { roughness: 0.15, transparent: true, opacity: 0.92 })); water.position.set(1.1, 1.38, -0.9); g.add(water);
    const tap = new T.Group(); const tb = cyl(0.06, 0.08, 0.5, mat(0xd7dde6, { metalness: 0.7, roughness: 0.2 })); tb.position.y = 0.25; tap.add(tb);
    const sp = cyl(0.05, 0.05, 0.4, tb.material as T.Material); sp.rotation.x = Math.PI / 2; sp.position.set(0, 0.48, 0.18); tap.add(sp); tap.position.set(1.1, 1.43, -1.45); g.add(tap);
    for (let i = 0; i < 3; i++) { const d = box(0.04, 0.3, 0.02, mat(0x2f7df6)); d.position.set(0.5 + i * 0.6, 0.65, -0.29); g.add(d); }
    const bubbles = particles(10, 0.05, mat(0xffffff, { transparent: true, opacity: 0.85 })); g.add(bubbles);
    const swirl = new T.Mesh(new T.RingGeometry(0.06, 0.24, 32, 1, 0, Math.PI * 1.5), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6, side: T.DoubleSide })); swirl.rotation.x = -Math.PI / 2; swirl.position.set(1.1, 1.0, -0.9); g.add(swirl);
    const check = makeCheck(); check.position.set(1.1, 2.6, -0.9); g.add(check);
    const dirty = new T.Color(C.dirty), clean = new T.Color(C.water);
    S.drain = {
      group: g, gusOffset: 0.15, face: 0.9,
      update: (w, t) => {
        const d = smooth(0.35, 0.8, w);
        water.position.y = 1.38 - d * 0.36; water.visible = d < 0.97;
        (water.material as T.MeshStandardMaterial).color.copy(dirty).lerp(clean, d);
        swirl.visible = d > 0.2 && d < 0.98; swirl.position.y = water.position.y + 0.03; swirl.rotation.z = -t * 6;
        for (let i = 0; i < 10; i++) {
          const ph = (t * 0.8 + i / 10) % 1; dummy.position.set(0.7 + (i % 5) * 0.2, water.position.y + ph * 0.5, -0.9 + ((i * 7) % 5) * 0.1 - 0.2);
          dummy.scale.setScalar(w > 0.15 && w < 0.7 ? (1 - ph) : 0); dummy.updateMatrix(); bubbles.setMatrixAt(i, dummy.matrix);
        }
        bubbles.instanceMatrix.needsUpdate = true;
        popCheck(check, smooth(0.8, 0.92, w), t);
      },
      pose: (gus, w, t, tl) => {
        idle(gus, t); hold(gus, tl.plunger);
        const pump = w < 0.8 ? Math.sin(t * 7) : 0;
        for (const a of gus.arms) { a.sh.rotation.set(-1.25 + pump * 0.25, 0, 0); a.el.rotation.x = -0.5 - pump * 0.3; }
        gus.arms[0].sh.rotation.z = 0.35; gus.arms[1].sh.rotation.z = -0.35;
        gus.hips.position.y = 1.02 - Math.max(0, pump) * 0.06; gus.head.rotation.x = -0.5;
      },
    };
  }

  /* ---- HEATER: kneel, wrench the valve, flame + steam ---- */
  {
    const g = new T.Group(); g.position.x = SX(3); scene.add(g);
    const tank = cyl(0.75, 0.75, 2.4, mat(0xf4f7fb, { roughness: 0.35 }), 32); tank.position.set(1.6, 1.3, -1.0); g.add(tank);
    const dome = new T.Mesh(new T.SphereGeometry(0.75, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2), tank.material); dome.position.set(1.6, 2.5, -1.0); dome.scale.y = 0.4; g.add(dome);
    const band = cyl(0.77, 0.77, 0.12, mat(C.red), 32); band.position.set(1.6, 2.1, -1.0); g.add(band);
    const label = new T.Mesh(new T.PlaneGeometry(0.8, 0.5), new T.MeshBasicMaterial({ map: textTexture(["HOT", "50 GAL"], 256, 160, "#ff5b4d", "#ffffff") })); label.position.set(1.6, 1.6, -0.24); g.add(label);
    for (const dx of [-0.3, 0.3]) { const p = cyl(0.08, 0.08, 1.4, copperM); p.position.set(1.6 + dx, 3.2, -1.0); g.add(p); }
    const base = cyl(0.8, 0.85, 0.2, mat(0x56637a), 32); base.position.set(1.6, 0.1, -1.0); g.add(base);
    const flameWin = box(0.4, 0.25, 0.05, mat(0x1b2333)); flameWin.position.set(1.6, 0.45, -0.24); g.add(flameWin);
    const flame = new T.Mesh(new T.ConeGeometry(0.1, 0.22, 12), new T.MeshBasicMaterial({ color: 0x55a8ff })); flame.position.set(1.6, 0.45, -0.2); g.add(flame);
    const valve = new T.Group(); const vw = new T.Mesh(new T.TorusGeometry(0.18, 0.04, 8, 20), mat(C.red)); valve.add(vw);
    const sp1 = box(0.36, 0.04, 0.04, mat(C.red)); valve.add(sp1); const sp2 = sp1.clone(); sp2.rotation.z = Math.PI / 2; valve.add(sp2);
    valve.position.set(0.95, 0.7, -0.5); valve.rotation.y = 0.6; g.add(valve);
    const steam = particles(10, 0.16, mat(0xffffff, { transparent: true, opacity: 0.55, roughness: 1 })); g.add(steam);
    const check = makeCheck(); check.position.set(1.6, 3.6, -0.6); g.add(check);
    S.heater = {
      group: g, gusOffset: -0.3, face: 0.7,
      update: (w, t) => {
        const on = smooth(0.5, 0.7, w);
        flame.scale.set(on, on * (1 + Math.sin(t * 20) * 0.15), on); flame.visible = on > 0.02;
        valve.rotation.z = -w * Math.PI * 3;
        for (let i = 0; i < 10; i++) {
          const ph = (t * 0.35 + i / 10) % 1; dummy.position.set(1.6 + Math.sin(i * 2 + t) * 0.25, 3.0 + ph * 1.8, -1.0); dummy.scale.setScalar(on * (0.4 + ph) * (1 - ph) * 2); dummy.updateMatrix(); steam.setMatrixAt(i, dummy.matrix);
        }
        steam.instanceMatrix.needsUpdate = true;
        popCheck(check, smooth(0.72, 0.88, w), t);
      },
      pose: (gus, w, t, tl) => {
        kneel(gus); hold(gus, tl.wrench);
        const r = gus.arms[1]; r.sh.rotation.set(-1.5, 0.2, -0.2 + Math.sin(t * 4) * 0.4 * (w < 0.7 ? 1 : 0)); r.el.rotation.x = -0.3;
        gus.arms[0].sh.rotation.set(-0.6, 0, 0.4); gus.head.rotation.set(-0.15, 0.2, 0);
      },
    };
  }

  /* ---- FAUCET: install a new faucet, water flows ---- */
  {
    const g = new T.Group(); g.position.x = SX(4); scene.add(g);
    const tiles = box(4, 3.4, 0.2, mat(C.tile), 0.06); tiles.position.set(1.2, 1.7, -1.7); g.add(tiles);
    for (let i = 0; i < 6; i++) for (let k = 0; k < 5; k++) { if ((i + k) % 2) continue; const tl = box(0.62, 0.62, 0.02, mat(0xb4dffc)); tl.position.set(-0.4 + i * 0.66, 0.4 + k * 0.66, -1.58); g.add(tl); }
    const vanity = box(2.0, 1.1, 1.0, mat(C.wood), 0.08); vanity.position.set(1.4, 0.55, -1.1); g.add(vanity);
    const top = box(2.2, 0.12, 1.15, mat(C.counter), 0.04); top.position.set(1.4, 1.16, -1.1); g.add(top);
    const bowl = new T.Mesh(new T.SphereGeometry(0.42, 26, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat(0xffffff, { side: T.DoubleSide, roughness: 0.2 })); bowl.position.set(1.4, 1.45, -1.05); bowl.scale.y = 0.65; g.add(bowl);
    const mirror = box(1.3, 1.1, 0.06, mat(0xcfe9ff, { metalness: 0.4, roughness: 0.05 }), 0.12); mirror.position.set(1.4, 2.4, -1.55); g.add(mirror);
    const faucet = new T.Group(); const chrome = mat(0xe8edf3, { metalness: 0.8, roughness: 0.15 });
    const stem = cyl(0.06, 0.08, 0.55, chrome); stem.position.y = 0.27; faucet.add(stem);
    const arc = new T.Mesh(new T.TorusGeometry(0.18, 0.045, 10, 24, Math.PI), chrome); arc.position.set(0, 0.55, 0.18); arc.rotation.y = Math.PI / 2; faucet.add(arc);
    faucet.position.set(1.4, 1.22, -1.5); g.add(faucet);
    const stream = cyl(0.035, 0.05, 0.6, waterM, 12); stream.position.set(1.4, 1.48, -1.14); g.add(stream);
    const sparkles = particles(8, 0.05, new T.MeshBasicMaterial({ color: 0xffe066 })); g.add(sparkles);
    const check = makeCheck(); check.position.set(1.4, 3.3, -1.2); g.add(check);
    S.faucet = {
      group: g, gusOffset: 0.0, face: 0.85,
      update: (w, t) => {
        const placed = smooth(0.15, 0.55, w);
        faucet.position.y = 1.22 + (1 - placed) * 1.2; faucet.rotation.y = (1 - placed) * 2.5;
        const flow = smooth(0.62, 0.72, w); stream.scale.set(1, Math.max(0.001, flow), 1); stream.position.y = 1.78 - flow * 0.3; stream.visible = flow > 0.01;
        for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + t; const s = flow * (0.6 + Math.sin(t * 6 + i) * 0.4);
          dummy.position.set(1.4 + Math.cos(a) * 0.7, 1.9 + Math.sin(a * 2) * 0.3, -1.0 + Math.sin(a) * 0.3); dummy.scale.setScalar(s); dummy.updateMatrix(); sparkles.setMatrixAt(i, dummy.matrix); }
        sparkles.instanceMatrix.needsUpdate = true;
        popCheck(check, smooth(0.75, 0.9, w), t);
      },
      pose: (gus, w, t, tl) => {
        idle(gus, t); hold(gus, tl.wrench);
        const up = w < 0.6;
        gus.arms[1].sh.rotation.set(up ? -2.2 : -0.2, 0, up ? -0.1 + Math.sin(t * 5) * 0.15 : -2.6); gus.arms[1].el.rotation.x = up ? -0.5 : -0.2;
        gus.arms[0].sh.rotation.set(up ? -2.0 : 0, 0, up ? 0.3 : 0.15); gus.arms[0].el.rotation.x = up ? -0.7 : 0;
        if (!up) { gus.arms[1].el.rotation.z = Math.sin(t * 8) * 0.25; }
      },
    };
  }

  /* ---- EMERGENCY: night, burst pipe spraying, run with torch, shut main valve ---- */
  {
    const g = new T.Group(); g.position.x = SX(5); scene.add(g);
    const wall = box(4.6, 3.8, 0.3, mat(0xd7cfe8), 0.08); wall.position.set(1.4, 1.9, -1.7); g.add(wall);
    const pipe = cyl(0.15, 0.15, 4.2, pipeM); pipe.rotation.z = Math.PI / 2; pipe.position.set(1.4, 2.8, -1.35); g.add(pipe);
    const crack = sph(0.22, mat(0x7c8796), 10); crack.position.set(2.2, 2.8, -1.35); g.add(crack);
    const main = new T.Group(); const mw = new T.Mesh(new T.TorusGeometry(0.32, 0.06, 10, 28), mat(C.red, { emissive: 0x661008, emissiveIntensity: 0.4 })); main.add(mw);
    for (let k = 0; k < 3; k++) { const s = box(0.62, 0.05, 0.05, mw.material as T.Material); s.rotation.z = k * Math.PI / 3; main.add(s); }
    main.position.set(0.3, 1.2, -1.45); g.add(main);
    const mp = cyl(0.12, 0.12, 1.8, pipeM); mp.position.set(0.3, 1.9, -1.55); g.add(mp);
    const spray = particles(60, 0.06, waterM); g.add(spray);
    const flood = new T.Mesh(new T.CircleGeometry(1.4, 32), waterM); flood.rotation.x = -Math.PI / 2; flood.position.set(2.2, 0.02, -0.6); g.add(flood);
    const alarm = sph(0.16, mat(0xff3b30, { emissive: 0xff2000, emissiveIntensity: 1 }), 12); alarm.position.set(-0.6, 3.4, -1.5); g.add(alarm);
    const check = makeCheck(); check.position.set(1.4, 3.7, -1.2); g.add(check);
    const seeds = Array.from({ length: 60 }, (_, i) => ({ a: (i * 2.399) % (Math.PI * 2), s: 0.6 + ((i * 7) % 10) / 10, o: (i * 0.137) % 1 }));
    S.emergency = {
      group: g, gusOffset: -0.4, face: 0.4,
      update: (w, t, _dt, night) => {
        const stop = smooth(0.55, 0.72, w);
        for (let i = 0; i < 60; i++) {
          const p = seeds[i]; const ph = (t * 1.3 * p.s + p.o) % 1;
          const vx = Math.cos(p.a) * 1.2, vz = 0.6 + Math.sin(p.a) * 0.5;
          dummy.position.set(2.2 + vx * ph * 1.6, 2.8 + 1.8 * ph - 4.2 * ph * ph, -1.35 + vz * ph * 1.4);
          dummy.scale.setScalar((1 - stop) * (dummy.position.y > 0 ? 1 : 0)); dummy.updateMatrix(); spray.setMatrixAt(i, dummy.matrix);
        }
        spray.instanceMatrix.needsUpdate = true;
        flood.scale.setScalar(0.5 + (1 - stop) * 0.7);
        main.rotation.z = -smooth(0.35, 0.7, w) * Math.PI * 2.5;
        (alarm.material as T.MeshStandardMaterial).emissiveIntensity = (1 - stop) * (0.4 + (Math.sin(t * 10) > 0 ? 1 : 0)) * night + 0.05;
        popCheck(check, smooth(0.75, 0.9, w), t);
      },
      pose: (gus, w, t, tl) => {
        if (w < 0.3) { walk(gus, t * 1.8, 1.4); hold(gus, tl.torch); gus.arms[1].sh.rotation.set(-1.4, 0, -0.1); gus.arms[1].el.rotation.x = -0.2; return; }
        idle(gus, t); hold(gus, null);
        for (const a of gus.arms) { a.sh.rotation.set(-1.7, 0, 0); a.el.rotation.x = -0.4; }
        const turn = w < 0.72 ? Math.sin(t * 6) * 0.35 : 0;
        gus.arms[0].sh.rotation.z = 0.3 + turn; gus.arms[1].sh.rotation.z = -0.3 + turn;
        gus.torso.rotation.y = turn * 0.3;
      },
    };
  }

  /* ---- FINALE: house, Gus thumbs-up, confetti ---- */
  {
    const g = new T.Group(); g.position.x = SX(6); scene.add(g);
    const house = box(3.2, 2.4, 2.2, mat(0xffe0b8), 0.1); house.position.set(1.6, 1.2, -2.0); g.add(house);
    const roof = new T.Mesh(new T.ConeGeometry(2.5, 1.4, 4), mat(0xff7a59)); roof.position.set(1.6, 3.1, -2.0); roof.rotation.y = Math.PI / 4; roof.scale.set(1, 1, 0.75); g.add(roof);
    const door = box(0.7, 1.3, 0.08, mat(0x2f7df6), 0.06); door.position.set(1.6, 0.65, -0.88); g.add(door);
    for (const dx of [-0.95, 0.95]) { const wdw = box(0.6, 0.6, 0.08, mat(0x9fd8ff), 0.06); wdw.position.set(1.6 + dx, 1.5, -0.88); g.add(wdw); }
    const heart = makeHeart(); heart.position.set(1.6, 4.3, -1.6); g.add(heart);
    const conf = particles(40, 0.06, new T.MeshBasicMaterial({ vertexColors: false, color: 0xffffff })); g.add(conf);
    const cols = [0xffc93c, 0x2f7df6, 0xff5b4d, 0x3ccf7a, 0xb06bff].map((c) => new T.Color(c));
    for (let i = 0; i < 40; i++) conf.setColorAt(i, cols[i % cols.length]);
    S.finale = {
      group: g, gusOffset: -0.6, face: 0.15,
      update: (w, t) => {
        heart.scale.setScalar(0.8 + Math.sin(t * 4) * 0.08); heart.rotation.y = Math.sin(t) * 0.4;
        for (let i = 0; i < 40; i++) { const ph = (t * 0.3 + i / 40) % 1; dummy.position.set(-1 + ((i * 53) % 40) / 10, 5.5 - ph * 5.5, -1 + ((i * 17) % 20) / 10); dummy.rotation.set(t * 3 + i, t * 2, 0); dummy.scale.set(1.6, 0.6, 1); dummy.updateMatrix(); conf.setMatrixAt(i, dummy.matrix); }
        conf.instanceMatrix.needsUpdate = true;
      },
      pose: (gus, w, t) => { idle(gus, t); thumbs(gus, t); },
    };
  }
  return S;
}

function makeCheck() {
  const g = new T.Group();
  const disc = cyl(0.42, 0.42, 0.12, mat(C.green, { emissive: 0x0a6a32, emissiveIntensity: 0.3 }), 28); disc.rotation.x = Math.PI / 2; g.add(disc);
  const a = box(0.12, 0.3, 0.1, mat(C.white)); a.position.set(-0.1, -0.04, 0.08); a.rotation.z = 0.8; g.add(a);
  const b = box(0.12, 0.55, 0.1, mat(C.white)); b.position.set(0.1, 0.05, 0.08); b.rotation.z = -0.65; g.add(b);
  g.scale.setScalar(0.001); return g;
}
function makeHeart() {
  const s = new T.Shape(); s.moveTo(0, 0.3); s.bezierCurveTo(0, 0.55, -0.5, 0.6, -0.5, 0.25); s.bezierCurveTo(-0.5, 0, 0, -0.2, 0, -0.45); s.bezierCurveTo(0, -0.2, 0.5, 0, 0.5, 0.25); s.bezierCurveTo(0.5, 0.6, 0, 0.55, 0, 0.3);
  return new T.Mesh(new T.ExtrudeGeometry(s, { depth: 0.2, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 3 }), mat(C.red, { emissive: 0x6a0f08, emissiveIntensity: 0.3 }));
}
function popCheck(c: T.Group, k: number, t: number) { const s = k <= 0 ? 0.001 : easeOutBack(k); c.scale.setScalar(Math.max(0.001, s)); c.rotation.y = Math.sin(t * 2) * 0.3; c.position.y += 0; }

/* ======================= POSES ======================= */
function resetPose(g: Gus) {
  g.hips.position.y = 1.02; g.hips.rotation.set(0, 0, 0); g.torso.rotation.set(0, 0, 0); g.head.rotation.set(0, 0, 0);
  for (const [i, a] of g.arms.entries()) { a.sh.rotation.set(0, 0, i ? -0.12 : 0.12); a.el.rotation.set(0, 0, 0); }
  for (const l of g.legs) { l.hip.rotation.set(0, 0, 0); l.knee.rotation.set(0, 0, 0); }
}
function idle(g: Gus, t: number) { g.torso.scale.y = 1 + Math.sin(t * 2.2) * 0.012; g.head.rotation.z = Math.sin(t * 1.1) * 0.04; }
function walk(g: Gus, t: number, amp = 1) {
  const s = Math.sin(t * 8), c = Math.cos(t * 8);
  g.legs[0].hip.rotation.x = s * 0.6 * amp; g.legs[1].hip.rotation.x = -s * 0.6 * amp;
  g.legs[0].knee.rotation.x = Math.max(0, -c) * 0.8 * amp; g.legs[1].knee.rotation.x = Math.max(0, c) * 0.8 * amp;
  g.arms[0].sh.rotation.x = -s * 0.6 * amp; g.arms[1].sh.rotation.x = s * 0.6 * amp;
  g.arms[0].el.rotation.x = -0.3; g.arms[1].el.rotation.x = -0.3;
  g.hips.position.y = 1.02 + Math.abs(c) * 0.06 * amp; g.torso.rotation.z = s * 0.04;
}
function wave(g: Gus, t: number) { idle(g, t); const r = g.arms[1]; r.sh.rotation.set(0, 0, 2.7); r.el.rotation.set(0, 0, 0.3 + Math.sin(t * 7) * 0.5); g.head.rotation.z = -0.08; }
function thumbs(g: Gus, t: number) { const r = g.arms[1]; r.sh.rotation.set(-0.3, 0, 1.1 + Math.sin(t * 3) * 0.08); r.el.rotation.set(0, 0, 1.3); const l = g.arms[0]; l.sh.rotation.set(-0.3, 0, -1.1 - Math.sin(t * 3 + 1) * 0.08); l.el.rotation.set(0, 0, -1.3); g.head.rotation.x = -0.1; }
function kneel(g: Gus) { g.hips.position.y = 0.62; g.legs[0].hip.rotation.x = -1.5; g.legs[0].knee.rotation.x = 1.5; g.legs[1].hip.rotation.x = 0.1; g.legs[1].knee.rotation.x = 1.6; }
let held: T.Object3D | null = null;
function hold(g: Gus, tool: T.Object3D | null) {
  if (held === tool) return;
  if (held) held.parent?.remove(held);
  held = tool; if (tool) { g.arms[1].hand.add(tool); tool.position.set(0, 0, 0.05); }
}

/* ======================= MATH ======================= */
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (a: number, b: number, x: number) => { const k = clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };
const easeOutBack = (k: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };

/* ======================= ENGINE ======================= */
export function createWorld({ canvas, mode, getProgress, preserve = false, fixedW, onNight }: Opts) {
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: preserve, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(30, 1, 0.1, 200);
  const hemi = new T.HemisphereLight(0xcfeeff, 0xffe6a8, 1.6); scene.add(hemi);
  const sun = new T.DirectionalLight(0xfff1d6, 2.2); sun.position.set(6, 10, 8); scene.add(sun);
  const fill = new T.DirectionalLight(0x9fd8ff, 0.6); fill.position.set(-6, 4, 6); scene.add(fill);
  const nightLight = new T.PointLight(0xfff2b0, 0, 12); scene.add(nightLight);

  const { clouds } = makeWorld(scene);
  const gus = makeGus(); scene.add(gus.root);
  const tools = makeTools();
  const S = stations(scene, tools);
  const keys = STATIONS;
  const single = mode !== "journey" ? keys.indexOf(mode as StationKey) : -1;

  let W = 1, H = 1;
  const resize = () => {
    W = canvas.clientWidth || 1; H = canvas.clientHeight || 1;
    renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize); ro.observe(canvas);

  let gx = SX(0) + S.hero.gusOffset, prevX = gx, face = 0, camX = gx, walkT = 0, visible = true, raf = 0, last = performance.now();
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(canvas);
  const startT = performance.now();

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden) { last = now; return; }
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const t = (now - startT) / 1000;
    // journey position
    let p: number;
    if (single >= 0) { const cyc = (t % 7) / 7; p = single + (fixedW !== undefined ? fixedW * 0.719 : Math.min(0.719, cyc * 0.9)); }
    else p = clamp(getProgress ? getProgress() : 0, 0, keys.length - 1);
    if (!Number.isFinite(p)) p = 0;
    const i = Math.min(keys.length - 1, Math.floor(p)); const f = p - i;
    const st = S[keys[i]];
    let targetX: number, w: number, walking = false;
    if (f < 0.72 || i === keys.length - 1) { targetX = SX(i) + st.gusOffset; w = clamp(f / 0.72); }
    else { const nx = S[keys[i + 1]]; const k = smooth(0, 1, (f - 0.72) / 0.28); targetX = SX(i) + st.gusOffset + (SX(i + 1) + nx.gusOffset - SX(i) - st.gusOffset) * k; w = 1; walking = true; }
    gx += (targetX - gx) * Math.min(1, dt * 6);
    const vel = (gx - prevX) / Math.max(dt, 1e-3); prevX = gx;
    const moving = Math.abs(vel) > 0.6 || walking;
    resetPose(gus);
    if (moving) {
      walkT += dt * Math.min(2.2, 0.6 + Math.abs(vel) * 0.18);
      walk(gus, walkT, Math.min(1.2, 0.5 + Math.abs(vel) * 0.12));
      hold(gus, null);
      face += ((vel >= 0 ? Math.PI / 2 : -Math.PI / 2) - face) * Math.min(1, dt * 10);
    } else {
      st.pose(gus, w, t, tools);
      face += (st.face - face) * Math.min(1, dt * 6);
    }
    gus.root.position.x = gx; gus.root.rotation.y = face;
    // night factor near emergency
    const night = clamp(1 - Math.abs(gx - SX(5)) / 7);
    // station animations: current at w, others idle (finished if passed)
    keys.forEach((k, idx) => S[k].update(idx < i ? 1 : idx === i ? w : 0, t, dt, night));
    hemi.intensity = 1.6 - night * 1.25; sun.intensity = 2.2 - night * 1.9; fill.intensity = 0.6 - night * 0.3;
    nightLight.intensity = night * 18; nightLight.position.set(gx + 1, 3, 1.5);
    onNight?.(night);
    for (const [ci, c] of clouds.entries()) c.position.x += Math.sin(t * 0.1 + ci) * 0.002;
    // camera follows
    camX += (gx + 0.9 - camX) * Math.min(1, dt * 4);
    // keep ~9.5 world units visible horizontally whatever the stage shape
    const aspect = W / H; const dist = Math.min(24, Math.max(9.5, 16 / aspect));
    camera.position.set(camX, 2.4 + dist * 0.06, dist);
    camera.lookAt(camX, 1.75, -0.6);
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(frame);

  return {
    renderer,
    dispose() {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      scene.traverse((o) => { const m = o as T.Mesh; m.geometry?.dispose?.(); const mm = m.material as T.Material | T.Material[] | undefined; if (Array.isArray(mm)) mm.forEach((x) => x.dispose()); else mm?.dispose?.(); });
      renderer.dispose(); held = null;
    },
  };
}
