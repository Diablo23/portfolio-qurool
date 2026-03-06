# qurool's portfolio

Pixel-aesthetic portfolio website with animated loading sequence and continuous scrollable main page.

## Structure

```
portfolio/
├── frontend/
│   ├── index.html    — Main HTML (intro + main page)
│   ├── styles.css    — All styles (PP NeueBit font, pixel theme)
│   └── app.js        — Animations, loading, pixel burst, scroll, counters
├── backend/
│   └── server.js     — Node.js static file server
├── assets/
│   ├── PPNeueBit-Bold.woff2      ← Add your font files
│   ├── PPNeueBit-Regular.woff2
│   └── 1.png … 30.png            ← Add partner logos
└── README.md
```

## Quick Start

1. **Add font files** → place PP NeueBit font files in `assets/`
2. **Add partner logos** → name them `1.png` through `30.png` in `assets/`
3. **Run**: `node backend/server.js`
4. **Open**: http://localhost:3000

## Flow

Loading bar → "Loading Completed" → "Welcome to qurool's portfolio" → pixel burst dissolve → main page

## Main Page Sections

1. Stats (animated counters)
2. Lead positions (card grid)
3. Partners (30 logo grid — 10×3)
4. Main skills
5. Contact me (X / discord / telegram / mail)

## Customize

- **Contact links**: edit `href` attributes in Section 5 of `index.html`
- **Pixel rain intensity**: change `opacity` on `#pixelRain` in `styles.css`
- **Timing**: adjust delays in `app.js` (loading speed, welcome duration, etc.)
