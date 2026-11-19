# Plumbing Demo 2: Gus & Co. Plumbing

A toy-style 3D plumber, Gus, walks through the home page and fixes a leak, a clogged drain, a water heater, a faucet and a burst pipe as you scroll.

- Stack: Next.js 16 static export (basePath /demo/plumbing-2), three.js and Tailwind 4.
- Gus and all scenes are procedural three.js in `source/src/components/gus/world.ts`.
- To make the posters, open `/render/?poster=<station>&w=<0-1>` and screenshot the canvas.
