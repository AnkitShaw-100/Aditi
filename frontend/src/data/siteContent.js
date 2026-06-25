import heroVideo from "../../media/aditi-hero-video.mp4";
import dispatchImage1 from "../../media/image2.webp";
import dispatchImage2 from "../../media/thumbnail_Serum-Institute-of-India-Pune--scaled.webp";
import dispatchImage3 from "../../media/INS-scaled.webp";
import dispatchImage4 from "../../media/Armament-w-scaled.webp";
import dispatchImage5 from "../../media/Doctrine-w-scaled.webp";
import frameworkBg from "../../media/Terrain-w-scaled.webp";
import logoMark from "../../media/logo.png";
import magPage1 from "../../media/Copy of MAGAZINE LANDING PAGE.png";
import magPage2 from "../../media/Copy of mag cover mockup out 1 (3).png";
import magPage3 from "../../media/Copy of mag cover mockup out 2.png";
import magPage4 from "../../media/Copy of Untitled design (7).png";
import magPage5 from "../../media/Copy of Untitled design (9).png";
import magPage6 from "../../media/optimized/magazine-landing-1800.jpg";

export const SECTION_IDS = [
  "intro",
  "mission",
  "authors",
  "read",
  "feedback",
  "faq",
  "pillars",
  "credentials",
  "editions",
];

export const NAV_ITEMS = [
  { id: "intro", label: "Home", index: "01" },
  { id: "mission", label: "Mission", index: "02" },
  { id: "authors", label: "Authors", index: "03" },
  { id: "read", label: "Articles", index: "04" },
  { id: "feedback", label: "Testimonials", index: "05" },
  { id: "faq", label: "FAQ", index: "06" },
];

export const MENU_ITEMS = [
  { id: "intro", title: "Home", index: "01", meta: "Hero video" },
  { id: "mission", title: "Mission", index: "02", meta: "About the brand" },
  { id: "authors", title: "Authors", index: "03", meta: "Ranks and roles" },
  { id: "read", title: "Articles", index: "04", meta: "Free and premium" },
  { id: "feedback", title: "Testimonials", index: "05", meta: "Reader trust" },
  { id: "faq", title: "FAQ", index: "06", meta: "Terms and access" },
];

export const MISSION_PILLARS = [
  {
    index: "01",
    title: "Clarity before commentary",
    copy:
      "ADITI is built to explain what matters, why it matters, and what changes because of it.",
  },
  {
    index: "02",
    title: "Doctrine over noise",
    copy:
      "We frame each article through doctrine, terrain, technology, and political intent instead of headline churn.",
  },
  {
    index: "03",
    title: "Reading for decision-makers",
    copy:
      "The writing is structured for serious readers who want context they can keep, revisit, and use.",
  },
];

export const AUTHORS = [
  {
    name: "Brigadier Brijesh Dhiman (Retd.)",
    rank: "Brigadier",
    specialty: "Internal Security and Counterinsurgency",
    summary:
      "Writes on force posture, border stabilisation, and the strategic choices that shape India's internal security doctrine.",
    image: "https://i.pravatar.cc/240?img=15",
  },
  {
    name: "Prof. Srikanth Kondapalli",
    rank: "Professor",
    specialty: "China Studies and Strategic Signalling",
    summary:
      "Brings long-range analysis on Chinese statecraft, cognitive warfare, and how regional pressure campaigns affect Indian strategy.",
    image: "https://i.pravatar.cc/240?img=52",
  },
  {
    name: "Cmde. Arjun Sethi (Retd.)",
    rank: "Commodore",
    specialty: "Maritime Strategy and Sea Control",
    summary:
      "Focuses on naval posture, logistics corridors, and the political meaning of maritime reach across the Indian Ocean.",
    image: "https://i.pravatar.cc/240?img=60",
  },
  {
    name: "Lt. Gen. Meera Nair (Retd.)",
    rank: "Lieutenant General",
    specialty: "Land Warfare and Theatre Strategy",
    summary:
      "Examines combined arms doctrine, theatre-level campaign design, and the operational choices that shape deterrence on India's frontiers.",
    image: "https://i.pravatar.cc/240?img=47",
  },
];

