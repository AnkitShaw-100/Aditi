import SiteHeader from "@/components/site/Header";
import HeroSection from "@/components/site/HeroSection";
import MissionSection from "@/components/site/MissionSection";
import BrandSection from "@/components/site/BrandSection";
import AuthorsSection from "@/components/site/AuthorsSection";
import ShowcaseStrip from "@/components/site/ShowcaseStrip";
import FrameworkSection from "@/components/site/FrameworkSection";
import DispatchesSection from "@/components/site/DispatchesSection";
import EditionsSection from "@/components/site/EditionsSection";
import OjasSection from "@/components/site/OjasSection";
import FaqSection from "@/components/site/FaqSection";
import ReaderFeedbackSection from "@/components/site/ReaderFeedbackSection";
import SiteFooter from "@/components/site/SiteFooter";
import { RadarCursor } from "@/components/site/shared";

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-void text-chalk">
      <RadarCursor />
      <SiteHeader />

      <main>
        <HeroSection />
        <MissionSection />
        <BrandSection />
        <AuthorsSection />
        <ShowcaseStrip />
        <FrameworkSection />
        <DispatchesSection />
        <EditionsSection />
        <OjasSection />
        <FaqSection />
        <ReaderFeedbackSection />
      </main>

      <SiteFooter />
    </div>
  );
}

export default App;
