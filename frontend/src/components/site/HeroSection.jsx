import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { heroVideo } from "@/data/siteContent";

export default function HeroSection() {
  const [isMuted, setIsMuted] = useState(true);
  const heroVideoRef = useRef(null);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) {
      return undefined;
    }

    video.muted = isMuted;
    video.playsInline = true;
    video.defaultMuted = true;

    const playVideo = () => {
      video.play().catch(() => {});
    };

    video.addEventListener("canplay", playVideo, { once: true });
    if (isMuted) {
      playVideo();
    } else {
      video.play().catch(() => {});
    }

    return () => video.removeEventListener("canplay", playVideo);
  }, [isMuted]);

  const toggleVideoSound = () => {
    const video = heroVideoRef.current;
    if (!video) {
      return;
    }

    const nextMuted = !isMuted;
    video.muted = nextMuted;
    video.defaultMuted = nextMuted;

    if (!nextMuted) {
      video.volume = 1;
      video.play().catch(() => {});
    }

    setIsMuted(nextMuted);
  };

  return (
    <section
      id="intro"
      className="hero-media relative min-h-screen overflow-hidden scroll-mt-20"
    >
      <video
        ref={heroVideoRef}
        className="absolute inset-0 z-0 h-screen min-h-screen w-full object-cover opacity-100 saturate-110 contrast-105"
        autoPlay
        muted={isMuted}
        loop
        playsInline
        preload="auto"
        aria-label="ADITI hero video"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 z-10 bg-linear-to-b from-void/5 via-plate/20 to-void/85" />
      <button
        type="button"
        className="absolute bottom-4 right-4 z-[60] grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-void/55 text-chalk backdrop-blur-md transition touch-manipulation hover:border-ember/60 hover:bg-void/75 hover:text-ember focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 sm:bottom-5 sm:right-5 sm:h-12 sm:w-12 md:bottom-6 md:right-6"
        onClick={toggleVideoSound}
        aria-label={isMuted ? "Turn sound on" : "Turn sound off"}
        aria-pressed={!isMuted}
      >
        {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
      </button>
      <div className="hero-panel absolute inset-x-0 bottom-0 z-20">
        <div className="mx-auto max-w-7xl px-5 pb-8 pt-8 sm:px-6 lg:px-10 md:pb-14">
          <div className="max-w-3xl">
            <div className="mt-4 h-px w-12 bg-ember" id="heroRule" />
            <h1 className="mt-5 font-rajdhani text-[clamp(1.8rem,7vw,3.5rem)] font-bold leading-[1.1] text-chalk text-balance">
              For a century,
India was read by others.
            </h1>
            <p className="mt-4 font-plex text-base font-light text-ash">
             This is India,
read by India.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <Button
                asChild
                className="h-12 rounded-full bg-ember px-6 font-rajdhani text-base font-bold text-void hover:bg-[#ddb255]"
              >
                <a href="#read">Read 3 free</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full border border-white/15 bg-white/5 px-6 font-rajdhani text-base font-bold uppercase tracking-[0.14em] text-chalk hover:bg-white/10 hover:text-chalk"
              >
                <a href="#premium-magazine">Own Issue I · ₹350</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <a
        href="#mission"
        className="blink absolute bottom-[8.5rem] left-1/2 z-20 -translate-x-1/2 font-plex text-sm text-ember sm:bottom-4"
        aria-label="Scroll to ADITI introduction"
      >
        &#9660;
      </a>
    </section>
  );
}
