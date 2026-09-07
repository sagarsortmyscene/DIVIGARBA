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
          enough not to become the cap. At cardScale 1.3 the card wants
          188px and 0.66 of 520 is 343, so it is clear. */}
      <div className="pointer-events-auto w-full" style={{ height: 520 }}>
        <Blinds
          items={shots.map((s) => ({ title: s.title, image: s.file }))}
          mode="fan"
          labelStyle="steady"
          labelPosition="bottom"
          shape="cut"
          cardScale={1.3}
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
    </>
  );
}