export const ARTICLE_ACCESS_OPTIONS = [
  {
    label: "Free Access",
    value: "Open",
    copy:
      "Starter dispatches that let new readers experience the editorial method before buying.",
  },
  {
    label: "Premium Access",
    value: "\u20B9350",
    copy:
      "Full-length strategic essays available one article at a time without a recurring subscription.",
  },
];

export const BRAND_STATS = [
  { value: "6", label: "Issues/Year", tone: "void" },
  { value: "5", label: "Strategic Pillars", tone: "plate" },
  { value: "1", label: "Central Paradox", tone: "ember" },
];

export const LENSES = [
  {
    id: "armament",
    index: "01",
    title: "Armament",
    copy: "Systems matter only when they change tempo, range, cost or political choice. ADITI reads weapons through doctrine, not catalogues.",
  },
  {
    id: "doctrine",
    index: "02",
    title: "Doctrine",
    copy: "Every force carries assumptions into battle. ADITI tests those assumptions against geography, adversary behavior and escalation risk.",
  },
  {
    id: "intelligence",
    index: "03",
    title: "Intelligence",
    copy: "Signals, deception and uncertainty shape outcomes before the first shot. ADITI separates evidence from theatre.",
  },
  {
    id: "terrain",
    index: "04",
    title: "Terrain",
    copy: "Mountains, ports, deserts and cities are strategic actors. They decide what ambition can actually do.",
  },
  {
    id: "initiative",
    index: "05",
    title: "Initiative",
    copy: "The side that frames the contest often controls escalation. ADITI studies initiative as a political instrument.",
  },
];

export const DISPATCH_FILTERS = [
  { label: "All", value: "all" },
  { label: "Free", value: "free" },
  { label: "Premium", value: "premium" },
];

export const DISPATCHES = [
  {
    type: "free",
    href: "article.html?id=china-cognitive-warfare-india",
    image: dispatchImage1,
    tag: "Cognitive Warfare",
    title: "China's Cognitive Warfare and India",
    teaser:
      "Srikanth Kondapalli on China's cognitive domain playbook, its pressure campaigns, and India's strategic response.",
    readTime: "11 min read",
    cta: "Read",
    priceLabel: "Free",
    ariaLabel: "Read China's Cognitive Warfare and India",
  },
  {
    type: "free",
    href: "article.html?id=inside-north-east-security-strategy",
    image: dispatchImage2,
    tag: "Internal Security",
    title: "Inside the Government's North East Security Strategy",
    teaser:
      "Brigadier Brijesh Dhiman (Retd.) examines insurgency decline, hybrid threats, and the next phase of stabilisation.",
    readTime: "13 min read",
    cta: "Read",
    priceLabel: "Free",
    ariaLabel: "Read Inside the Government's North East Security Strategy",
  },
  {
    type: "premium",
    href: "/checkout",
    slug: "ladakh-question-after-buffer-zones",
    image: dispatchImage3,
    tag: "Northern Theatre",
    title: "The Ladakh Question After the Buffer Zones",
    teaser:
      "A close reading of infrastructure, patrol denial and the new rhythm of pressure along the Himalayan frontier.",
    readTime: "8 min read",
    cta: "Access",
    priceLabel: "\u20B9350",
    ariaLabel: "Login to access The Ladakh Question After the Buffer Zones",
  },
  {
    type: "premium",
    href: "/checkout",
    slug: "indias-maritime-dilemma-middle-ocean",
    image: dispatchImage4,
    tag: "Maritime",
    title: "India's Maritime Dilemma in the Middle Ocean",
    teaser:
      "Why sea control, logistics and island access now sit at the centre of India's strategic autonomy.",
    readTime: "10 min read",
    cta: "Access",
    priceLabel: "\u20B9350",
    ariaLabel: "Login to access India's Maritime Dilemma in the Middle Ocean",
  },
  {
    type: "premium",
    href: "/checkout",
    slug: "drones-attrition-return-of-mass",
    image: dispatchImage5,
    tag: "Technology",
    title: "Drones, Attrition and the Return of Mass",
    teaser:
      "Cheap unmanned systems are not replacing strategy. They are forcing armies to rediscover depth and redundancy.",
    readTime: "9 min read",
    cta: "Access",
    priceLabel: "\u20B9350",
    ariaLabel: "Login to access Drones, Attrition and the Return of Mass",
  },
];

