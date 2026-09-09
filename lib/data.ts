export type Practice = { name: string; desc: string; tone: string };

export const practices: Practice[] = [
  { name: "Breathing Practice", desc: "10 min 51 sec — anchor attention in the rhythm of the breath.", tone: "" },
  { name: "Body Scan", desc: "10 min 40 sec — bring gentle awareness through the whole body.", tone: "card--teal" },
  { name: "Awareness of Thoughts", desc: "14 min 59 sec — observe the mind without being carried away.", tone: "" },
  { name: "Open Awareness", desc: "12 min 7 sec — rest in a spacious, receptive attention.", tone: "card--amber" },
  { name: "Developing Empathy", desc: "13 min 18 sec — cultivate kindness toward self and others.", tone: "" },
  { name: "Ocean Breathing", desc: "Our signature — six breaths a minute, guided by the waves.", tone: "card--teal" },
];

export const roadmapPhases = [
  { name: "Genesis", timing: "Year 1", focus: "Research & validation", desc: "Develop and test an initial MMI with academic collaborators, including wavelet-entropy research. Redesign the app and prototype contemplative art. Launch a Universal-tier MVP with generative ocean sounds." },
  { name: "Expansion", timing: "Year 2", focus: "Hardware & education pilots", desc: "Integrate compatible BrainCo FocusCalm hardware. Pilot the evening relay in Hong Kong, London, and New York. Introduce STEM+ modules in 50 pilot schools." },
  { name: "Global Pulse", timing: "Year 3", focus: "Community growth", desc: "Extend the Mindfulness Hour to 12 regional time-zone groups. Launch the community hub with a live globe visualisation. Release the Terra Nova neurofeedback game." },
  { name: "Integration", timing: "Year 4+", focus: "Research collaboration & wider access", desc: "Explore governed access to consented research data through an API for beneficial AI research. Expand charitable delivery in Africa and the wider Global South. Explore a global neurofeedback challenge event." },
];

export const regions = [
  { name: "Asia–Pacific", cities: "Tokyo · Sydney · Beijing · Manila" },
  { name: "South & West Asia", cities: "New Delhi · Dubai" },
  { name: "Europe & Africa", cities: "Moscow · London · Berlin" },
  { name: "The Americas", cities: "New York · Los Angeles · São Paulo" },
];

export const partners = [
  { name: "Practitioners & teachers", desc: "Meditation practitioners, mindfulness teachers, and contemplative organisations." },
  { name: "Investors & tech partners", desc: "Wearable integration, adaptive audio, the community hub, and creative tools." },
  { name: "Charities & foundations", desc: "Local knowledge, equipment, and funding for the Spiritual Oasis programme." },
  { name: "Researchers & artists", desc: "Neuroscience, psychology, AI, data ethics, music, and visual art." },
];

export const practiceSessions = [
  { name: "Breathing Practice", duration: "10 min 51 sec" },
  { name: "Body Scan", duration: "10 min 40 sec" },
  { name: "Awareness of Thoughts", duration: "14 min 59 sec" },
  { name: "Open Awareness", duration: "12 min 7 sec" },
  { name: "Developing Empathy", duration: "13 min 18 sec" },
];
