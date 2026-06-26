import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { DISPATCHES } from "@/data/siteContent";

const textFixes = [
  ["â€“", "-"],
  ["â€”", "-"],
  ["â€˜", "'"],
  ["â€™", "'"],
  ["â€œ", '"'],
  ["â€", '"'],
  ["â€¢", "-"],
  ["Ã¢â‚¬â€œ", "-"],
  ["Ã¢â‚¬â€", "-"],
  ["Ã¢â‚¬Ëœ", "'"],
  ["Ã¢â‚¬â„¢", "'"],
  ["Ã¢â‚¬Å“", '"'],
  ["Ã¢â‚¬Â", '"'],
  ["Ã¢â‚¬", '"'],
  ["Ã‚", ""],
  ["ÃƒÂ®", "i"],
  ["Ã¢â‚¬Â¢", "-"],
];

const articleFigures = {
  "china-western-theatre-command-evolving-posture": [
    {
      caption: "Basic Chinese Defence Structure",
      image: "/article-doc-assets/image1.png",
    },
    {
      caption: "Geographic coverage of Chinese Theatre Commands",
      image: "/article-doc-assets/image9.png",
    },
    {
      caption: "A hillside storage facility and an underground fuel storage site in WTC",
      image: "/article-doc-assets/image2.png",
    },
    {
      caption: "Trenches near a BDR Company Base in Yadong County, Shigatse, Tibet",
      image: "/article-doc-assets/image12.png",
    },
    {
      caption: "HQs of 55th Light CAB under 77th and 17th Heavy CAB under 76th GA in WTC",
      image: "/article-doc-assets/image6.png",
    },
    {
      caption: "364th Border Defence Regiment HQ in Akta County, Xinjiang",
      image: "/article-doc-assets/image10.png",
    },
    {
      caption: "Upgrades at Ngari Gunsa Airport, 120 km from Indian border",
      image: "/article-doc-assets/image4.png",
    },
    {
      caption: "Some permanent PLAAF SAM positions in WTC",
      image: "/article-doc-assets/image3.png",
    },
    {
      caption: "Some PLA radar installations in WTC",
      image: "/article-doc-assets/image5.png",
    },
    {
      caption: "Some of the Chinese ballistic missiles with PLARF. Source: js7tv.cn",
      image: "/article-doc-assets/image8.jpg",
    },
    {
      caption: "A PLARF Missile Brigade base in Urumqi, Xinjiang",
      image: "/article-doc-assets/image7.png",
    },
    {
      caption:
        "A Large Phased Array Radar in Korla, used for monitoring missile test launches from the Korla Missile Test Complex Launch Site",
      image: "/article-doc-assets/image11.png",
    },
  ],
};

function cleanArticleText(value) {
  return textFixes.reduce((text, [broken, fixed]) => text.replaceAll(broken, fixed), value);
}

function normalizeFigureCaption(value) {
  return cleanArticleText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function splitCaptionPrefix(block, figure) {
  const caption = cleanArticleText(figure.caption);

  if (!block.startsWith(caption)) {
    return "";
  }

  return block.slice(caption.length).trim();
}

function splitArticleText(value) {
  const lines = cleanArticleText(value).split(/\r?\n/);
  const bodyLines = lines.slice(3);
  const blocks = [];
  let paragraphLines = [];
  let previousWasBlank = true;

  const pushParagraph = () => {
    if (!paragraphLines.length) {
      return;
    }

    blocks.push(paragraphLines.join(" ").trim());
    paragraphLines = [];
  };

  bodyLines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      pushParagraph();
      previousWasBlank = true;
      return;
    }

    const looksLikeHeading =
      previousWasBlank && trimmed.length < 96 && !/[.!?;:]$/.test(trimmed);

    if (looksLikeHeading) {
      pushParagraph();
      blocks.push(trimmed);
      previousWasBlank = false;
      return;
    }

    paragraphLines.push(trimmed);
    previousWasBlank = false;
  });

  pushParagraph();

  return blocks.filter(Boolean);
}

export default function ArticlePage() {
  const { slug } = useParams();
  const article = useMemo(
    () => DISPATCHES.find((item) => item.type === "free" && item.slug === slug),
    [slug]
  );
  const [content, setContent] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const figures = useMemo(() => articleFigures[slug] ?? [], [slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  useEffect(() => {
    if (!article?.contentPath) {
      return undefined;
    }

    const controller = new AbortController();

    async function loadArticle() {
      setStatus("loading");
      setMessage("");

      try {
        const response = await fetch(article.contentPath, { signal: controller.signal });

        if (!response.ok) {
          throw new Error("Unable to load article");
        }

        const text = await response.text();
        const blocks = splitArticleText(text);

        setContent(blocks);
        setStatus("ready");
      } catch (error) {
        if (error.name !== "AbortError") {
          setMessage(error.message);
          setStatus("error");
        }
      }
    }

    loadArticle();

    return () => controller.abort();
  }, [article]);

  if (!article) {
    return (
      <section className="article-reader-page min-h-screen px-4 pb-16 pt-28 md:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="article-reader-panel p-6 md:p-8">
            <p className="font-plex text-xs font-medium uppercase tracking-[0.18em] text-ember">
              Article
            </p>
            <h1 className="mt-3 font-rajdhani text-4xl font-bold leading-none text-chalk">
              Article not found.
            </h1>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="article-reader-page min-h-screen px-4 pb-16 pt-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <article className="article-reader-panel overflow-hidden">
          <header
            className="article-reader-hero"
            style={{ "--article-hero-image": `url(${article.image})` }}
          >
            <div className="article-reader-hero__content">
              <p className="font-plex text-xs font-medium uppercase tracking-[0.18em] text-chalk">
                {article.tag}
              </p>
              <h1 className="mt-5 font-rajdhani text-[clamp(2.4rem,6.6vw,5.35rem)] font-bold leading-[0.95] text-chalk">
                {article.title}
              </h1>
              <p className="mt-6 font-plex text-base font-semibold leading-7 text-chalk">
                by {article.author}
              </p>
            </div>
          </header>

          <div className="article-reader-body">
            {status === "loading" ? (
              <p className="font-plex text-sm text-ash">Loading article...</p>
            ) : null}

            {status === "error" ? (
              <p className="font-plex text-sm text-ember">{message}</p>
            ) : null}

            {status === "ready" && content.length
              ? content.map((block, index) => {
                  const normalizedBlock = normalizeFigureCaption(block);
                  const figure = figures.find((item) =>
                    normalizedBlock.startsWith(normalizeFigureCaption(item.caption))
                  );

                  if (figure) {
                    const remainingText = splitCaptionPrefix(block, figure);

                    return (
                      <div key={`${figure.image}-${index}`}>
                        <figure className="article-reader-figure">
                          <img src={figure.image} alt={figure.caption} loading="lazy" />
                          <figcaption>{figure.caption}</figcaption>
                        </figure>
                        {remainingText ? <p>{remainingText}</p> : null}
                      </div>
                    );
                  }

                  return block.length < 82 && !block.endsWith(".") ? (
                    <h2 key={`${block}-${index}`}>{block}</h2>
                  ) : (
                    <p key={`${block.slice(0, 40)}-${index}`}>{block}</p>
                  );
                })
              : null}
          </div>
        </article>
      </div>
    </section>
  );
}
