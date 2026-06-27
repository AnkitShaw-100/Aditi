import heroVideo from "../../media/aditi-hero-video.mp4";
import westernTheatreImage from "../../media/image2.webp";
import biotechnologyImage from "../../media/thumbnail_Serum-Institute-of-India-Pune--scaled.webp";
import builderPsycheImage from "../../media/INS-scaled.webp";
import frameworkBg from "../../media/Terrain-w-scaled.webp";
import logoMark from "../../media/logo.png";
import bookPage1 from "../../media/book-image-1.png";
import bookPage2 from "../../media/book-image-2.png";
import bookPage3 from "../../media/book-image-3.png";
import bookPage4 from "../../media/book-image-4.png";

const contributorImages = import.meta.glob("../../media/contributors image/*", {
  eager: true,
  import: "default",
  query: "?url",
});

function contributorImage(matchText) {
  const match = Object.entries(contributorImages).find(([path]) =>
    path.toLowerCase().includes(matchText.toLowerCase())
  );

  return match?.[1] ?? "https://i.pravatar.cc/240?img=15";
}

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
  { id: "authors", label: "Authors", index: "02" },
  { id: "read", label: "Articles", index: "03" },
  { id: "feedback", label: "Testimonials", index: "04" }
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
    name: "Lt. Gen. Dharam Vir Kalra",
    rank: "PVSM, AVSM (Retd.)",
    specialty: "Defence logistics, supply-chain management, and operational planning.",
    summary:
      "Former Director General of Ordnance Services, he brings a civilisational and logistics lens to questions of strategy.",
    image: contributorImage("dv kalra"),
  },
  {
    name: "Cmde. Anil Jai Singh",
    rank: "Commodore (Retd.)",
    specialty: "Submarine warfare, maritime strategy, procurement, and indigenisation.",
    summary:
      "A veteran submariner and maritime commentator, he examines India's defence procurement process for ADITI.",
    image: contributorImage("anil jai singh"),
  },
  {
    name: "Brig. Anshuman Narang",
    rank: "Brigadier (Retd.)",
    specialty: "OSINT, space security, UAS, and counter-UAS warfare.",
    summary:
      "Founder of the Atma Nirbhar Soch Foundation, he writes on re-energising India's space ecosystem.",
    image: contributorImage("anshuman narang"),
  },
  {
    name: "Mr. Pawan Kakkar",
    rank: "Industry Leader",
    specialty: "Emerging defence technologies, UAVs, and counter-unmanned systems.",
    summary:
      "CEO of Jugapro India, he studies counter-UAS innovation through technological and operational relevance.",
    image: contributorImage("pawan kakkar"),
  },
  {
    name: "Mr. Adithya Kothandhapani",
    rank: "Aerospace Engineer",
    specialty: "LEO, cis-lunar missions, satellite tracking, and OSINT validation.",
    summary:
      "He combines space engineering with policy analysis to examine the cost of chasing China in space.",
    image: contributorImage("adithya kothandhapani"),
  },
  {
    name: "Gp. Cpt. Rajiv Kumar Narang",
    rank: "VM (Retd.)",
    specialty: "Aviation safety, unmanned systems, drones, and defence indigenisation.",
    summary:
      "A former IAF helicopter pilot and Senior Fellow at MP-IDSA, he writes on Atmanirbharta in naval aviation.",
    image: contributorImage("rk narang"),
  },
  {
    name: "AVM Anil Golani",
    rank: "AVM (Retd.)",
    specialty: "Aerospace power, air strategy, and defence studies.",
    summary:
      "Director General at the Centre for Aerospace Power and Strategic Studies, he brings an air-power view to strategic debate.",
    image: contributorImage("avm anil golani"),
  },
  {
    name: "Brig. Brijesh Dhiman",
    rank: "Brigadier (Retd.)",
    specialty: "Counterinsurgency, internal security, and Northeast operations.",
    summary:
      "An Assam Regiment veteran, he analyses the Indian State's approach to non-state actors in the Northeast.",
    image: contributorImage("brijesh dhiman"),
  },
  {
    name: "Lt. Gen. Rakesh Sharma",
    rank: "PVSM, UYSM, AVSM, VSM (Retd.)",
    specialty: "Land warfare, military strategy, and national security policy.",
    summary:
      "A distinguished fellow in strategic affairs, he contributes a senior land-force perspective to national security questions.",
    image: contributorImage("rakesh sharma"),
  },
  {
    name: "Maj. Gen. Neeraj Bali",
    rank: "SM (Retd.)",
    specialty: "Counter-terror operations, training, and China strategy.",
    summary:
      "A veteran of Rashtriya Rifles command and strategic advisory roles, he argues why India's China strategy needs a rethink.",
    image: contributorImage("neeraj bali"),
  },
  {
    name: "Maj. Gen. Rajan Kochhar",
    rank: "VSM (Retd.)",
    specialty: "Army logistics, defence analysis, and higher defence management.",
    summary:
      "A prolific defence writer and former Army Ordnance Corps officer, he assesses future-ready logistics for the Indian Army.",
    image: contributorImage("rajan kochhar"),
  },
  {
    name: "Maj. Gen. Bipin Bakshi",
    rank: "AVSM, VSM (Retd.)",
    specialty: "Land warfare studies, military modernisation, and strategic affairs.",
    summary:
      "A distinguished fellow at CLAWS, he adds a grounded military-modernisation lens to the contributor panel.",
    image: contributorImage("bipin bakshi"),
  },
  {
    name: "RAdm. Alok Bhatnagar",
    rank: "NM, Legion of Merit (Retd.)",
    specialty: "Maritime affairs, international engagement, and defence education.",
    summary:
      "A retired Rear Admiral and international affairs leader, he brings maritime and institutional depth to ADITI.",
    image: contributorImage("alok bhatnagar"),
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
    href: "/articles/biotechnology-one-bet-several-wins",
    slug: "biotechnology-one-bet-several-wins",
    contentPath: "/articles/biotechnology-one-bet-several-wins.txt",
    image: biotechnologyImage,
    tag: "Initiative",
    title: "Biotechnology - One Bet, Several Wins",
    teaser:
      "Kushal Johri on biotechnology as a strategic domain for healthcare, biodefence, exports, and geopolitical leverage.",
    author: "Mr. Kushal Johri",
    readTime: "14 min read",
    cta: "Read",
    priceLabel: "Free",
    ariaLabel: "Read Biotechnology - One Bet, Several Wins",
  },
  {
    type: "free",
    href: "/articles/builders-psyche-atmanirbharta-defence",
    slug: "builders-psyche-atmanirbharta-defence",
    contentPath: "/articles/builders-psyche-atmanirbharta-defence.txt",
    image: builderPsycheImage,
    tag: "Initiative",
    title: "The Need for a Builder's Psyche in Defence",
    teaser:
      "Dr. Indranil Roy argues that Atmanirbharta depends on building, testing, producing, deploying, and iterating domestic weapons.",
    author: "Dr. Indranil Roy",
    readTime: "20 min read",
    cta: "Read",
    priceLabel: "Free",
    ariaLabel: "Read The Need for a Builder's Psyche in Defence",
  },
  {
    type: "free",
    href: "/articles/china-western-theatre-command-evolving-posture",
    slug: "china-western-theatre-command-evolving-posture",
    contentPath: "/articles/china-western-theatre-command-evolving-posture.txt",
    image: westernTheatreImage,
    tag: "Armament",
    title: "China's Western Theatre Command and PLA's Evolving Posture",
    teaser:
      "Jaidev Jamwal maps the Western Theatre Command's reforms, logistics, airpower, air defence, missiles, and multi-domain posture.",
    author: "Mr. Jaidev Jamwal",
    readTime: "23 min read",
    cta: "Read",
    priceLabel: "Free",
    ariaLabel: "Read China's Western Theatre Command and PLA's Evolving Posture",
  },
  {
    type: "free",
    href: "/articles/challenges-of-atmanirbharta-in-naval-aviation",
    slug: "challenges-of-atmanirbharta-in-naval-aviation",
    contentPath: "/articles/challenges-of-atmanirbharta-in-naval-aviation.txt",
    image: "/article-banners/challenges-of-atmanirbharta-in-naval-aviation.webp",
    tag: "Armament",
    title: "Challenges of Atmanirbharta in Naval Aviation",
    teaser:
      "Gp Capt Rajiv Kumar Narang examines why naval aviation has not followed the Navy's shipbuilding self-reliance trajectory.",
    author: "Gp Capt (Dr.) Rajiv Kumar Narang VM (Retd.)",
    readTime: "18 min read",
    cta: "Read",
    priceLabel: "Free",
    ariaLabel: "Read Challenges of Atmanirbharta in Naval Aviation",
  },
  {
    type: "free",
    href: "/articles/followers-dilemma-cost-of-chasing-china-in-space",
    slug: "followers-dilemma-cost-of-chasing-china-in-space",
    contentPath: "/articles/followers-dilemma-cost-of-chasing-china-in-space.txt",
    image: "/article-banners/followers-dilemma-cost-of-chasing-china-in-space.gif",
    tag: "Initiative",
    title: "The Follower's Dilemma: The Cost of Chasing China in Space",
    teaser:
      "Adithya Kothandhapani argues that India's space strategy must solve Indian constraints instead of validating Chinese metrics.",
    author: "Adithya Kothandhapani",
    readTime: "22 min read",
    cta: "Read",
    priceLabel: "Free",
    ariaLabel: "Read The Follower's Dilemma: The Cost of Chasing China in Space",
  },
  {
    type: "free",
    href: "/articles/inside-government-north-east-security-strategy",
    slug: "inside-government-north-east-security-strategy",
    contentPath: "/articles/inside-government-north-east-security-strategy.txt",
    image: frameworkBg,
    tag: "Terrain",
    title: "Inside the Government's North East Security Strategy",
    teaser:
      "Brigadier Brijesh Dhiman studies how counter-terror operations, negotiations, and development changed the North East security landscape.",
    author: "Brigadier Brijesh Dhiman (Retd.)",
    readTime: "17 min read",
    cta: "Read",
    priceLabel: "Free",
    ariaLabel: "Read Inside the Government's North East Security Strategy",
  },
  {
    type: "free",
    href: "/articles/chinas-cognitive-warfare-and-india",
    slug: "chinas-cognitive-warfare-and-india",
    contentPath: "/articles/chinas-cognitive-warfare-and-india.txt",
    image: westernTheatreImage,
    tag: "Geopolitics",
    title: "China's Cognitive Warfare and India",
    teaser:
      "Prof. Srikanth Kondapalli maps China's grey-zone narrative operations and India's options for countering cognitive warfare.",
    author: "Prof. Srikanth Kondapalli",
    readTime: "10 min read",
    cta: "Read",
    priceLabel: "Free",
    ariaLabel: "Read China's Cognitive Warfare and India",
  },
  {
    type: "free",
    href: "/articles/control-of-air-future-regional-dynamics",
    slug: "control-of-air-future-regional-dynamics",
    contentPath: "/articles/control-of-air-future-regional-dynamics.txt",
    image: "/article-banners/control-of-air-future-regional-dynamics.png",
    tag: "Armament",
    title: "Control of Air: Future Regional Dynamics",
    teaser:
      "Air Marshal Diptendu Choudhury revisits control of air through contemporary conflicts, China, Pakistan, and India's future context.",
    author: "Air Marshal (Dr) Diptendu Choudhury (Retd)",
    readTime: "13 min read",
    cta: "Read",
    priceLabel: "Free",
    ariaLabel: "Read Control of Air: Future Regional Dynamics",
  },
  {
    type: "premium",
    href: "/checkout",
    slug: "aditi-strategy-defence-volume-1-issue-1",
    image: "/article-banners/aditi-strategy-defence-magazine-mockup.webp",
    tag: "Premium Magazine",
    title:
      "ADITI Strategy & Defence Magazine - Volume 1, Issue 1: Cognitive Dissonance in Indian Strategy",
    teaser:
      "The inaugural ADITI issue on cognitive dissonance in Indian strategy, featuring strategic essays, interviews, procurement analysis, drone affairs, air power, and book reviews.",
    author: "ADITI Editorial",
    readTime: "Magazine issue",
    cta: "Buy Now",
    priceLabel: "\u20B9350",
    ariaLabel:
      "Buy ADITI Strategy and Defence Magazine Volume 1 Issue 1",
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
  {
    category: "Subscriber View",
    quote: "The essays give me a framework before they give me an opinion.",
    name: "Rohan Malhotra",
    role: "Defence Enthusiast",
    image: "https://i.pravatar.cc/160?img=61",
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
    image: bookPage1,
    alt: "ADITI booklet page 1",
  },
  {
    image: bookPage2,
    alt: "ADITI booklet page 2",
  },
  {
    image: bookPage3,
    alt: "ADITI booklet page 3",
  },
  {
    image: bookPage4,
    alt: "ADITI booklet page 4",
  },
];

export { heroVideo, frameworkBg, logoMark };
