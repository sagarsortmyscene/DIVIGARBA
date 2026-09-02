import { useRef, useState } from "react";
import { useHashRoute } from "./hooks/useHashRoute";
import { SplashScreen } from "./components/layout/SplashScreen";
import { LenisProvider } from "./components/providers/LenisProvider";
import { Atmosphere } from "./components/layout/Atmosphere";
import { SiteHeader } from "./components/layout/SiteHeader";
import { SiteFooter } from "./components/layout/SiteFooter";
import { FlyingEmblem } from "./components/layout/FlyingEmblem";
import { CustomCursor } from "./components/ui/CustomCursor";
import { NoiseOverlay } from "./components/ui/NoiseOverlay";
// import { TempleGate } from "./components/sections/TempleGate";
import { CinematicHero } from "./components/sections/CinematicHero";
import { Gallery } from "./components/sections/Gallery";
import { DetailsSection } from "./components/sections/DetailsSection";
import { BookingPage } from "./components/booking/BookingPage";
import { TermsPage } from "./components/legal/TermsPage";
import { PrivacyPage } from "./components/legal/PrivacyPage";
import { DataDeletionPage } from "./components/legal/DataDeletionPage";
import { PrivacyChoicesPage } from "./components/legal/PrivacyChoicesPage";

const ROUTES = {
  book: BookingPage,
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
  /* The gate scene is currently disabled (see the commented-out
     TempleGate below), so there's no scroll event left to gate the
     header CTA behind — show it immediately. */
  const [gateOpen] = useState(true);
  /* The logo sits centred (behind the splash) until the splash
     finishes, then flies up into the header slot once. */
  const [splashDone, setSplashDone] = useState(false);

  /* Booking and the legal pages are each their own view: no gate
     animation, no flying emblem, no Lenis smoothing fighting a form. */
  const RouteView = ROUTES[route];
  if (RouteView) return <RouteView />;

  return (
    <LenisProvider>
      <SplashScreen onDone={() => setSplashDone(true)} />
      <Atmosphere />
      <CustomCursor />
      <NoiseOverlay />

      <SiteHeader slotRef={headerSlotRef} ctaVisible={gateOpen} />

      {/* With the gate scene disabled there's no "#gate" scroll to fly
          from — instead, the logo sits large and centred (behind the
          splash) and flies up into the header the moment the splash
          finishes, rather than scroll-triggered. */}
      <FlyingEmblem emblemRef={emblemRef} slotRef={headerSlotRef} ready={splashDone} />

      <main id="top" className="relative" style={{ zIndex: "var(--z-content)" }}>
        {/* <TempleGate
          emblemRef={emblemRef}
          onGateOpen={() => setGateOpen(true)}
          onGateClose={() => setGateOpen(false)}
        /> */}
        <CinematicHero />
        <Gallery />
        <DetailsSection />
      </main>

      <SiteFooter />
    </LenisProvider>
  );
}