export const FEEDBACKS = [
  {
    category: "Strategic Affairs",
    quote: "The battlefield begins long before the first shot.",
    name: "Meera Rao",
    role: "Strategic Affairs Editor",
    image: "https://i.pravatar.cc/160?img=32",
  },
  {
    category: "Defence Technology",
    quote: "Platforms matter when they change political options.",
    name: "Kabir Menon",
    role: "Defence Technology Analyst",
    image: "https://i.pravatar.cc/160?img=12",
  },
  {
    category: "Geopolitics",
    quote: "Sovereignty is a habit before it is a headline.",
    name: "Arjun Sethi",
    role: "Geopolitics Contributor",
    image: "https://i.pravatar.cc/160?img=56",
  },
];

export const READER_FEEDBACKS = [
  {
    category: "Reader Note",
    quote: "It reads like a briefing, but it stays elegant and human.",
    name: "Nandini Shah",
    role: "Policy Reader",
    image: "https://i.pravatar.cc/160?img=47",
  },
  {
    category: "Field Opinion",
    quote: "The structure helps me through doctrine without clutter.",
    name: "Aarav Khanna",
    role: "Security Professional",
    image: "https://i.pravatar.cc/160?img=68",
  },
  {
    category: "Dispatch Review",
    quote: "Each piece feels like a serious argument, not a feed update.",
    name: "Ishita Menon",
    role: "Graduate Reader",
    image: "https://i.pravatar.cc/160?img=5",
  },
];

export const EDITION_STATS = [
  {
    value: "4",
    label: "Quarterly Editions",
    tagline: "A measured publishing rhythm",
    description:
      "Four releases each year — each edition built as a complete strategic argument, not a news cycle reaction.",
  },
  {
    value: "350",
    prefix: "\u20B9",
    label: "Per Dispatch",
    tagline: "Pay per essay, not per month",
    description:
      "Buy individual premium dispatches at \u20B9350 each. No recurring subscription, no paywall maze.",
  },
  {
    value: "5",
    label: "Analytical Lenses",
    tagline: "One disciplined reading method",
    description:
      "Armament, doctrine, intelligence, terrain, and initiative — five lenses that turn noise into strategy.",
  },
];

export const OJAS_PANELS = [
  {
    id: "forum",
    index: "01",
    label: "Annual Forum",
    headline: "Arguments sharpened in public",
    copy:
      "A yearly gathering where India's strategic community debates doctrine, deterrence, and national intent across disciplines and domains.",
    detail: "Keynotes - Panels - Working sessions - Land - Sea - Air - Cyber - Space - Statecraft",
  },
  {
    id: "heritage",
    index: "02",
    label: "Indian Frame",
    headline: "Heritage meets the present",
    copy:
      "OJAS anchors debate in India's civilisational memory while confronting the operational pressures of the contemporary moment and the reading discipline behind the forum.",
    detail: "Learn about OJAS 2026",
    accent: true,
  },
];

export const FAQ_ITEMS = [
  {
    question: "Can I buy one article without subscribing?",
    answer:
      "Yes. ADITI is built around individual strategic dispatches. Premium articles are priced at \u20B9350 each.",
  },
  {
    question: "What do I receive after purchase?",
    answer:
      "You receive access to the full dispatch in a clean reading format designed for mobile and desktop.",
  },
  {
    question: "Is ADITI political commentary?",
    answer:
      "ADITI focuses on strategic analysis: doctrine, geography, technology, sovereignty and military decision-making.",
  },
  {
    question: "Are there free articles?",
    answer:
      "Yes. Open access dispatches introduce the ADITI method and help readers decide what to buy next.",
  },
];

export const PAGEFLIP_PAGES = [
  {
    image: magPage1,
    alt: "Magazine landing page in warm editorial tones",
  },
  {
    image: magPage2,
    alt: "Magazine cover mockup with ADITI branding",
  },
  {
    image: magPage3,
    alt: "Second magazine cover mockup with ADITI branding",
  },
  {
    image: magPage4,
    alt: "Square magazine design composition",
  },
  {
    image: magPage5,
    alt: "Alternate square magazine design composition",
  },
  {
    image: magPage6,
    alt: "Magazine landing page preview",
  },
];

export { heroVideo, frameworkBg, logoMark };
