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
import { PrivacyChoicesPage } from "./components/legal/PrivacyChoicesPage";

const ROUTES = {
  terms: TermsPage,
  "privacy-choices": PrivacyChoicesPage,
};

export default function App() {
  const route = useHashRoute();
  
  const [ready, setReady] = useState(false);

  
  const RouteView = ROUTES[route];
  if (RouteView) return <RouteView />;

  return (
    <LenisProvider>
      
      <SplashScreen onDone={() => setReady(true)} />

      <Atmosphere />
      <CustomCursor />
      <NoiseOverlay />

      <SiteHeader />

      
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
