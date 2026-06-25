import { ArrowRight } from "lucide-react";

import ojasImage from "../../../media/ojas.png";
import { OJAS_PANELS } from "@/data/siteContent";

export default function OjasSection() {
  return (
    <section id="credentials" className="ojas-hero scroll-mt-20">
      <div className="ojas-hero__media">
        <img className="ojas-hero__bg" src={ojasImage} alt="" aria-hidden="true" />
        <div className="ojas-hero__scrim" aria-hidden="true" />

        <div className="ojas-hero__content">
          <header className="ojas-hero__head">
            <p className="ojas-hero__kicker font-plex text-xs font-medium uppercase tracking-[0.2em] text-ember">
              OJAS Forum
            </p>
            <h2 className="ojas-hero__title mt-4 font-rajdhani text-[clamp(2.4rem,7vw,5.5rem)] font-bold leading-[0.92] text-black ">
              OJAS{" "}
              <span className="font-plex text-[0.52em] font-medium text-ember/90">
                {"\u0913\u091c\u0938\u094d"}
              </span>
            </h2>
            <p className="ojas-hero__subtitle mt-3 font-plex text-[clamp(0.95rem,1.6vw,1.15rem)] font-semibold uppercase tracking-[0.24em] text-black">
              Geopolitics &amp; Defence Forum
            </p>
            <p className="ojas-hero__lede mt-6 max-w-3xl font-plex text-[clamp(1rem,1.55vw,1.15rem)] font-medium leading-[1.9] text-black">
              Strategy is not only written. It is argued, contested, and refined through discourse.
              OJAS is ADITI&apos;s annual intellectual forum - serious, multi-disciplinary thinking
              anchored in India&apos;s heritage and its contemporary moment.
            </p>
            <h3 className="ojas-hero__heading mt-5 font-rajdhani text-[clamp(1.6rem,3.5vw,2.75rem)] font-bold leading-tight text-black">
              Rethinking Strategy for India&apos;s Future.
            </h3>
          </header>

          <div className="ojas-hero__stage">
            {OJAS_PANELS.map((panel, index) => (
              <article
                key={panel.id}
                className={`ojas-panel ojas-panel--${index === 0 ? "left" : "right"}${
                  panel.accent ? " ojas-panel--accent" : ""
                }`}
              >
                <p className="ojas-panel__index font-plex text-[0.68rem] font-medium uppercase tracking-[0.2em] text-ember">
                  {panel.index} / {panel.label}
                </p>
                <h4 className="ojas-panel__headline mt-3 font-rajdhani text-[clamp(1.35rem,2.2vw,1.85rem)] font-bold leading-tight text-chalk">
                  {panel.headline}
                </h4>
                <p className="ojas-panel__copy mt-3 font-plex text-[clamp(0.95rem,1.25vw,1rem)] font-medium leading-[1.85] text-ash">
                  {panel.copy}
                </p>
                {panel.accent ? (
                  <a
                    href="#credentials"
                    className="ojas-panel__cta mt-5 inline-flex items-center gap-2 font-rajdhani text-base font-bold text-ember transition hover:text-chalk"
                  >
                    {panel.detail}
                    <ArrowRight className="size-4" />
                  </a>
                ) : (
                  <p className="ojas-panel__detail mt-4 font-plex text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-fog">
                    {panel.detail}
                  </p>
                )}
              </article>
            ))}
          </div>

          <div className="ojas-hero__footer">
            <a
              href="#read"
              className="ojas-hero__cta inline-flex items-center gap-2 rounded-full border border-[#5d5920]/30 bg-[#5d5920] px-8 py-4 font-rajdhani text-[0.98rem] font-bold uppercase tracking-[0.18em] text-[#fff7df] transition hover:-translate-y-0.5 hover:bg-[#6d6724]"
            >
              Learn about OJAS 2026
              <ArrowRight className="size-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
