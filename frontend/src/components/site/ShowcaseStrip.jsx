import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import HTMLFlipBook from "react-pageflip";

import SectionReveal from "@/components/site/SectionReveal";
import { Button } from "@/components/ui/button";
import { PAGEFLIP_PAGES } from "@/data/siteContent";
import { useIsMobile } from "@/hooks/use-mobile";

function loopPage(page, pageCount) {
  if (pageCount <= 0) {
    return 0;
  }

  return ((page % pageCount) + pageCount) % pageCount;
}

function MobileMagazineViewer({ currentPage, onPageChange, pageCount }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return undefined;
    }

    const pageWidth = track.clientWidth || 1;
    track.scrollTo({
      left: currentPage * pageWidth,
      behavior: "smooth",
    });
    return undefined;
  }, [currentPage]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return undefined;
    }

    let scrollTimeout = 0;

    const updatePageFromScroll = () => {
      window.clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        const pageWidth = track.clientWidth || 1;
        const nextPage = loopPage(Math.round(track.scrollLeft / pageWidth), pageCount);
        onPageChange(nextPage);
      }, 90);
    };

    track.addEventListener("scroll", updatePageFromScroll, { passive: true });
    return () => {
      window.clearTimeout(scrollTimeout);
      track.removeEventListener("scroll", updatePageFromScroll);
    };
  }, [onPageChange, pageCount]);

  return (
    <div className="mobile-magazine-viewer">
      <div className="mobile-magazine-viewer__frame">
        <div
          ref={trackRef}
          className="mobile-magazine-viewer__track"
          aria-label="Swipe through the magazine pages"
        >
          {PAGEFLIP_PAGES.map((page, index) => (
            <article key={`${page.alt}-${index}`} className="mobile-magazine-page">
              <div className="mobile-magazine-page__inner">
                <img
                  src={page.image}
                  alt={page.alt}
                  className="mobile-magazine-page__image"
                  loading={index < 2 ? "eager" : "lazy"}
                  draggable={false}
                />
              </div>
            </article>
          ))}
        </div>

        <div className="mobile-magazine-hint" aria-hidden="true">
          Swipe to turn pages
        </div>
      </div>
    </div>
  );
}

