import creIIAutumn2025 from "../assets/teaching/class-cre-ii-autumn-2025.jpg";
import creIIAutumn2026 from "../assets/teaching/class-cre-ii-autumn-2026.jpg";
import creEtMscps from "../assets/teaching/class-cre-et-mscps-2024-2026.jpg";

export const courses = [
  { title: "Chemical Reaction Engineering", terms: ["Autumn 2024", "Autumn 2025"] },
  {
    title: "Energy Technology",
    terms: ["Spring 2022", "Spring 2023", "Spring 2024", "Spring 2025"],
  },
  {
    title: "Introduction to Chemical Engineering",
    terms: ["Autumn 2017", "Autumn 2018", "Autumn 2019", "Autumn 2020", "Autumn 2022"],
  },
  { title: "Mass Transfer", terms: ["Spring 2017", "Spring 2018", "Spring 2019"] },
  { title: "Computer Simulation Laboratory", terms: ["Autumn 2025"] },
  { title: "Chemical Technology", terms: ["Autumn 2018"] },
  { title: "Modelling and Simulation for Chemical Process Systems", terms: ["Spring 2026"] },
];

// Newest first; the first photo is shown full width on the teaching page.
// Source images are cropped to 16:9 with location metadata stripped.
export const classPhotos = [
  {
    image: creIIAutumn2026,
    classes: [{ course: "Chemical Reaction Engineering II", term: "Autumn 2026" }],
    alt: "The Chemical Reaction Engineering II class of Autumn 2026 seated on the campus amphitheatre steps, with Fatima Jalid on a bench in front.",
  },
  {
    image: creEtMscps,
    classes: [
      { course: "Chemical Reaction Engineering", term: "Autumn 2024" },
      { course: "Energy Technology", term: "Spring 2025" },
      { course: "Modelling and Simulation for Chemical Process Systems", term: "Spring 2026" },
    ],
    alt: "Students from Chemical Reaction Engineering, Energy Technology, and Modelling and Simulation for Chemical Process Systems on the campus amphitheatre steps in summer, with Fatima Jalid on a bench in front.",
  },
  {
    image: creIIAutumn2025,
    classes: [{ course: "Chemical Reaction Engineering II", term: "Autumn 2025" }],
    alt: "The Chemical Reaction Engineering II class of Autumn 2025 in winter clothes on the campus amphitheatre steps, with Fatima Jalid on a bench in front.",
  },
];

export const courseProjects = [
  {
    term: "Spring 2024",
    course: "Energy Technology",
    title: "Energy potential of duckweed",
    summary:
      "A course project exploring an unconventional biological resource through the lens of energy technology.",
  },
  {
    term: "Autumn 2025",
    course: "Computer Simulation Laboratory",
    title: "Research-paper project using CatMAP",
    summary:
      "A problem-based simulation exercise introducing students to microkinetic modelling through the open-source CatMAP framework.",
    url: "https://github.com/SUNCAT-Center/catmap",
  },
];
