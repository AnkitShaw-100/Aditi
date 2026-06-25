import { ArrowRight } from "lucide-react";
import brandSectionBg from "../../../media/brand-section-bg.png";

import SectionReveal from "@/components/site/SectionReveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BRAND_STATS } from "@/data/siteContent";

export default function BrandSection() {
  return (
    <section
      id="brand"
      className="steel-field px-5 py-16 scroll-mt-20 md:px-10 md:py-24"
      style={{
        background: `url(${brandSectionBg}) center / cover no-repeat`,
      }}
    >
      <div className="mx-auto max-w-7xl">
        <SectionReveal>
        <div className="brand-grid grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card className="brand-box brand-box--intro brand-card-equal warm-briefing min-h-[360px] gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl">
            <div className="brand-intro-shell flex h-full flex-col justify-between">
              <div>
                <p className="font-plex text-xs font-medium uppercase tracking-[0.18em] text-ember">
                  What is ADITI
                </p>
                <h2 className="mt-4 max-w-[11ch] font-rajdhani text-[clamp(2rem,6.4vw,3.6rem)] font-bold leading-[0.95] text-void text-balance">
                  Strategy of war. Not defence news.
                </h2>
                <p className="brand-intro-text copy-width mt-8 max-w-[34rem] font-plex text-[clamp(0.96rem,1.7vw,1.12rem)] font-light leading-[1.75] text-steel">
                  ADITI studies power where terrain, technology, doctrine and political will collide. It is written for readers who want arguments, not noise.
                </p>
              </div>

              <div className="brand-stats-row brand-stats-row--inside">
                {BRAND_STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className={cn(
                      "brand-stat-item brand-stat-item--glass",
                      stat.tone === "void" && "brand-stat-item--void",
                      stat.tone === "plate" && "brand-stat-item--plate",
                      stat.tone === "ember" && "brand-stat-item--ember"
                    )}
                  >
                    <p className="brand-stat-value font-rajdhani text-[2.5rem] font-bold leading-none tracking-[-0.04em] text-ember md:text-[3rem]">
                      {stat.value}
                    </p>
                    <p className="brand-stat-label font-plex text-[0.62rem] font-medium uppercase tracking-[0.2em] text-steel md:text-[0.72rem]">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <div className="brand-side-layout flex flex-col gap-5">
            <Card className="brand-box brand-box--reading brand-card-equal h-full min-h-[320px] gap-0 overflow-hidden rounded-2xl p-0 shadow-[0_0_45px_rgba(200,133,58,0.16)]">
              <div className="brand-reading-shell flex h-full flex-col justify-between">
                <div>
                  <p className="font-plex text-xs font-medium uppercase tracking-[0.18em] text-chalk">
                    Start Reading
                  </p>
                  <h3 className="reading-card-title mt-6 font-rajdhani font-bold">
                    One dispatch. One complete argument.
                  </h3>
                  <p className="mt-4 font-lora text-[1.02rem] italic leading-relaxed text-chalk">
                    Buy the analysis you need without a subscription.
                  </p>
                  <ul className="reading-card-list">
                    <li>Premium essays at {"\u20B9"}350</li>
                    <li>Open-access primers to preview the method</li>
                    <li>Built for mobile and desktop reading</li>
                  </ul>
                </div>
                <Button
                  asChild
                  className="mt-8 h-12 w-full rounded-full bg-ember px-6 py-3 font-rajdhani text-base font-bold text-void transition hover:bg-[#ddb255] sm:w-fit"
                >
                  <a href="#read">
                    Browse Dispatches <ArrowRight className="size-4" />
                  </a>
                </Button>
              </div>
            </Card>
          </div>
        </div>
        </SectionReveal>
      </div>
    </section>
  );
}
