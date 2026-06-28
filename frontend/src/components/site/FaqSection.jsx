import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import DotField from "@/components/ui/dot-field";
import { FaqItem } from "@/components/site/shared";
import { FAQ_ITEMS } from "@/data/siteContent";

export default function FaqSection() {
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === "undefined" ? 1280 : window.innerWidth
  );

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isCompact = viewportWidth < 768;
  const isMedium = viewportWidth < 1100;
  const dotExclusionPadding = useMemo(
    () => ({
      top: isCompact ? 10 : 14,
      right: isCompact ? 12 : isMedium ? 20 : 28,
      bottom: isCompact ? 18 : 32,
      left: isCompact ? 12 : isMedium ? 20 : 28,
    }),
    [isCompact, isMedium]
  );

  return (
    <section
      id="faq"
      data-dot-exclusion-root
      className="faq-section border-t border-steel bg-void px-4 py-16 scroll-mt-20 md:px-8 md:py-24"
    >
      <div className="faq-dot-field-shell" aria-hidden="true">
        <DotField
          className="faq-dot-field"
          dotRadius={isCompact ? 2 : isMedium ? 2.3 : 2.8}
          dotSpacing={isCompact ? 14 : isMedium ? 13 : 12}
          cursorRadius={isCompact ? 92 : isMedium ? 120 : 150}
          cursorForce={isCompact ? 0.06 : 0.1}
          bulgeOnly
          bulgeStrength={isCompact ? 38 : isMedium ? 52 : 67}
          sparkle={false}
          waveAmplitude={0}
          gradientFrom="rgba(201, 154, 74, 0.98)"
          gradientTo="rgba(201, 154, 74, 0.74)"
          exclusionSelector=".faq-content"
          exclusionPadding={dotExclusionPadding}
        />
      </div>
      <div className="faq-content mx-auto max-w-4xl">
        <p className="font-plex text-xs font-medium uppercase tracking-[0.18em] text-ember">
          FAQ
        </p>
        <h2 className="mt-3 font-rajdhani text-[clamp(1.8rem,6vw,3rem)] font-bold leading-[1.1] text-chalk">
          Clear terms. Direct access.
        </h2>

        <div className="mt-8 grid gap-3">
          {FAQ_ITEMS.map((item) => (
            <FaqItem key={item.question} item={item} />
          ))}
        </div>

        <div className="faq-final-cta">
          <Button
            asChild
            className="final-button inline-flex h-11 rounded-none px-8 py-4 font-rajdhani text-lg font-bold"
          >
            <a href="#read">
              Browse Dispatches <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
