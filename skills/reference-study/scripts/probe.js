// Snippets for javascript_tool. Paste ONE at a time: big calls time out.

// 1. Stack and page size
JSON.stringify({
  height: document.documentElement.scrollHeight,
  nodes: document.querySelectorAll('*').length,
  scripts: [...document.scripts].map(s => s.src ? s.src.replace(location.origin, '') : 'inline:' + s.textContent.length).slice(0, 40),
  globals: ['gsap', 'ScrollTrigger', 'Lenis', 'lenis', 'THREE', 'anime', '__NEXT_DATA__', '__NUXT__', 'lottie', 'PIXI', 'Webflow'].filter(k => k in window),
  canvases: [...document.querySelectorAll('canvas')].map(c => c.width + 'x' + c.height + ' ' + (c.className || c.id)),
  svgs: document.querySelectorAll('svg').length, imgs: document.images.length,
  videos: [...document.querySelectorAll('video')].map(v => v.currentSrc).slice(0, 8)
})

// 2. Load the main bundle once (replace URL with the largest same-origin script)
window.__src = await (await fetch('/path/to/main.js')).text(); window.__src.length

// 3. Timing system from the bundle
(() => { const t = window.__src; const top = re => { const m = {}; for (const x of t.matchAll(re)) m[x[1]] = (m[x[1]] || 0) + 1; return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 20); };
  return JSON.stringify({ eases: top(/ease:\s*['"`]?([^,}'"`]+)/g), durations: top(/duration:\s*([^,}]+)/g), delays: top(/delay:\s*([^,}]+)/g) }); })()

// 4. Keyword counts (what techniques are used)
(() => { const t = window.__src; const kw = ['ScrollTrigger', 'onScroll', 'useScroll', 'whileInView', 'animation-timeline', 'view-timeline', 'startViewTransition', 'ViewTransition', 'spring', 'layoutId', 'drag', 'stagger', 'IntersectionObserver', 'requestAnimationFrame', 'WebGLRenderer', 'ShaderMaterial', 'splitText', 'SplitText', 'lenis', 'mousemove', 'pointermove'];
  return JSON.stringify(Object.fromEntries(kw.map(k => [k, t.split(k).length - 1]))); })()

// 5. Context around a keyword
(() => { const t = window.__src, k = 'onScroll', out = []; let i = 0; while (out.length < 3 && (i = t.indexOf(k, i)) > -1) { out.push(t.slice(Math.max(0, i - 150), i + 350)); i += k.length; } return out.join('\n----\n'); })()

// 6. CSS: keyframes, transitions, scroll timelines, reduced motion
(() => { const kf = new Set(), tr = {}; let tl = 0, rm = 0;
  for (const ss of document.styleSheets) { let r; try { r = ss.cssRules } catch (e) { continue }
    const walk = rs => { for (const x of rs) {
      if (x.type === 7) kf.add(x.name);
      if (x.conditionText && /reduce/.test(x.conditionText)) rm++;
      if (x.style) { if (x.style.transition) tr[x.style.transition.slice(0, 70)] = (tr[x.style.transition.slice(0, 70)] || 0) + 1;
        if (x.style.animationTimeline || x.style.viewTimelineName) tl++; }
      if (x.cssRules && x.type !== 7) walk(x.cssRules); } }; walk(r); }
  return JSON.stringify({ keyframes: [...kf].slice(0, 50), transitions: Object.entries(tr).sort((a, b) => b[1] - a[1]).slice(0, 12), scrollTimelineRules: tl, reducedMotionBlocks: rm }); })()

// 7. Running CSS/WAAPI animations right now
JSON.stringify(document.getAnimations().slice(0, 30).map(a => { const t = a.effect?.getTiming?.() || {}; const el = a.effect?.target;
  return { name: a.animationName || a.transitionProperty || '', dur: t.duration, ease: t.easing, iter: t.iterations, el: el ? el.tagName + '.' + String(el.className?.baseVal ?? el.className).slice(0, 30) : '' }; }))

// 8. JS weight actually transferred
(() => { const r = performance.getEntriesByType('resource').filter(e => e.initiatorType === 'script');
  return JSON.stringify({ scripts: r.length, kb: Math.round(r.reduce((s, e) => s + (e.transferSize || 0), 0) / 1024) }); })()
