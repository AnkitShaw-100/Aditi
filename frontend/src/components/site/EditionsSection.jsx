import { EDITION_STATS } from "@/data/siteContent";

export default function EditionsSection() {
  return (
    <section
      id="editions"
      className="editions-section border-t border-steel/40 scroll-mt-20"
    >
      <div className="editions-shell mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
        <div className="editions-intro mx-auto max-w-2xl text-center">
          <p className="font-plex text-xs font-medium uppercase tracking-[0.18em] text-ember">
            Publishing Model
          </p>
          <h2 className="mt-3 font-rajdhani text-[clamp(1.9rem,5vw,3.2rem)] font-bold leading-[0.98] text-chalk">
            Depth on a deliberate rhythm.
          </h2>
          <p className="mt-4 font-plex text-sm font-light leading-[1.8] text-ash">
            ADITI is structured for readers who want finished arguments — not feeds, not hot takes.
          </p>
        </div>

        <div className="editions-grid mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
          {EDITION_STATS.map((stat) => (
            <article key={stat.label} className="edition-glass-card">
              <div className="edition-glass-card__value font-rajdhani font-bold leading-none text-chalk">
                {stat.prefix ? (
                  <span className="edition-glass-card__prefix">{stat.prefix}</span>
                ) : null}
                <span>{stat.value}</span>
              </div>
              <p className="edition-glass-card__label mt-4 font-plex text-[0.68rem] font-medium uppercase tracking-[0.2em] text-ember">
                {stat.label}
              </p>
              <h3 className="edition-glass-card__tagline mt-2 font-rajdhani text-[1.35rem] font-bold leading-tight text-chalk">
                {stat.tagline}
              </h3>
              <p className="edition-glass-card__copy mt-3 font-plex text-sm font-light leading-[1.7] text-ash">
                {stat.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
