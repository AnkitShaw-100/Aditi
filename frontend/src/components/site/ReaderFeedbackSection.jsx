import { RailCarousel, FeedbackCard } from "@/components/site/shared";
import { READER_FEEDBACKS } from "@/data/siteContent";

export default function ReaderFeedbackSection() {
  return (
    <section
      id="feedback"
      className="feedback-section border-t border-steel bg-void px-4 py-16 scroll-mt-20 md:px-8 md:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <p className="font-plex text-xs font-medium uppercase tracking-[0.18em] text-ember">
          Customer Testimonials
        </p>
        <h2 className="mt-3 max-w-3xl font-rajdhani text-[clamp(2rem,6vw,3.9rem)] font-bold leading-[0.98] text-chalk">
          What readers say after spending time with the brand.
        </h2>
        <p className="mt-4 max-w-2xl font-plex text-sm font-light leading-[1.8] text-ash">
          Short reflections from readers, analysts, and subscribers who trust ADITI for depth, structure, and clarity.
        </p>

        <RailCarousel
          items={READER_FEEDBACKS}
          desktopPageSize={3}
          ariaLabel="Reader feedback carousel"
          trackClassName="feedback-track"
          itemClassName="basis-full md:basis-[calc((100%-2rem)/3)] flex"
          controlsClassName="flex"
          renderItem={(feedback) => <FeedbackCard feedback={feedback} />}
        />
      </div>
    </section>
  );
}
