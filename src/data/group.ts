// Research group / for-students content.
//
// REVIEW NOTE (for Fatima): the "looking for" qualities and "open directions" below are
// written from your stated research themes and teaching ethos already on this site - they
// are a starting point, not a commitment. Please edit freely.
//
// `members` is intentionally empty. Add current/past students here when you'd like them
// shown (name, role, optional focus); until then the page shows no members list. The
// `reviewItems` note only appears in local development, never in the built site.

export type GroupMember = {
  name: string;
  role: string; // e.g. "PhD student", "B.Tech project"
  focus?: string;
};

export const group = {
  intro:
    "I work with students who want to understand catalysis deeply - through modelling, simulation, and careful reasoning about what happens on a surface. If that sounds like you, I'd like to hear from you.",
  lookingFor: [
    "Curiosity, and the willingness to stay with a hard problem",
    "A sound grasp of thermodynamics and kinetics",
    "Some coding experience is helpful but not required - it can be learned here",
    "Care in checking results, and the ability to explain them clearly",
  ],
  howToWrite:
    "If you would like to work with me, write to me with your programme and year, your relevant background, and the direction that interests you.",
  openDirections: [
    {
      title: "Microkinetic modelling",
      text: "Building reaction networks that explain activity, selectivity, and how a catalyst deactivates.",
    },
    {
      title: "DFT-guided catalyst screening",
      text: "Using first-principles insight to screen bimetallic and single-atom alloys for promising behaviour.",
    },
    {
      title: "Biorenewable chemicals",
      text: "Designing catalytic routes that turn renewable feedstocks into fuels, chemicals, and hydrogen.",
    },
    {
      title: "Low-carbon pathways",
      text: "Exploring reforming, dehydrogenation, and CO2-assisted routes toward more responsible chemistry.",
    },
  ],
  members: [] as GroupMember[],
  // Shown only in local dev as a reminder of what to personalise before launch.
  reviewItems: [
    "Add current and past students (names, roles) to `members` in src/data/group.ts",
    "Note any specific open positions or funding, if applicable",
    "Adjust the 'what I look for' list and the enquiry sentence to your own words",
  ],
};
