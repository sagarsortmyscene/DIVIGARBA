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
      {/* Height alone does NOT size these cards, which is worth knowing
          before reaching for it. Blinds computes a fan card as:

            width  = clamp(min(rootW * 0.21, 216), 100, 260) * cardScale
            height = min(containerHeight * 0.66, width * 1.45)

          On a 390px-wide phone rootW * 0.21 is 82, so the width lands
          on the 100px FLOOR — no phone is wide enough to raise it, and
          the height is then capped at 100 * 1.45 = 145px regardless of
          how tall this box is. Past roughly 220px the container stopped
          mattering entirely.

          So the size knob is `cardScale` below; the height here only
          has to be tall enough not to become the cap again. At
          cardScale 2 the card wants 290px, and 0.66 of this box clears
          that on any phone taller than ~700px. */}
      <div className="pointer-events-auto w-full" style={{ height: "clamp(340px, 62svh, 560px)" }}>
        <Blinds
          items={shots.map((s) => ({ title: s.title, image: s.file }))}
          mode="fan"
          /* 200% of the previous size: 100x145 -> 200x290 on a phone.
             This is the multiplier to change if you want them bigger
             again — 2.5 gives 250x362, and past that a card is wider
             than half a 390px screen and the hand starts to overrun
             the edges. */
          cardScale={2}
          labelStyle="steady"
          labelPosition="bottom"
          radius={16}
          gap={0}
          textSize={1.05}
          expandRatio={1.35}
          tuning={{ k: 150, c: 18, lean: 0.3, squeeze: 1 }}
          /* No self-playing card shuffle for anyone who asked the OS
             for less motion — the gate is already a moving scene. */
          autoPlay={reduced ? false : 3000}
          showIndex={false}
          showBody={false}
          onActivate={handleActivate}
        />
      </div>

      {open && <Lightbox shot={open} onClose={() => setOpen(null)} />}
    </>
  );
}
