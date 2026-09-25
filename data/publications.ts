/* Research & publications.
 *
 * One list, typed, shared by both locales: a paper's title, authors, venue and
 * DOI are the same in every language, so only the page's own copy lives in the
 * message files.
 *
 * One entry per paper:
 *
 *   {
 *     year: "2023",
 *     title: "Long-term practice of intuitive inquiry meditation modulates EEG …",
 *     authors: "Gao, J., Leung, H. K., Wu, B. W. Y., Hung, J., Chang, C., & Sik, H. H.",
 *     venue: "Heliyon",
 *     details: "9(9), e19545",          // volume, issue, article number or pages
 *     doi: "10.1016/j.heliyon.2023.e19545",
 *     url: "https://…",                 // optional; without it the DOI resolves
 *     note: "Open access",              // optional, shown after the venue
 *   }
 *
 * The page groups the list by year, newest first, and links each title to `url`
 * or to `https://doi.org/<doi>`.
 */

export type Publication = {
  year: string;
  title: string;
  /* The Chinese rendering of the title, where the authors published one. */
  titleAlt?: string;
  authors: string;
  venue: string;
  details?: string;
  doi?: string;
  url?: string;
  note?: string;
};

export const PUBLICATIONS: Publication[] = [
  {
    year: "2026",
    title: "Interoceptive Mindful Breathing: The ISAAA Model for Attentional–Autonomic Alignment",
    authors: "Sik, H. H., Maharjan, S., & Gao, J.",
    venue: "Mindfulness",
    doi: "10.1007/s12671-026-02945-0",
  },
  {
    year: "2025",
    title: "Interbrain synchronization in classroom during high-entropy music listening and meditation: a hyperscanning EEG study",
    authors: "Gao, J., Leung, H. K., Lee, K. C., Poon, C. C., Huang, G., Liao, J., Wu, B. W. Y., Thach, T. Q., Ho, R. T. H., & Sik, H. H.",
    venue: "Frontiers in Neuroscience",
    details: "19, 1557904",
    doi: "10.3389/fnins.2025.1557904",
  },
  {
    year: "2025",
    title: "Neural Pattern of Chanting-Driven Intuitive Inquiry Meditation in Expert Chan Practitioners",
    authors: "Lee, K. C. G., Sik, H. H., Leung, H. K., Wu, B. W. Y., Sun, R., & Gao, J.",
    venue: "Behavioral Sciences",
    details: "15(9), 1213",
    doi: "10.3390/bs15091213",
  },
  {
    year: "2023",
    title: "Long-term practice of intuitive inquiry meditation modulates EEG dynamics during self-schema processing",
    authors: "Gao, J., Leung, H. K., Wu, B. W. Y., Hung, J., Chang, C., & Sik, H. H.",
    venue: "Heliyon",
    details: "9(9), e20075",
    doi: "10.1016/j.heliyon.2023.e20075",
  },
  {
    year: "2023",
    title: "Increased neurocardiological interplay after mindfulness meditation: a brain oscillation-based approach",
    authors: "Gao, J., Sun, R., Leung, H. K., Roberts, A., Wu, B. W. Y., Tsang, E. W., … & Sik, H. H.",
    venue: "Frontiers in Human Neuroscience",
    details: "17, 1008490",
    doi: "10.3389/fnhum.2023.1008490",
  },
  {
    year: "2022",
    title: "The neurophysiology of the intervention strategies of Awareness Training Program on emotion regulation",
    authors: "Gao, J., Leung, H. K., Fan, J., Wu, B. W. Y., & Sik, H. H.",
    venue: "Frontiers in Psychology",
    details: "13",
    doi: "10.3389/fpsyg.2022.891656",
  },
  {
    year: "2021",
    title: "Modulation of the neurophysiological response to fearful and stressful stimuli through repetitive religious chanting",
    authors: "Sik, H. H., Halkias, G. T., Chang, C., Gao, J., Leung, H. K., & Wu, B. W. Y.",
    venue: "Journal of Visualized Experiments",
    details: "177, e62960",
    doi: "10.3791/62960",
  },
  {
    year: "2020",
    title: "Repetitive religious chanting invokes positive emotional schema to counterbalance fear: a multi-modal functional and structural MRI study",
    titleAlt: "多模態磁共振研究顯示反復念佛能形成正面情緒模式以抗衡恐懼",
    authors: "Gao, J., Skouras, S., Leung, H. K., Wu, B. W. Y., Wu, H., Chang, C., & Sik, H. H.",
    venue: "Frontiers in Behavioral Neuroscience",
    details: "14, 198",
    doi: "10.3389/fnbeh.2020.548856",
  },
  {
    year: "2019",
    title: "The neurophysiological correlates of religious chanting",
    titleAlt: "念佛的神經生理學基礎",
    authors: "Gao, J., Leung, H. K., Wu, B. W. Y., Skouras, S., & Sik, H. H.",
    venue: "Scientific Reports",
    details: "9(1), 1–9",
    doi: "10.1038/s41598-019-40200-w",
  },
  {
    year: "2019",
    title: "A Randomized Controlled Trial of Awareness Training Program (ATP), a Group-Based Mahayana Buddhist Intervention",
    authors: "Wu, B. W. Y., Gao, J., Leung, H. K., & Sik, H. H.",
    venue: "Mindfulness",
    details: "10(7), 1280–1293",
    doi: "10.1007/s12671-018-1082-1",
  },
  {
    year: "2017",
    title: "Repetitive Religious Chanting Modulates the Late-Stage Brain Response to Fear- and Stress-Provoking Pictures",
    titleAlt: "重複念佛調節人腦對恐懼和焦慮圖片的後期反應",
    authors: "Gao, J., Fan, J., Wu, B. W. Y., Halkias, G. T., Chau, M., Fung, P. C., Chang, C., Zhang, Z., Hung, Y. S., & Sik, H. H.",
    venue: "Frontiers in Psychology",
    details: "7, 2055",
    doi: "10.3389/fpsyg.2016.02055",
  },
  {
    year: "2017",
    title: "Using wavelet entropy to demonstrate how mindfulness practice increases coordination between irregular cerebral and cardiac activities",
    authors: "Sik, H. H., Gao, J., Fan, J., Wu, B. W. Y., Leung, H. K., & Hung, Y. S.",
    venue: "Journal of Visualized Experiments",
    details: "123, e55455",
    doi: "10.3791/55455",
  },
  {
    year: "2016",
    title: "Entrainment of chaotic activities in brain and heart during MBSR mindfulness training",
    titleAlt: "正念靜修訓練能協調心腦的不規則活動",
    authors: "Gao, J., Fan, J., Wu, B. W. Y., Zhang, Z., Chang, C., Hung, Y. S., Fung, P. C. W., & Sik, H. H.",
    venue: "Neuroscience Letters",
    details: "616, 218–223",
    doi: "10.1016/j.neulet.2016.01.001",
  },
];

/* The canonical, always-current list this page is drawn from (a Google Scholar
   profile, a University of Hong Kong staff page, a CV — whatever the lab keeps
   in one place). While `url` is empty the page simply does not show the line. */
export const PROFILE: { url: string; label: string } = {
  url: "",
  label: "",
};

/* The link a paper's title points at. */
export function publicationHref(publication: Publication): string | null {
  if (publication.url) return publication.url;
  if (publication.doi) return `https://doi.org/${publication.doi}`;
  return null;
}
