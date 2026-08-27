import { useRef } from "react";
import { useHashRoute } from "./hooks/useHashRoute";
import { LenisProvider } from "./components/providers/LenisProvider";
import { Atmosphere } from "./components/layout/Atmosphere";
import { SiteHeader } from "./components/layout/SiteHeader";
import { SiteFooter } from "./components/layout/SiteFooter";
import { FlyingEmblem } from "./components/layout/FlyingEmblem";
import { FlyingWordmark } from "./components/layout/FlyingWordmark";
import { CustomCursor } from "./components/ui/CustomCursor";
import { NoiseOverlay } from "./components/ui/NoiseOverlay";
import { TempleGate } from "./components/sections/TempleGate";
import { HomeHero } from "./components/sections/HomeHero";
import { Gallery } from "./components/sections/Gallery";
import { DetailsSection } from "./components/sections/DetailsSection";
import { WaitlistSection } from "./components/sections/WaitlistSection";
import { BookingPage } from "./components/booking/BookingPage";

export default function App() {
  /* The emblem and wordmark are each shared: the gate scales them up
     together as the doors open, then FlyingEmblem/FlyingWordmark dock
     them into the header slots. */
  const emblemRef = useRef(null);
  const wordRef = useRef(null);
  const headerSlotRef = useRef(null);
  const headerWordSlotRef = useRef(null);
  const route = useHashRoute();

  /* Booking is its own view: no gate animation, no flying emblem,
     no Lenis smoothing fighting a form. */
  if (route === "book") return <BookingPage />;

  return (
    <LenisProvider>
      <Atmosphere />
      <CustomCursor />
      <NoiseOverlay />

      <SiteHeader slotRef={headerSlotRef} wordSlotRef={headerWordSlotRef} />

      {/* FlyingEmblem/FlyingWordmark must mount before TempleGate so their
          refs (emblemRef/wordRef, attached inside them) exist by the time
          TempleGate's own effect reads .current to build the grow tweens.
          They defer creating their OWN #gate-based dock triggers by a
          frame (see inside each) so that happens after TempleGate's pin
          exists — GSAP accumulates a pinned element's added scroll
          distance in ScrollTrigger creation order, so a same-element
          trigger created before the pin would never account for it. */}
      <FlyingEmblem emblemRef={emblemRef} slotRef={headerSlotRef} gateSelector="#gate" />
      <FlyingWordmark wordRef={wordRef} slotRef={headerWordSlotRef} gateSelector="#gate" />

      <main id="top" className="relative" style={{ zIndex: "var(--z-content)" }}>
        <TempleGate emblemRef={emblemRef} wordRef={wordRef} />
        <HomeHero />
        <Gallery />
        <DetailsSection />
        <WaitlistSection />
      </main>

      <SiteFooter />
    </LenisProvider>
  );
}
