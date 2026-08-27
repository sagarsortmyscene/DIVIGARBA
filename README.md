# Shunya Chakra — Navratri garba experience

Vite + React (JavaScript) · Tailwind CSS v4 · GSAP / ScrollTrigger · Lenis

```bash
npm install
npm run dev
```

Photography streams from the Unsplash CDN, so the first run needs a network connection.

---

## The flow

Four sections. Nothing autoplays — scroll drives all of it.

**1. The gate** (`TempleGate`)
One pinned timeline: light builds behind the seam → the carved doors part →
the garbo emblem grows out of the opening (0.12 → full scale) → the Devi is
revealed behind → the tagline lands.

The doors are two halves of **one photograph** of a real Rajasthani carved door.
Each panel holds the full image at `background-size: 200% 100%` and shifts its
`background-position`, so the carving lines up across the seam instead of
looking like two unrelated doors.

**2. The emblem docks** (`FlyingEmblem`)
The emblem lives in a single fixed layer for the whole page. As you scroll past
the gate it flies into the header slot. It **measures the real slot** with
`getBoundingClientRect()` rather than using hardcoded offsets, so it lands
correctly at any viewport and re-measures on resize. The wordmark fades out on
the way — it would be illegible at 40px.

**3. Gallery** (`Gallery`)
Six plates dealt like a hand of cards, fanning out under a pinned scrub.
Numbered 01–06 in mukut gold. On mobile it degrades to a plain vertical stack —
a fan is unreadable at 380px.

**4. The details, then the waitlist**
Your exact copy. The calendar shows **October 2026** with only the ten event
nights selectable; every other day is a real `disabled` button so keyboard users
tab straight past. Picking a night updates the gate-window line beneath it with
that night's actual next-morning date.

## Where to change things

| Want to change | File |
|---|---|
| Dates, times, phone, email, links, organiser | `src/data/event.js` |
| Which nights are selectable | `EVENT_CONFIG.openNights` |
| Any photograph | `src/data/images.js` — swap a `file` id |
| Colours, type scale, z-layers | `src/styles/globals.css` (`@theme`) |
| Reveal timing / easing globally | `src/lib/animations.js` (`T`, `START`) |

## Wiring the form

`WaitlistSection.onSubmit` currently resolves a stub. Replace the marked
`await new Promise(...)` with your POST — validation, the arithmetic check,
the calendar and all UI states already work around it.

## Palette

Mukut gold `#f0c14b` over aged maroon and obsidian, with brass `#a8792c` for
structure. Gold stays rare — it is jewellery, not the default accent.

## Architecture

- **One** Lenis instance, driven off GSAP's ticker — a single RAF loop on the page.
- Every photograph goes through one `<Media>` primitive; responsive srcset defined once.
- One z-index scale in `@theme` (`--z-background` … `--z-loader`). No `z-[9999]`.
- Breakpoints live in `hooks/useMediaQuery.js`, not scattered `window.innerWidth` checks.
- `useGSAP` scopes and reverts every timeline on unmount.
- `prefers-reduced-motion`: Lenis is never constructed, scrubs are skipped, and the
  doors/emblem are set to their final open state — the page still reads, it just doesn't move.
