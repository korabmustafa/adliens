export const initialCompanies = [
  {
    id: "cmp-1",
    name: "DTC Skincare",
    logoUrl: "https://placehold.co/96x96/0a0a0e/C5FF38?text=DS",
    industry: "E-commerce",
    website: "https://example.com",
    isActive: true,
  },
  {
    id: "cmp-2",
    name: "SaaS Productivity App",
    logoUrl: "https://placehold.co/96x96/0a0a0e/C5FF38?text=SA",
    industry: "SaaS",
    website: "https://example.com",
    isActive: true,
  },
];

export const initialCaseStudies = [
  {
    id: "cs-1",
    companyId: "cmp-1",
    companyName: "DTC Skincare",
    name: "Q4 Paid Social Scale",
    logoUrl: "https://placehold.co/96x96/0a0a0e/C5FF38?text=DS",
    result: "+328% ROAS in 4 months",
    summary:
      "Creative refresh + paid social scaling with weekly experimentation loops.",
    services: ["Social Media Advertising", "Motion Design"],
    status: "published",
  },
  {
    id: "cs-2",
    companyId: "cmp-2",
    companyName: "SaaS Productivity App",
    name: "Demand Gen Pipeline",
    logoUrl: "https://placehold.co/96x96/0a0a0e/C5FF38?text=SA",
    result: "+210% qualified signups",
    summary:
      "Motion-first ad framework paired with conversion-focused landing page updates.",
    services: ["Social Media Design", "Consulting"],
    status: "published",
  },
];

// Fictional portfolio concepts for exploring the UI, not claims of client work.
const conceptWorlds = [
  [
    "nocturne",
    "NOCTURNE",
    "Fashion",
    7,
    "After|hours.",
    "An identity built for the night.",
    "A young fashion label needs a recognizable voice across collections and channels.",
    "A monochrome editorial system pairs oversized typography with rhythmic product stories.",
    "An editorial brand world ready for its first collection.",
    ["Brand Identity", "Social Media Design"],
  ],
  [
    "kinetic",
    "KINETIC",
    "Fitness",
    3,
    "Never|stand still.",
    "Energy that moves beyond the gym.",
    "A training studio wants its digital presence to match the energy of its sessions.",
    "An electric color system, athletic typography, and motion-led campaign concepts create momentum.",
    "A connected launch toolkit for the studio and its community.",
    ["Motion Design", "Social Media Advertising"],
  ],
  [
    "velora",
    "VELORA",
    "Hospitality",
    4,
    "Stay a|little longer.",
    "A destination before the destination.",
    "A boutique stay needs to communicate its atmosphere before a guest arrives.",
    "A calm identity and cinematic story sequence translate the guest experience into a digital journey.",
    "A considered visual language for a boutique hospitality launch.",
    ["Brand Identity", "Creative Strategy"],
  ],
  [
    "common",
    "COMMON GROUND",
    "Coffee",
    6,
    "Good things|brewing.",
    "The neighborhood’s daily ritual.",
    "An independent coffee concept needs a personality that works on a cup and on screen.",
    "Warm colors, playful copy, and modular illustrations connect packaging with social content.",
    "A launch-ready brand kit, from coffee cups to campaign posts.",
    ["Brand Identity", "Social Media Design"],
  ],
  [
    "offgrid",
    "OFFGRID",
    "Outdoor",
    5,
    "Go|elsewhere.",
    "Find the edge of the familiar.",
    "An outdoor label needs a campaign that speaks to exploration rather than equipment alone.",
    "Landscape-inspired compositions and a field-note graphic system turn products into invitations to explore.",
    "An adaptable campaign concept across social, retail, and digital.",
    ["Creative Strategy", "Social Media Advertising"],
  ],
  [
    "forma",
    "FORMA",
    "Architecture",
    4,
    "Space to|think.",
    "A new perspective on space.",
    "An architecture practice needs a clear identity that lets its projects speak.",
    "Architectural grids, precise typography, and generous space organize a project-led visual system.",
    "A coherent identity and project presentation system.",
    ["Brand Identity", "Consulting"],
  ],
  [
    "nova",
    "NOVA SOUND",
    "Audio",
    2,
    "Feel|the frequency.",
    "A visual identity you can almost hear.",
    "An audio concept needs a launch story that communicates an invisible experience.",
    "Frequency-inspired forms and fluid motion turn sound into a visual rhythm.",
    "A motion identity and connected social launch concept.",
    ["Motion Design", "Creative Strategy"],
  ],
  [
    "still",
    "STILL STUDIO",
    "Wellness",
    0,
    "A moment|for you.",
    "Slow down. Feel more.",
    "A wellness studio wants a warm, welcoming presence in a crowded category.",
    "Soft forms, tactile colors, and a thoughtful content rhythm create room to breathe.",
    "An inviting identity and social content direction.",
    ["Social Media Design", "Brand Identity"],
  ],
  [
    "mono",
    "MONO MOTORS",
    "Mobility",
    1,
    "Move|different.",
    "The next chapter of everyday movement.",
    "An electric mobility concept needs a distinctive introduction to urban audiences.",
    "Sculptural compositions and sharp messaging connect product design with daily city life.",
    "A product launch campaign and creative testing framework.",
    ["Social Media Advertising", "Motion Design"],
  ],
  [
    "solstice",
    "SOLSTICE",
    "Food & Drink",
    6,
    "Bottled|sunshine.",
    "A brighter kind of refreshment.",
    "A drinks concept needs a shelf presence that translates into digital attention.",
    "Citrus shapes, bright color blocking, and playful motion form one consistent campaign language.",
    "A complete concept for packaging and a summer social launch.",
    ["Brand Identity", "Motion Design"],
  ],
];

