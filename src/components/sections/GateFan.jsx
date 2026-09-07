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
      {/* Blinds fills whatever box it is given, so the height here is
          what actually sizes the cards. The emblem no longer sits in
          the middle of the gate on a phone, so the fan gets the room
          it was competing for — this is roughly triple the band it
          started as. Still clamped rather than a flat svh: at 52% of a
          short phone the hand would crowd the tagline, and on a tall
          one it would outgrow the screen's width. */}
      <div className="pointer-events-auto w-full" style={{ height: "clamp(280px, 52svh, 460px)" }}>
        <Blinds
          items={shots.map((s) => ({ title: s.title, image: s.file }))}
          mode="fan"
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
