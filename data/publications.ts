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
  authors: string;
  venue: string;
  details?: string;
  doi?: string;
  url?: string;
  note?: string;
};

export const PUBLICATIONS: Publication[] = [];

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
