import { useState } from "react";
import { Blinds } from "feral-blinds";
import "feral-blinds/blinds.css";
import { Lightbox } from "../ui/Lightbox";
import { useReducedMotion } from "../../hooks/useMediaQuery";

/**
 * MOBILE ONLY — the six snapshots that sit scattered around the emblem
 * on desktop, held instead as a hand of cards below it.
 *
 * On a phone there is no room to scatter six photographs around a logo
 * that is already 88vw wide, so they get their own band under it. The
 * fan is a real control: drag sweeps the hand, a tap brings one card to
 * the front, and a second tap on the open card fires `onActivate`.
 *
 * `shots` are GALLERY entries, so each already carries the `n`, `title`
 * and `line` the Lightbox wants — which is why activating a card can
 * just open the same Lightbox the Gallery uses.
 */
export function GateFan({ shots }) {
  const [open, setOpen] = useState(null);
  const reduced = useReducedMotion();

  /* The second tap on an already-open card. Anything could live here —
     navigation, a scroll to the gallery — but these ARE the gallery
     photographs, so the honest action is to show the photograph. */
  const handleActivate = (i) => setOpen(shots[i]);

  return (
    <>
      {/* Height does NOT size these cards on its own — worth knowing
          before reaching for it. Blinds computes a fan card as:

            width  = clamp(min(rootW * 0.21, 216), 100, 260) * cardScale
            height = min(containerHeight * 0.66, width * 1.45)

          On a 390px phone rootW * 0.21 is 82, so the width sits on the
          100px FLOOR — no phone is wide enough to lift it. `cardScale`
          is therefore the size knob; this box only has to stay tall
          enough not to become the cap. At cardScale 2.6 the card wants
          260 x 377, and 0.66 of 600 is 396 — clear of it. At the old
          520 the height would have been clipped back to 343, so this
          went up with the card size rather than staying put. */}
      {/* marginTop pushes the whole hand below the header, so the
          docked logo and the Book ticket button sit clear above it
          rather than being overlapped by the top cards. A margin and
          not a translate: GSAP animates this subtree's `y` on the gate
          timeline and writes `transform` directly, so a transform here
          would be clobbered. 96px clears a mobile header, which is the
          logo slot (clamp 100-120px) plus its py-4 — raise it to drop
          the hand further, lower it to bring the hand back up. */}
      <div className="pointer-events-auto w-full" style={{ height: 600, marginTop: 96 }}>
        <Blinds
          items={shots.map((s) => ({ title: s.title, image: s.file }))}
          mode="fan"
          labelStyle="steady"
          labelPosition="bottom"
          shape="cut"
          /* 200% of 1.3. Card goes 130x188 -> 260x377 on a phone. */
          cardScale={2.6}
          /* Kept as you wrote it, but be aware fan mode applies
             `Math.min(spread, 1.05)` — anything above 1.05 is the same
             as 1.05, so this is already at the ceiling and raising it
             further does nothing. See the note below the component. */
          spread={1.5}
          radius={16}
          gap={0}
          textSize={1.45}
          expandRatio={1.35}
          tuning={{ k: 175, c: 18, lean: 0.3, squeeze: 1 }}
          /* Your 2200 everywhere except under prefers-reduced-motion,
             where the hand does not deal itself — the gate is already
             a moving scene for anyone who asked the OS for less of it. */
          autoPlay={reduced ? false : 2200}
          showIndex={false}
          showBody={false}
          onActivate={handleActivate}
        />
      </div>

      {open && <Lightbox shot={open} onClose={() => setOpen(null)} />}
      {/*
          ON SPREADING THE HAND WIDER — it cannot be done from here.
          The angle between cards is
            fanStep = fanLo / 2.9 * Math.min(spread, 1.05)
          where fanLo comes from a fit loop that widens the arc only
          while the outermost card still lands inside the box. On a
          390px-wide phone that test fails even at the loop's MINIMUM,
          so fanLo stays at its floor and every phone already gets the
          tightest arc the component will draw — roughly 7 degrees a
          card. `spread` is capped at 1.05 on top of that.
          Wider cards make the test fail harder, not the arc narrower
          (it is already floored), so size and spread do not trade off
          here — but neither can spread be bought back. The only real
          lever would be a wider box, which a phone does not have. */}
    </>
  );
}
