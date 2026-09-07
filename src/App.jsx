import { useState } from "react";
import { useHashRoute } from "./hooks/useHashRoute";
import { SplashScreen } from "./components/layout/SplashScreen";
import { LenisProvider } from "./components/providers/LenisProvider";
import { Atmosphere } from "./components/layout/Atmosphere";
import { SiteHeader } from "./components/layout/SiteHeader";
import { SiteFooter } from "./components/layout/SiteFooter";
import { CustomCursor } from "./components/ui/CustomCursor";
import { NoiseOverlay } from "./components/ui/NoiseOverlay";
import { HomeHero } from "./components/sections/HomeHero";
import { CinematicHero } from "./components/sections/CinematicHero";
import { Gallery } from "./components/sections/Gallery";
import { DetailsSection } from "./components/sections/DetailsSection";
import { VenueSection } from "./components/sections/VenueSection";
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
  const route = useHashRoute();
  /* Gates the hero's entrance. Without it the book and the copy would
     slide in behind the splash and be finished before it lifts. */
  const [ready, setReady] = useState(false);

  /* The legal pages are each their own view: no atmosphere, no header,
     and no Lenis smoothing fighting a form. */
  const RouteView = ROUTES[route];
  if (RouteView) return <RouteView />;

  return (
    <LenisProvider>
      {/* The load screen. It removes itself once its own timeline has
          finished; `onReady` fires a beat earlier, as it starts to
          lift, so the hero is already moving underneath. */}
      <SplashScreen onDone={() => setReady(true)} />

      <Atmosphere />
      <CustomCursor />
      <NoiseOverlay />

      <SiteHeader />

      {/* HomeHero is the opening screen; CinematicHero is the scrolled
          photo film that follows it. There was a pinned "temple gate"
          ahead of both — split doors, a mark that grew out of the light
          and flew into the header — removed by request. */}
      <main id="top" className="relative" style={{ zIndex: "var(--z-content)" }}>
        <HomeHero start={ready} />
        <CinematicHero />
        <Gallery />
        <DetailsSection />
        <VenueSection />
      </main>

      <SiteFooter />
    </LenisProvider>
  );
}