for (const [
  slug,
  name,
  industry,
  artTheme,
  artTitle,
  summary,
  challenge,
  approach,
  result,
  services,
] of conceptWorlds) {
  const companyId = `demo-${slug}`;
  initialCompanies.push({
    id: companyId,
    name,
    industry,
    website: "",
    logoUrl: "",
    isActive: true,
    isDemo: true,
  });
  for (let chapter = 0; chapter < 2; chapter++) {
    initialCaseStudies.push({
      id: `demo-${slug}-${chapter + 1}`,
      companyId,
      companyName: name,
      name:
        chapter === 0
          ? `${name} / Brand universe`
          : `${name} / Launch in motion`,
      summary:
        chapter === 0
          ? summary
          : `An extension of the ${name} concept into a campaign of connected social stories and launch assets.`,
      challenge,
      approach,
      result,
      services,
      status: "published",
      isDemo: true,
      artTheme: chapter === 0 ? artTheme : (artTheme + 1) % 8,
      artTitle,
    });
  }
}
initialCaseStudies.push(
  {
    id: "demo-skincare-2",
    companyId: "cmp-1",
    companyName: "DTC Skincare",
    name: "The everyday ritual",
    summary:
      "A concept social series focused on the small rituals that make skincare personal.",
    challenge:
      "Build a recognizable content world beyond individual product promotions.",
    approach:
      "Tactile compositions, honest messaging, and a consistent editorial structure.",
    result: "A repeatable social content direction.",
    services: ["Social Media Design", "Brand Identity"],
    status: "published",
    isDemo: true,
    artTheme: 0,
    artTitle: "A daily|kind of glow.",
  },
  {
    id: "demo-saas-2",
    companyId: "cmp-2",
    companyName: "SaaS Productivity App",
    name: "Less noise. More flow.",
    summary:
      "A concept brand campaign that turns focus and clarity into a visual language.",
    challenge:
      "Explain the value of a productivity product without adding more noise.",
    approach:
      "Minimal layouts and motion that illustrates the movement from complexity to clarity.",
    result: "A focused launch narrative and motion direction.",
    services: ["Creative Strategy", "Motion Design"],
    status: "published",
    isDemo: true,
    artTheme: 1,
    artTitle: "Find|your flow.",
  },
);
