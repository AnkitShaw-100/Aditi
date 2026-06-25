import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { SignInButton, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { apiRequest } from "@/lib/api";

export function RadarCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const state = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      dotX: window.innerWidth / 2,
      dotY: window.innerHeight / 2,
      radius: 14,
      targetRadius: 14,
      angle: 0,
      hoverCard: false,
      hoverButton: false,
    };

    let frameId = 0;
    const controls = Array.from(document.querySelectorAll("a, button, summary"));
    const cards = Array.from(document.querySelectorAll(".article-card"));

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      state.radius += (state.targetRadius - state.radius) * 0.2;
      state.dotX += (state.x - state.dotX) * 0.14;
      state.dotY += (state.y - state.dotY) * 0.14;

      if (!state.hoverCard) state.angle += 2;

      ctx.save();
      ctx.translate(state.x, state.y);

      ctx.strokeStyle = "#C99A4A";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, state.radius, 0, Math.PI * 2);

      if (state.hoverButton) {
        ctx.fillStyle = "rgba(201, 154, 74, 0.15)";
        ctx.fill();
      }

      ctx.stroke();

      ctx.rotate(((state.hoverCard ? 0 : state.angle) * Math.PI) / 180);
      ctx.strokeStyle = "rgba(201, 154, 74, 0.7)";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -14);
      ctx.stroke();

      ctx.restore();

      if (!state.hoverButton) {
        ctx.fillStyle = "#C99A4A";
        ctx.beginPath();
        ctx.arc(state.dotX, state.dotY, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      frameId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (event) => {
      state.x = event.clientX;
      state.y = event.clientY;
    };

    const handleCardEnter = () => {
      state.hoverCard = true;
      state.targetRadius = 25;
    };

    const handleCardLeave = () => {
      state.hoverCard = false;
      state.targetRadius = 14;
    };

    const handleControlEnter = () => {
      state.hoverButton = true;
    };

    const handleControlLeave = () => {
      state.hoverButton = false;
    };

    document.body.classList.add("cursor-ready");
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    cards.forEach((card) => {
      card.addEventListener("mouseenter", handleCardEnter);
      card.addEventListener("mouseleave", handleCardLeave);
    });

    controls.forEach((control) => {
      control.addEventListener("mouseenter", handleControlEnter);
      control.addEventListener("mouseleave", handleControlLeave);
    });

    resize();
    draw();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cards.forEach((card) => {
        card.removeEventListener("mouseenter", handleCardEnter);
        card.removeEventListener("mouseleave", handleCardLeave);
      });
      controls.forEach((control) => {
        control.removeEventListener("mouseenter", handleControlEnter);
        control.removeEventListener("mouseleave", handleControlLeave);
      });
      document.body.classList.remove("cursor-ready");
    };
  }, []);

  return <canvas ref={canvasRef} id="radarCursor" aria-hidden="true" />;
}

