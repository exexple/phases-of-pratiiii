# some phases of pratii 🌺

A premium interactive 3D digital experience — a little world made from things worth remembering.

---

## Before You Deploy

You need to supply two things:

### 1. Music
Drop your audio file here:
```
public/audio/black-beauty.mp3
```
The app handles autoplay and fallback gracefully. If the file is missing, the experience still works silently.

### 2. Photos (Polaroids)
Drop your photos here:
```
public/images/pratiksha/
  polaroid-01.jpg
  polaroid-02.jpg
  polaroid-03.jpg
  polaroid-04.jpg
  polaroid-05.jpg
```
Any missing image shows a graceful gradient placeholder. You can add as many as you want — just update `src/data/polaroids.js`.

### 3. Personal Content
Edit the memory texts in:
```
src/data/memories.js    ← the actual words she'll read
src/data/polaroids.js   ← captions for photos
src/data/phases.js      ← phase titles (optional)
```
**These are the only files you need to touch.** Everything else is architecture.

---

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Deployment: GitHub → Vercel

### Step 1 — Push to GitHub
```bash
git add .
git commit -m "some phases of pratii"
git push origin main
```

### Step 2 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your `phases-of-pratiiii` repository
3. Vercel auto-detects **Vite** — no configuration needed
4. Click **Deploy**
5. Done. ✓

The `vercel.json` file already handles SPA routing.

---

## Architecture

```
src/
  data/           ← EDIT THESE for personal content
    memories.js
    polaroids.js
    phases.js
    music.js

  scenes/         ← The 4 scenes
    MainWorld.jsx   (3D room)
    SkyScene.jsx    (constellation)
    FinalScene.jsx  (PRATIKSHA)

  components/
    World/          (Room, Lighting, Camera, Atmosphere)
    Objects/        (Desk, Drawer, Bookshelf, Headphones, Window, Flower...)
    UI/             (Memory, Polaroid, Music, Phase labels...)
    Constellation/  (Stars, puzzle logic)
    Particles/      (PRATIKSHA formation)

  hooks/
    useAudio.js
    useDiscovery.js
    useDeviceQuality.js

  utils/
    constellation.js   ← P-shape star coordinates
    particleText.js    ← PRATIKSHA canvas sampling
```

---

## The Experience Flow

```
Dark screen → "some phases of pratii 🌺" → enter
  ↓
3D world reveals. Music fades in.
  ↓
Explore: tap objects → discover memories → find Polaroids
  ↓
After 7+ discoveries: "there's one more thing for you. look up."
  ↓
Tap the window → night sky
  ↓
"some things only make sense when you connect them."
  ↓
Connect the stars → P shape forms
  ↓
Stars detach → travel → PRATIKSHA assembles from particles
  ↓
"maybe the little things weren't so little after all."
```

---

## Performance Notes

- **High-end devices**: Full postprocessing (Bloom + Vignette), 80 dust motes, shadows
- **Mid-range**: Bloom + Vignette, 55 motes, shadows
- **Low-end / reduced-motion**: No postprocessing, 30 motes, no particle animations
- DPR capped at 2x on high, 1.5x on mid

---

Built with React + Vite + Three.js + React Three Fiber + GSAP + Framer Motion + Howler.js + Zustand.