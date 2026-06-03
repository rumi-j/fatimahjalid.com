// Recent news / activity feed, newest first.
//
// REVIEW NOTE (for Fatima): seeded from items already public on this site (awards, talks,
// papers, the SPARC project). Add new entries here over time - papers accepted, talks
// given, students joining, awards - to keep the homepage feeling current.

export type NewsItem = {
  date: string; // human-readable, e.g. "Apr 2025"
  year: number; // for sorting
  category: "Paper" | "Talk" | "Award" | "Feature" | "Project";
  title: string;
  summary: string;
  url?: string;
};

export const news: NewsItem[] = [
  {
    date: "2026",
    year: 2026,
    category: "Feature",
    title: "Featured in the HER@IITD alumni coffee-table book",
    summary: "Profiled among IIT Delhi women alumni for the journey from student to faculty.",
    url: "/documents/her-at-iitd-coffee-table-book.pdf",
  },
  {
    date: "2025",
    year: 2025,
    category: "Award",
    title: "Selected for 'She Is - Women in Chemistry'",
    summary: "Among 75 women recognised for contributions to chemistry by Beyond Black, the Office of the PSA, and the Royal Society of Chemistry.",
    url: "https://books.google.co.in/books/about/She_Is_Women_in_Chemistry.html?id=oR4REQAAQBAJ&redir_esc=y",
  },
  {
    date: "2025",
    year: 2025,
    category: "Talk",
    title: "Invited talk: Toward Carbon-Neutral Olefin Production",
    summary: "Presented at Advances in CCUS, IIT Kanpur.",
  },
  {
    date: "2025",
    year: 2025,
    category: "Paper",
    title: "New paper on microkinetic insights into water-gas catalysis",
    summary: "Published in The Canadian Journal of Chemical Engineering with M. Z. Farooqi.",
    url: "https://scholar.google.com/citations?user=S4RnI4gAAAAJ&hl=en",
  },
  {
    date: "2024",
    year: 2024,
    category: "Project",
    title: "Co-Investigator on a SPARC-funded catalysis project",
    summary: "Design of catalytic materials and solvent environment to produce biorenewable chemicals (Ministry of Education).",
  },
];
