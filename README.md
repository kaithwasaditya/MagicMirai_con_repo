# Magical Mirai 2026 Programming Contest Submission

A lyric visualization app built with the TextAlive App API, designed to make Hatsune Miku's songs feel alive on screen.

---

## Selling Point

Most lyric displays show text — this one performs it.

Every character in the active lyric slides in individually with a staggered animation and a three-color neon glow (teal, pink, yellow) cycling across the phrase. The previous and next phrases stay visible in a dimmed state, giving the viewer a sense of lyrical flow rather than isolated snapshots. The result feels closer to a live concert visual than a subtitle track.

The background is a field of colored particles that physically react to the cursor — scatter on hover, attract on click — making the experience tactile even before the music starts. Controls float in a glassmorphism pill at the bottom, keeping the visual space clean and uncluttered.

The loading screen is a depth-perspective "MIKU" text animation — a small detail, but one that sets the tone from the first second.

Built by a Miku fan, for Miku fans.

---

## Features

- **Per-character lyric animation** — each character slides in with a stagger delay and neon glow
- **Three-color cycling** — active phrase characters alternate between teal, pink, and yellow
- **Phrase context** — previous and next phrases shown simultaneously in a muted style
- **Interactive particle background** — 120 particles react to cursor hover (repel) and click (attract)
- **Floating glassmorphism controls** — pill-shaped player bar with blur/transparency effect
- **6 songs** from the Magical Mirai 2026 contest playlist
- **Custom Miku loader** — depth-perspective text animation while songs initialize

---

## Tech Stack

- [TextAlive App API](https://developer.textalive.jp/) — lyric sync and song data
- Vanilla HTML / CSS / JavaScript — no frameworks
- Canvas API — particle background
- Google Fonts — Zen Kaku Gothic New, Bebas Neue

---

## How to Run

1. Clone the repository
2. Open `index.html` in a browser
3. An internet connection is required (TextAlive API + Google Fonts)

> No build step. No dependencies to install.

---

## Controls

| Action | Function |
|---|---|
| ▶ / ⏸ | Play / Pause |
| ⏮ / ⏭ | Previous / Next song |
| Progress bar | Seek |
| Dots | Jump to song |

---

## Credits

- Songs and lyric data provided by [Piapro](https://piapro.jp/) / Crypton Future Media
- TextAlive App API by [Songle](https://songle.jp/)
- Loader animation adapted from [Uiverse.io](https://uiverse.io) by andrew-manzyk
- Built with love for Hatsune Miku 🌊