export function RailCarousel({
  items,
  desktopPageSize,
  mobilePageSize = 1,
  ariaLabel,
  trackClassName,
  itemClassName,
  renderItem,
  loop = false,
  loopDuration = 28,
  autoScroll = false,
  autoScrollInterval = 3500,
  controlsClassName = "",
  showArrows = false,
  arrowsClassName = "",
}) {
  const isMobile = useIsMobile();
  const pageSize = isMobile ? mobilePageSize : desktopPageSize;
  const trackRef = useRef(null);
  const itemRefs = useRef([]);
  const [activePage, setActivePage] = useState(0);
  const getItemKey = (item, index) => item.title ?? item.name ?? `item-${index}`;

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const loopItems = loop ? [...items, ...items] : items;

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, items.length);

    const track = trackRef.current;
    if (track && !loop) {
      track.scrollTo({ left: 0, behavior: "auto" });
    }
  }, [items, pageSize, loop]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setActivePage(0));
    return () => cancelAnimationFrame(id);
  }, [items, pageSize, loop]);

  useEffect(() => {
    if (loop) {
      return undefined;
    }

    const track = trackRef.current;
    if (!track || !items.length) {
      return undefined;
    }

    let rafId = 0;

    const updatePage = () => {
      const firstItem = itemRefs.current[0];
      if (!firstItem) {
        return;
      }

      const gap = Number.parseFloat(getComputedStyle(track).gap || "0");
      const step = Math.max(1, firstItem.getBoundingClientRect().width + gap);
      const nextPage = Math.round(track.scrollLeft / (step * pageSize));

      setActivePage(Math.min(pageCount - 1, Math.max(0, nextPage)));
    };

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updatePage);
    };

    updatePage();
    track.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updatePage);

    return () => {
      track.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updatePage);
      cancelAnimationFrame(rafId);
    };
  }, [items.length, pageCount, pageSize, loop]);

  useEffect(() => {
    if (loop || !autoScroll || pageCount <= 1) {
      return undefined;
    }

    const track = trackRef.current;
    if (!track) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      const firstItem = itemRefs.current[0];
      if (!firstItem) {
        return;
      }

      const gap = Number.parseFloat(getComputedStyle(track).gap || "0");
      const step = Math.max(1, firstItem.getBoundingClientRect().width + gap);
      const currentPage = Math.round(track.scrollLeft / (step * pageSize));
      const nextPage = (currentPage + 1) % pageCount;
      const target = itemRefs.current[nextPage * pageSize];

      target?.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
    }, autoScrollInterval);

    return () => window.clearInterval(intervalId);
  }, [autoScroll, autoScrollInterval, pageCount, pageSize, loop]);

  const scrollToPage = (page) => {
    const nextPage = Math.min(pageCount - 1, Math.max(0, page));
    const target = itemRefs.current[nextPage * pageSize];

    if (!loop) {
      setActivePage(nextPage);
    }

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
    }
  };

  const scrollByPage = (direction) => {
    scrollToPage(activePage + direction);
  };

  return (
    <div className="rail-carousel" aria-label={ariaLabel}>
      {showArrows && !loop && pageCount > 1 ? (
        <div className={cn("carousel-arrows", arrowsClassName)}>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="carousel-arrow h-10 w-10 rounded-full border-steel/60 bg-bunker/80 text-chalk hover:border-ember/50 hover:bg-plate hover:text-chalk"
            aria-label={`Previous ${ariaLabel} page`}
            disabled={activePage === 0}
            onClick={() => scrollByPage(-1)}
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="carousel-arrow h-10 w-10 rounded-full border-steel/60 bg-bunker/80 text-chalk hover:border-ember/50 hover:bg-plate hover:text-chalk"
            aria-label={`Next ${ariaLabel} page`}
            disabled={activePage >= pageCount - 1}
            onClick={() => scrollByPage(1)}
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>
      ) : null}
      {loop ? (
        <div
          ref={trackRef}
          className="dispatch-loop-track"
          style={{ "--carousel-loop-duration": `${loopDuration}s` }}
        >
          <div className="dispatch-loop-group">
            {loopItems.map((item, index) => (
              <div
                key={`${getItemKey(item, index)}-loop-a-${index}`}
                className={cn("shrink-0 snap-start", itemClassName)}
              >
                {renderItem(item, index % items.length)}
              </div>
            ))}
          </div>
          <div className="dispatch-loop-group" aria-hidden="true">
            {loopItems.map((item, index) => (
              <div
                key={`${getItemKey(item, index)}-loop-b-${index}`}
                className={cn("shrink-0 snap-start", itemClassName)}
              >
                {renderItem(item, index % items.length)}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div
            ref={trackRef}
            className={cn(
              "dispatch-track flex items-start gap-5 overflow-x-auto scroll-smooth pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden",
              trackClassName
            )}
          >
            {items.map((item, index) => (
              <div
                key={getItemKey(item, index)}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                className={cn("shrink-0 snap-start", itemClassName)}
              >
                {renderItem(item, index)}
              </div>
            ))}
          </div>
          <div
            className={cn("carousel-dots", controlsClassName)}
            aria-label={`${ariaLabel} pages`}
          >
            {Array.from({ length: pageCount }).map((_, index) => (
              <button
                key={`${ariaLabel}-dot-${index}`}
                type="button"
                aria-label={`Go to ${ariaLabel} page ${index + 1}`}
                className={cn("carousel-dot", index === activePage && "active")}
                onClick={() => scrollToPage(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function AuthorCard({ author }) {
  return (
    <Card className="authors-card flex h-full overflow-hidden rounded-xl border border-steel/70 bg-[linear-gradient(180deg,rgba(22,27,20,0.98),rgba(9,11,8,0.98))] p-0 shadow-none transition duration-300 hover:-translate-y-0.5 hover:border-ember/40">
      <div className="border-b border-steel/60 px-5 py-5">
        <div className="authors-card-head flex items-center gap-4">
          <img
            src={author.image}
            alt={`Portrait of ${author.name}`}
            className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-full object-cover ring-2 ring-ember/30"
            loading="lazy"
          />
          <div className="authors-card-identity">
            <p className="font-plex text-[0.68rem] font-medium uppercase tracking-[0.2em] text-ember">
              {author.rank}
            </p>
            <h3 className="authors-card-name mt-2 font-rajdhani text-xl font-bold leading-tight text-chalk">
              {author.name}
            </h3>
          </div>
        </div>
      </div>

      <div className="authors-card-body px-5 py-5">
        <p className="font-plex text-[0.7rem] font-medium uppercase tracking-[0.18em] text-fog">
          Highlighted Expertise
        </p>
        <p className="authors-card-specialty mt-2 font-lora text-base italic leading-relaxed text-ash">
          {author.specialty}
        </p>
        <p className="authors-card-summary mt-4 font-plex text-sm font-light leading-[1.8] text-fog">
          {author.summary}
        </p>
      </div>
    </Card>
  );
}

export function ArticleCard({ article }) {
  const isPremium = article.type === "premium";

  return (
    <Card
      role="link"
      tabIndex={0}
      aria-label={article.ariaLabel}
      className="article-card mx-auto w-full max-w-[30rem] overflow-hidden rounded-xl border border-steel/80 bg-bunker p-0 py-0 ring-0 transition-all duration-300 hover:-translate-y-1 hover:border-ember/60 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)] focus-visible:border-ember focus-visible:outline-none"
      onClick={(event) => {
        if (event.target.closest("a, button")) {
          return;
        }
        window.location.href = article.href;
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          window.location.href = article.href;
        }
      }}
    >
      <div className="relative h-[11.25rem] md:h-[13.75rem]">
        <img
          className="h-full w-full object-cover"
          src={article.image}
          alt={article.tag}
          loading="lazy"
        />
        <span className="absolute bottom-3 left-3 rounded-sm bg-void/75 px-2 py-0.75 font-plex text-xs font-medium uppercase text-ember">
          {article.tag}
        </span>
      </div>
      <div className="p-4">
        <h3 className="article-title font-rajdhani text-[1.15rem] font-bold leading-tight text-chalk">
          {article.title}
        </h3>
        <p className="article-teaser mt-3 font-lora text-[0.88rem] leading-[1.65] text-ash">
          {article.teaser}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="font-plex text-xs font-light text-fog">
            {article.readTime}
          </span>
          <span className="flex items-center gap-3">
            <b className="font-plex text-xs font-light text-fog">
              {article.priceLabel}
            </b>
            {isPremium ? (
              <AddToCartButton article={article} />
            ) : (
              <Button
                asChild
                variant="ghost"
                className="inline-flex min-h-11 items-center py-3 font-plex text-sm font-medium text-ember hover:bg-transparent hover:text-chalk"
              >
                <a href={article.href} onClick={(event) => event.stopPropagation()}>
                  {article.cta} <ArrowRight className="size-4" />
                </a>
              </Button>
            )}
          </span>
        </div>
      </div>
    </Card>
  );
}

function AddToCartButton({ article }) {
  const { getToken, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle");

  async function addToCart(event) {
    event.stopPropagation();
    setStatus("adding");

    try {
      await apiRequest(getToken, "/api/cart", {
        method: "POST",
        body: JSON.stringify({ magazine_slug: article.slug }),
      });
      setStatus("idle");
      navigate("/checkout");
    } catch (error) {
      setStatus("error");
      window.alert(error.message);
    }
  }

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal" forceRedirectUrl="/checkout">
        <Button
          type="button"
          variant="ghost"
          className="inline-flex min-h-11 items-center py-3 font-plex text-sm font-medium text-ember hover:bg-transparent hover:text-chalk"
          onClick={(event) => event.stopPropagation()}
        >
          {article.cta} <ArrowRight className="size-4" />
        </Button>
      </SignInButton>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      disabled={status === "adding"}
      className="inline-flex min-h-11 items-center py-3 font-plex text-sm font-medium text-ember hover:bg-transparent hover:text-chalk"
      onClick={addToCart}
    >
      {status === "adding" ? "Adding" : "Add"} <ArrowRight className="size-4" />
    </Button>
  );
}

export function FeedbackCard({ feedback }) {
  return (
    <Card className="feedback-card h-full overflow-hidden border-0 bg-transparent p-0 py-0 shadow-none ring-0">
      <div className="p-1 md:p-2">
        <p className="font-plex text-xs font-medium uppercase tracking-[0.18em] text-ember">
          {feedback.category}
        </p>
        <p className="feedback-quote font-lora italic">"{feedback.quote}"</p>
        <div className="feedback-meta">
          <img
            className="h-14 w-14 rounded-full object-cover"
            src={feedback.image}
            alt={`Portrait of ${feedback.name}`}
            loading="lazy"
          />
          <div>
            <h3 className="font-rajdhani text-xl font-semibold text-chalk">
              {feedback.name}
            </h3>
            <p className="font-plex text-xs font-light text-ash">
              {feedback.role}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  useEffect(() => {
    if (open && contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
      return;
    }

    setMaxHeight("0px");
  }, [open, item.answer]);

  return (
    <details className="faq-item border-b border-steel" open={open}>
      <summary
        className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-5 py-4 font-rajdhani text-[1.05rem] font-semibold text-chalk"
        onClick={(event) => {
          event.preventDefault();
          setOpen((value) => !value);
        }}
      >
        {item.question}
        <span className="faq-icon text-ember">
          {open ? <Minus className="size-4" /> : <Plus className="size-4" />}
        </span>
      </summary>
      <div className="faq-answer" style={{ maxHeight }}>
        <p
          ref={contentRef}
          className="pb-4 font-plex text-sm font-light leading-[1.7] text-ash"
        >
          {item.answer}
        </p>
      </div>
    </details>
  );
}
