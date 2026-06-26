import HeroSection from "@/components/site/HeroSection";
import MissionSection from "@/components/site/MissionSection";
import BrandSection from "@/components/site/BrandSection";
import AuthorsSection from "@/components/site/AuthorsSection";
import ShowcaseStrip from "@/components/site/ShowcaseStrip";
import FrameworkSection from "@/components/site/FrameworkSection";
import DispatchesSection from "@/components/site/DispatchesSection";
import FaqSection from "@/components/site/FaqSection";
import ReaderFeedbackSection from "@/components/site/ReaderFeedbackSection";
import PurchaseNudgePopup from "@/components/site/PurchaseNudgePopup";

export default function LandingPage() {
  return (
    <>
      <PurchaseNudgePopup />
      <HeroSection />
      <MissionSection />
      <BrandSection />
      <AuthorsSection />
      <ShowcaseStrip />
      <FrameworkSection />
      <DispatchesSection />
      {/* <EditionsSection /> */}
      {/* <OjasSection /> */}
      <FaqSection />
      <ReaderFeedbackSection />
    </>
  );
}
