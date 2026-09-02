import { useRef } from "react";
import { useHashRoute } from "./hooks/useHashRoute";
import { LenisProvider } from "./components/providers/LenisProvider";
import { Atmosphere } from "./components/layout/Atmosphere";
import { SiteHeader } from "./components/layout/SiteHeader";
import { SiteFooter } from "./components/layout/SiteFooter";
import { FlyingEmblem } from "./components/layout/FlyingEmblem";
import { CustomCursor } from "./components/ui/CustomCursor";
import { NoiseOverlay } from "./components/ui/NoiseOverlay";
import { TempleGate } from "./components/sections/TempleGate";
import { CinematicHero } from "./components/sections/CinematicHero";
import { Gallery } from "./components/sections/Gallery";
import { DetailsSection } from "./components/sections/DetailsSection";
import { TermsPage } from "./components/legal/TermsPage";
import { PrivacyPage } from "./components/legal/PrivacyPage";
import { DataDeletionPage } from "./components/legal/DataDeletionPage";
import { PrivacyChoicesPage } from "./components/legal/PrivacyChoicesPage";

const ROUTES = {
  terms: TermsPage,
  privacy: PrivacyPage,
  "data-deletion": DataDeletionPage,
  "privacy-choices": PrivacyChoicesPage,
};

export default function App() {
  /* The emblem is shared: the gate scales it up as the doors open,
     then FlyingEmblem docks it into the header slot. */
  const emblemRef = useRef(null);
  const headerSlotRef = useRef(null);
  const route = useHashRoute();

  /* The legal pages are each their own view: no gate animation, no
     flying emblem, no Lenis smoothing fighting a form. */
  const RouteView = ROUTES[route];
  if (RouteView) return <RouteView />;

  return (
    <LenisProvider>
      <Atmosphere />
      <CustomCursor />
      <NoiseOverlay />

      <SiteHeader slotRef={headerSlotRef} />

      {/* FlyingEmblem must mount before TempleGate so its ref (emblemRef,
          attached inside it) exists by the time TempleGate's own effect
          reads .current to build the grow tween. It defers creating its
          OWN #gate-based dock trigger by a frame (see inside it) so that
          happens after TempleGate's pin exists — GSAP accumulates a
          pinned element's added scroll distance in ScrollTrigger creation
          order, so a same-element trigger created before the pin would
          never account for it. */}
      <FlyingEmblem emblemRef={emblemRef} slotRef={headerSlotRef} gateSelector="#gate" />

      <main id="top" className="relative" style={{ zIndex: "var(--z-content)" }}>
        <TempleGate emblemRef={emblemRef} />
        <CinematicHero />
        <Gallery />
        <DetailsSection />
      </main>

      <SiteFooter />
    </LenisProvider>
  );
}
