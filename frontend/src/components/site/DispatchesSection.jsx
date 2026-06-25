import { useMemo, useState } from "react";

import { ArticleCard, RailCarousel } from "@/components/site/shared";
import SectionReveal from "@/components/site/SectionReveal";
import { cn } from "@/lib/utils";
import { DISPATCHES, DISPATCH_FILTERS } from "@/data/siteContent";

export default function DispatchesSection() {
  const [dispatchFilter, setDispatchFilter] = useState("all");

  const visibleDispatches = useMemo(
    () =>
      dispatchFilter === "all"
        ? DISPATCHES
        : DISPATCHES.filter((dispatch) => dispatch.type === dispatchFilter),
    [dispatchFilter]
  );

  return (
    <section
      id="read"
      className="read-section px-4 py-16 scroll-mt-20 md:px-8 md:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="md:flex md:items-end md:justify-between">
          <div>
            <p className="font-plex text-xs font-medium uppercase tracking-[0.18em] text-ember">
              Featured Articles
            </p>
            <h2 className="mt-3 font-rajdhani text-[clamp(1.8rem,6vw,3rem)] font-bold leading-[1.1] text-chalk">
              Free and premium articles, structured for serious reading.
            </h2>
            <p className="mt-3 font-plex text-sm font-light text-fog">
              Browse open access pieces or buy individual premium dispatches without a recurring subscription.
            </p>
          </div>

          <div
            className="dispatch-filters mt-7 flex min-h-11 w-full flex-nowrap items-center justify-start gap-5 overflow-x-auto border-b border-steel scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] md:mt-0 md:w-auto md:justify-end md:gap-8 [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Dispatch filters"
          >
            {DISPATCH_FILTERS.map((filter) => (
              <button
                key={filter.value}
                className={cn(
                  "filter-tab min-h-11 shrink-0 border-b-2 px-2 font-plex text-xs font-medium uppercase tracking-[0.08em] sm:tracking-[0.12em]",
                  dispatchFilter === filter.value
                    ? "border-ember text-ember"
                    : "border-transparent text-fog"
                )}
                type="button"
                aria-pressed={dispatchFilter === filter.value}
                onClick={() => setDispatchFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <SectionReveal delay={80}>
        <div className="mt-8">
          <RailCarousel
            items={visibleDispatches}
            desktopPageSize={4}
            ariaLabel="Dispatch article carousel"
            trackClassName="dispatch-track"
            itemClassName="basis-full md:basis-[calc((100%-3.75rem)/4)]"
            renderItem={(article) => <ArticleCard article={article} />}
          />
        </div>
        </SectionReveal>
      </div>
    </section>
  );
}
