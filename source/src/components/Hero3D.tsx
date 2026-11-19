"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Real-time 3D brass pipe network with water flowing through a glass run and splashing out of a spout.
 * three.js is loaded only after the page is idle, so it never blocks first paint (LCP is the headline).
 */
export function Hero3D({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = host.current; if (!el) return;
    let disposed = false; let cleanup = () => {};
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = async () => {
      const T = await import("three");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      if (disposed) return;
      const w = () => el.clientWidth, h = () => el.clientHeight;
      const renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
      renderer.setSize(w(), h());
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      el.appendChild(renderer.domElement);
      renderer.domElement.setAttribute("aria-hidden", "true");

      const scene = new T.Scene();
      const pmrem = new T.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      const camera = new T.PerspectiveCamera(32, w() / h(), 0.1, 100);
      camera.position.set(0, 0.5, 17);

      const key = new T.DirectionalLight(0xffd59a, 2.4); key.position.set(5, 6, 6); scene.add(key);
      const rim = new T.PointLight(0x46e3d6, 60, 30); rim.position.set(-5, -2, 4); scene.add(rim);
      scene.add(new T.AmbientLight(0x223355, 0.6));

      const brass = new T.MeshPhysicalMaterial({ color: 0xd9a441, metalness: 1, roughness: 0.22, clearcoat: 0.6, clearcoatRoughness: 0.2 });
      const brassDark = new T.MeshPhysicalMaterial({ color: 0xa8741f, metalness: 1, roughness: 0.35 });
      const copper = new T.MeshPhysicalMaterial({ color: 0xc8744a, metalness: 1, roughness: 0.28, clearcoat: 0.4 });
      const glass = new T.MeshPhysicalMaterial({ color: 0xbff8ff, metalness: 0, roughness: 0.05, transparent: true, opacity: 0.22, clearcoat: 1, side: T.DoubleSide, depthWrite: false });
      const water = new T.MeshPhysicalMaterial({ color: 0x46e3d6, emissive: 0x0b6f78, emissiveIntensity: 0.9, roughness: 0.1, metalness: 0, clearcoat: 1 });

      const V = (x: number, y: number, z: number) => new T.Vector3(x, y, z);
      const rounded = (pts: InstanceType<typeof T.Vector3>[], r = 0.7) => {
        const path = new T.CurvePath<InstanceType<typeof T.Vector3>>();
        let cur = pts[0].clone();
        for (let i = 1; i < pts.length - 1; i++) {
          const p = pts[i];
          const a = p.clone().add(pts[i - 1].clone().sub(p).normalize().multiplyScalar(r));
          const b = p.clone().add(pts[i + 1].clone().sub(p).normalize().multiplyScalar(r));
          path.add(new T.LineCurve3(cur, a)); path.add(new T.QuadraticBezierCurve3(a, p, b)); cur = b;
        }
        path.add(new T.LineCurve3(cur, pts[pts.length - 1]));
        return path;
      };

      const rig = new T.Group(); scene.add(rig);
      const tubes: { mesh: InstanceType<typeof T.Mesh> }[] = [];
      const addPipe = (pts: InstanceType<typeof T.Vector3>[], mat: InstanceType<typeof T.Material>, radius = 0.32) => {
        const curve = rounded(pts);
        const mesh = new T.Mesh(new T.TubeGeometry(curve, 240, radius, 32, false), mat);
        rig.add(mesh); tubes.push({ mesh });
        // flanges at every straight-run joint
        const flangeGeo = new T.CylinderGeometry(radius * 1.32, radius * 1.32, 0.22, 32);
        pts.forEach((p, i) => {
          if (i === 0 || i === pts.length - 1) {
            const f = new T.Mesh(flangeGeo, brassDark);
            const dir = (i === 0 ? pts[1].clone().sub(p) : p.clone().sub(pts[i - 1])).normalize();
            f.position.copy(p); f.quaternion.setFromUnitVectors(V(0, 1, 0), dir); rig.add(f);
          }
        });
        return curve;
      };

      addPipe([V(-5.5, -5, 0), V(-5.5, -1.2, 0), V(-1.5, -1.2, 0), V(-1.5, 1.8, 1.2), V(2.2, 1.8, 1.2), V(2.2, 5, 1.2)], brass, 0.36);
      addPipe([V(-6.5, 2.6, -2), V(-2.8, 2.6, -2), V(-2.8, 4.2, -2), V(0.6, 4.2, -2), V(0.6, 6, -2)], copper, 0.26);
      addPipe([V(5.8, -5.5, -1), V(5.8, -2.4, -1), V(4.2, -2.4, -1)], brass, 0.3);
      const glassCurve = addPipe([V(4.2, -2.4, -1), V(1.2, -2.4, -1), V(1.2, -2.4, 1.6), V(1.2, -0.6, 1.6), V(-0.6, -0.6, 1.6)], glass, 0.34);
      // spout
      const spout = new T.Mesh(new T.CylinderGeometry(0.3, 0.42, 0.9, 32, 1, true), brass);
      spout.position.set(-1.0, -0.6, 1.6); spout.rotation.z = Math.PI / 2; rig.add(spout);
      const spoutEnd = V(-1.45, -0.6, 1.6);

      // Valve wheel
      const valve = new T.Group();
      const ring = new T.Mesh(new T.TorusGeometry(0.95, 0.11, 20, 64), new T.MeshPhysicalMaterial({ color: 0xff5a36, metalness: 0.6, roughness: 0.35, clearcoat: 1 }));
      valve.add(ring);
      for (let i = 0; i < 4; i++) { const s = new T.Mesh(new T.CylinderGeometry(0.06, 0.06, 1.9, 12), ring.material); s.rotation.z = (i * Math.PI) / 4; valve.add(s); }
      const hub = new T.Mesh(new T.CylinderGeometry(0.2, 0.2, 0.3, 24), brass); hub.rotation.x = Math.PI / 2; valve.add(hub);
      const stem = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 0.9, 16), brassDark); stem.rotation.x = Math.PI / 2; stem.position.z = -0.45; valve.add(stem);
      valve.position.set(-5.5, -3.2, 0.45); rig.add(valve);

      // Gauge
      const gauge = new T.Group();
      gauge.add(new T.Mesh(new T.CylinderGeometry(0.55, 0.55, 0.18, 40), brass));
      const face = new T.Mesh(new T.CircleGeometry(0.46, 40), new T.MeshStandardMaterial({ color: 0xf3eee4, roughness: 0.5 })); face.position.y = 0.095; face.rotation.x = -Math.PI / 2; gauge.add(face);
      const needle = new T.Mesh(new T.BoxGeometry(0.04, 0.02, 0.38), new T.MeshStandardMaterial({ color: 0xff5a36 })); needle.position.y = 0.11; needle.geometry.translate(0, 0, -0.17); gauge.add(needle);
      gauge.rotation.x = Math.PI / 2; gauge.position.set(2.2, 3.2, 1.9); rig.add(gauge);

      // Water flowing through the glass run
      const FLOW = 140;
      const drop = new T.SphereGeometry(0.11, 10, 10);
      const flow = new T.InstancedMesh(drop, water, FLOW); rig.add(flow);
      const offs = Float32Array.from({ length: FLOW }, () => Math.random());
      const jit = Array.from({ length: FLOW }, () => V((Math.random() - .5) * .34, (Math.random() - .5) * .34, (Math.random() - .5) * .34));
      // Splash out of the spout
      const SPL = 220;
      const splash = new T.InstancedMesh(new T.SphereGeometry(0.075, 8, 8), water, SPL); rig.add(splash);
      const sp = Array.from({ length: SPL }, () => ({ p: spoutEnd.clone(), v: V(0, 0, 0), life: Math.random() * 1.6 }));
      const resetDrop = (d: (typeof sp)[number]) => { d.p.copy(spoutEnd); d.v.set(-1.6 - Math.random() * 1.8, (Math.random() - .3) * 1.2, (Math.random() - .5) * 1.4); d.life = 0; };
      sp.forEach(resetDrop); sp.forEach((d) => (d.life = Math.random() * 1.6));

      const m = new T.Matrix4(); const q = new T.Quaternion(); const sc = new T.Vector3(); const tmp = new T.Vector3();
      const layout = () => {
        const W = w(), H = h(); renderer.setSize(W, H); camera.aspect = W / H; camera.updateProjectionMatrix();
        const wide = W > 900;
        rig.position.set(wide ? 5.2 : 0.3, wide ? -0.9 : 0.2, 0);
        rig.scale.setScalar(wide ? 0.74 : Math.min(0.72, W / 640));
      };
      layout();
      const ro = new ResizeObserver(layout); ro.observe(el);

      let mx = 0, my = 0, tx = 0, ty = 0, visible = true, scrollP = 0;
      const onMove = (e: PointerEvent) => { mx = (e.clientX / innerWidth - .5) * 2; my = (e.clientY / innerHeight - .5) * 2; };
      const onScroll = () => { scrollP = Math.min(1, scrollY / Math.max(1, el.clientHeight)); };
      addEventListener("pointermove", onMove, { passive: true }); addEventListener("scroll", onScroll, { passive: true });
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(el);

      const clock = new T.Clock(); let raf = 0;
      const frame = () => {
        raf = requestAnimationFrame(frame);
        if (!visible || document.hidden) return;
        const dt = Math.min(clock.getDelta(), 0.05); const t = clock.elapsedTime;
        tx += (mx - tx) * 0.04; ty += (my - ty) * 0.04;
        rig.rotation.y = -0.38 + tx * 0.28 + scrollP * 0.9 + Math.sin(t * 0.25) * 0.05;
        rig.rotation.x = 0.12 + ty * 0.12 - scrollP * 0.25;
        valve.rotation.z = -t * 0.6 - scrollP * 6;
        needle.rotation.y = Math.sin(t * 1.3) * 0.25 + 0.6;
        for (let i = 0; i < FLOW; i++) {
          const u = (offs[i] + t * 0.16) % 1;
          glassCurve.getPointAt(u, tmp).add(jit[i]);
          const s = 0.6 + 0.4 * Math.sin(u * 40 + i);
          m.compose(tmp, q, sc.setScalar(s)); flow.setMatrixAt(i, m);
        }
        flow.instanceMatrix.needsUpdate = true;
        for (let i = 0; i < SPL; i++) {
          const d = sp[i]; d.life += dt;
          if (d.life > 1.6) resetDrop(d);
          d.v.y -= 9.8 * dt * 0.55; d.p.addScaledVector(d.v, dt);
          const s = Math.max(0, 1 - d.life / 1.6);
          m.compose(d.p, q, sc.setScalar(s)); splash.setMatrixAt(i, m);
        }
        splash.instanceMatrix.needsUpdate = true;
        renderer.render(scene, camera);
      };
      if (reduce) { renderer.render(scene, camera); } else frame();
      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
        removeEventListener("pointermove", onMove); removeEventListener("scroll", onScroll);
        scene.traverse((o) => { const mesh = o as InstanceType<typeof T.Mesh>; mesh.geometry?.dispose?.(); });
        renderer.dispose(); pmrem.dispose(); renderer.domElement.remove();
      };
    };
    const kick = () => { start().catch(() => {}); };
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: object) => number }).requestIdleCallback;
    const id = idle ? idle(kick, { timeout: 1500 }) : window.setTimeout(kick, 600);
    return () => { disposed = true; if (!idle) clearTimeout(id); cleanup(); };
  }, []);

  return <div ref={host} className={`${className} transition-opacity duration-[1.4s] ${ready ? "opacity-100" : "opacity-0"}`} />;
}
