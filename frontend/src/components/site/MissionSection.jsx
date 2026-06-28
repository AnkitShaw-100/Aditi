import AuroraGraphic from "@/components/site/AuroraGraphic";

export default function MissionSection() {
  return (
    <section
      id="mission"
      className="mission-section scroll-mt-20"
    >
      <div className="mission-mesh" aria-hidden="true" />
      <div className="mission-glow mission-glow--left" aria-hidden="true" />
      <div className="mission-glow mission-glow--right" aria-hidden="true" />
      <div className="mission-noise" aria-hidden="true" />

      <div className="mission-shell mx-auto max-w-7xl px-4 py-18 md:px-8 md:py-24">
        <div className="mission-copy max-w-5xl">
          <p className="font-plex text-xs font-medium uppercase tracking-[0.18em] text-ember">
            Mission Statement
          </p>
          <p className="mission-word mt-4 font-rajdhani font-bold leading-none text-chalk">
            A.D.I.T.I.
          </p>
          <h2 className="mt-5 max-w-4xl font-rajdhani text-[clamp(1.65rem,4.6vw,3.3rem)] font-bold leading-[1] text-chalk">
            There is a kind of Indian who is no longer content to have their country explained to them. Who wants the argument, not the headline. The reasoning, not the noise.

</h2>
          <p className="mission-subtext mt-5 max-w-3xl font-plex text-[clamp(1rem,1.8vw,1.18rem)] font-light leading-[1.9] text-ash">
            ADITI is India's strategy magazine — one deep argument per issue on the questions shaping Indian power, written by the soldiers, air marshals and scholars who built the doctrine. Issue I is out now.</p>
          <div className="mission-rail mt-8" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="mission-note mt-7 max-w-2xl font-lora text-[1rem] italic leading-relaxed text-fog">
            
            This magazine is for The ADITI Reader

          </p>
        </div>
      </div>

      <div className="mission-aurora" aria-hidden="true">
        <AuroraGraphic
          colorStops={["#202719", "#c99a4a", "#8a713f"]}
          amplitude={0.78}
          blend={0.68}
          speed={0.48}
        />
      </div>
    </section>
  );
}