function ReactPageFlipShowcase() {
  const bookRef = useRef(null);
  const stageRef = useRef(null);
  const isMobile = useIsMobile();
  const [stageWidth, setStageWidth] = useState(320);
  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = PAGEFLIP_PAGES.length;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) {
      return undefined;
    }

    const updateWidth = () => {
      const viewportWidth = window.innerWidth || stage.clientWidth;
      setStageWidth(Math.min(stage.clientWidth, viewportWidth));
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(stage);
    window.addEventListener("resize", updateWidth);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const bookWidth =
    stageWidth < 768
      ? Math.min(Math.max(stageWidth - 28, 260), 340)
      : Math.min(Math.max(stageWidth * 0.62, 420), 760);
  const bookHeight = Math.round(bookWidth * 1.28);

  useEffect(() => {
    if (pageCount <= 1) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setCurrentPage((page) => loopPage(page + 1, pageCount));
    }, 3200);

    return () => window.clearInterval(interval);
  }, [pageCount]);

  useEffect(() => {
    if (isMobile) {
      return undefined;
    }

    const flip = bookRef.current?.pageFlip?.();
    if (!flip) {
      return undefined;
    }

    const activePage = flip.getCurrentPageIndex();
    const nextPage = loopPage(currentPage, pageCount);
    if (activePage === nextPage) {
      return undefined;
    }

    const forwardPage = loopPage(activePage + 1, pageCount);
    const backwardPage = loopPage(activePage - 1, pageCount);

    if (nextPage === forwardPage) {
      if (activePage === pageCount - 1 && nextPage === 0) {
        flip.turnToPage(0);
      } else {
        flip.flipNext("bottom");
      }
      return undefined;
    }

    if (nextPage === backwardPage) {
      if (activePage === 0 && nextPage === pageCount - 1) {
        flip.turnToPage(pageCount - 1);
      } else {
        flip.flipPrev("bottom");
      }
      return undefined;
    }

    flip.turnToPage(nextPage);
    return undefined;
  }, [currentPage, isMobile, pageCount]);

  const goPrev = () => {
    setCurrentPage((page) => loopPage(page - 1, pageCount));
  };

  const goNext = () => {
    setCurrentPage((page) => loopPage(page + 1, pageCount));
  };

  const handleFlip = (event) => {
    setCurrentPage(event.data);
  };

  const displayPage = Math.min(currentPage + 1, pageCount);

  return (
    <section
      className="bookflip2-section border-t border-steel px-4 py-16 scroll-mt-20 md:px-8 md:py-24"
      aria-label="ADITI magazine preview"
    >
      <SectionReveal>
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 mx-auto max-w-2xl text-center">
            <p className="font-plex text-xs font-medium uppercase tracking-[0.18em] text-ember">
              Inside the Magazine
            </p>
            <h2 className="mt-3 font-rajdhani text-[clamp(2rem,6vw,4rem)] font-bold leading-[0.95] text-chalk">
              Flip through ADITI&apos;s editorial world.
            </h2>
            <p className="mt-4 mx-auto max-w-lg font-plex text-sm font-light leading-[1.75] text-ash">
              The book opens from the right - drag its corner or use the controls to begin.
            </p>
          </div>

          <div
            ref={stageRef}
            className="pageflip-stage"
            style={{ "--book-w": `${bookWidth}px`, "--book-h": `${bookHeight}px` }}
          >
            <div className="pageflip-shell">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="pageflip-shell__nav pageflip-shell__nav--prev hidden h-11 w-11 shrink-0 rounded-full border-steel/50 bg-bunker/80 text-chalk hover:border-ember/50 hover:bg-plate md:inline-flex"
                aria-label="Previous page"
                onClick={goPrev}
              >
                <ChevronLeft className="size-5" />
              </Button>

              <div className="pageflip-shell__center">
                <div className="pageflip-shell__book-wrap">
                  {isMobile ? (
                    <MobileMagazineViewer
                      currentPage={currentPage}
                      onPageChange={setCurrentPage}
                      pageCount={pageCount}
                    />
                  ) : (
                    <>
                      <div className="pageflip-corner-hint" aria-hidden="true" />

                      <HTMLFlipBook
                        key={`${bookWidth}x${bookHeight}`}
                        ref={bookRef}
                        width={bookWidth}
                        height={bookHeight}
                        size="fixed"
                        minWidth={260}
                        maxWidth={760}
                        minHeight={332}
                        maxHeight={900}
                        showCover={false}
                        drawShadow
                        flippingTime={1100}
                        usePortrait={false}
                        startZIndex={20}
                        autoSize
                        maxShadowOpacity={0.55}
                        mobileScrollSupport
                        swipeDistance={30}
                        clickEventForward
                        useMouseEvents
                        onFlip={handleFlip}
                        className="pageflip-book"
                      >
                        {PAGEFLIP_PAGES.map((page, index) => (
                          <div key={`${page.alt}-${index}`} className="pageflip-page">
                            <div className="pageflip-page-inner">
                              <img
                                src={page.image}
                                alt={page.alt}
                                className="pageflip-page-image"
                                loading={index < 2 ? "eager" : "lazy"}
                                draggable={false}
                              />
                            </div>
                          </div>
                        ))}
                      </HTMLFlipBook>
                    </>
                  )}
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="pageflip-shell__nav pageflip-shell__nav--next hidden h-11 w-11 shrink-0 rounded-full border-steel/50 bg-bunker/80 text-chalk hover:border-ember/50 hover:bg-plate md:inline-flex"
                aria-label="Next page"
                disabled={currentPage >= pageCount - 1}
                onClick={goNext}
              >
                <ChevronRight className="size-5" />
              </Button>
            </div>
          </div>

          <div className="pageflip-footer mt-5 flex flex-col items-center gap-4">
            <div className="pageflip-progress" aria-live="polite">
              <span className="font-plex text-xs uppercase tracking-[0.16em] text-fog">
                Page {displayPage} of {pageCount}
              </span>
              <div className="pageflip-progress-track">
                <div
                  className="pageflip-progress-fill"
                  style={{ width: `${(displayPage / pageCount) * 100}%` }}
                />
              </div>
            </div>

            <div className="pageflip-controls flex items-center justify-center gap-3">
              <Button
                type="button"
                onClick={goPrev}
                variant="outline"
                className="h-11 rounded-full border border-white/15 bg-white/5 px-5 font-plex text-xs uppercase tracking-[0.16em] text-chalk hover:bg-white/10 hover:text-chalk disabled:opacity-40"
              >
                <ArrowRight className="mr-2 size-4 rotate-180" />
                Prev
              </Button>
              <Button
                type="button"
                onClick={goNext}
                className="h-11 rounded-full bg-ember px-5 font-plex text-xs uppercase tracking-[0.16em] text-void hover:bg-[#ddb255] disabled:opacity-40"
              >
                Next
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}

function CurvedLoopBand() {
  return (
    <section
      className="marquee-band overflow-hidden border-y border-steel bg-void py-3"
      aria-label="ADITI themes"
    >
      <div className="marquee-track flex gap-4 font-plex text-xs font-medium uppercase tracking-[0.15em] text-fog">
        <span>
          Strategy <b className="font-medium text-ember">&middot;</b>{" "}
          Sovereignty <b className="font-medium text-ember">&middot;</b>{" "}
          Intelligence <b className="font-medium text-ember">&middot;</b>{" "}
          Doctrine <b className="font-medium text-ember">&middot;</b>{" "}
          Terrain <b className="font-medium text-ember">&middot;</b>{" "}
          Armament <b className="font-medium text-ember">&middot;</b>{" "}
          Initiative <b className="font-medium text-ember">&middot;</b>{" "}
          Proudly Indian <b className="font-medium text-ember">&middot;</b>{" "}
          Rigorously Analytical <b className="font-medium text-ember">&middot;</b>
        </span>
        <span>
          Strategy <b className="font-medium text-ember">&middot;</b>{" "}
          Sovereignty <b className="font-medium text-ember">&middot;</b>{" "}
          Intelligence <b className="font-medium text-ember">&middot;</b>{" "}
          Doctrine <b className="font-medium text-ember">&middot;</b>{" "}
          Terrain <b className="font-medium text-ember">&middot;</b>{" "}
          Armament <b className="font-medium text-ember">&middot;</b>{" "}
          Initiative <b className="font-medium text-ember">&middot;</b>{" "}
          Proudly Indian <b className="font-medium text-ember">&middot;</b>{" "}
          Rigorously Analytical <b className="font-medium text-ember">&middot;</b>
        </span>
      </div>
    </section>
  );
}

export default function ShowcaseStrip() {
  return (
    <>
      <ReactPageFlipShowcase />
      <CurvedLoopBand />
    </>
  );
}
