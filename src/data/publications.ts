export type Publication = {
  type: "journal" | "chapter" | "patent";
  year: number;
  authors: string;
  title: string;
  venue: string;
  details?: string;
  url?: string;
  note?: string;
  tags?: string[];
};

export const publications: Publication[] = [
  {
    type: "journal",
    year: 2026,
    authors: "Mohammad Zakariya Farooqi, Fatima Jalid",
    title:
      "Microkinetic Modelling-Driven Insights into Water-Gas Shift Catalysis - Towards Unravelling Active Transition Metal-Based Bimetallic Alloys",
    venue: "The Canadian Journal of Chemical Engineering",
    details: "104(3), 1403-1419",
    url: "https://doi.org/10.1002/cjce.70091",
    tags: ["microkinetics", "alloys"],
  },
  {
    type: "journal",
    year: 2022,
    authors:
      "Amrish Kumar, Jayendran Iyer, Fatima Jalid, Manojkumar Ramteke, Tuhin S. Khan, M. Ali Haider",
    title:
      "Machine Learning Enabled Screening of Single Atom Alloys: Predicting Reactivity Trend for Ethanol Dehydrogenation",
    venue: "ChemCatChem",
    url: "https://doi.org/10.1002/cctc.202101481",
    tags: ["machine learning", "alloys"],
  },
  {
    type: "journal",
    year: 2022,
    authors: "Jayendran Iyer, Fatima Jalid, Tuhin S. Khan, M. Ali Haider",
    title:
      "Tracing the reactivity of single atom alloys for ethanol dehydrogenation using ab initio simulations",
    venue: "Reaction Chemistry & Engineering",
    details: "7, 61-75",
    url: "https://doi.org/10.1039/D1RE00396H",
    tags: ["DFT", "dehydrogenation"],
  },
  {
    type: "journal",
    year: 2021,
    authors: "Fatima Jalid, Tuhin S. Khan, M. Ali Haider",
    title:
      "Exploring bimetallic alloy catalysts of Co, Pd and Cu for CO2 reduction combined with ethane dehydrogenation",
    venue: "Applied Energy",
    details: "299, 117284",
    url: "https://doi.org/10.1016/j.apenergy.2021.117284",
    tags: ["CO2", "alloys"],
  },
  {
    type: "journal",
    year: 2021,
    authors: "Fatima Jalid, M. Ali Haider, M. I. Alam, Tuhin S. Khan",
    title:
      "Mechanistic Insights into Dominant Reaction Route and Catalyst Deactivation in Biogas Reforming using ab initio Microkinetic Modeling",
    venue: "Catalysis Science & Technology",
    details: "11, 2130-2143",
    url: "https://doi.org/10.1039/D0CY02155E",
    tags: ["biogas", "microkinetics"],
  },
  {
    type: "journal",
    year: 2021,
    authors: "Fatima Jalid, Tuhin S. Khan, M. Ali Haider",
    title:
      "Insights into the activity and selectivity trends in non-oxidative dehydrogenation of primary and secondary alcohols over the copper catalyst",
    venue: "Catalysis Today",
    details: "370, 151-160",
    url: "https://doi.org/10.1016/j.cattod.2020.11.021",
    tags: ["alcohols", "dehydrogenation"],
  },
  {
    type: "journal",
    year: 2021,
    authors: "Fatima Jalid, Tuhin S. Khan, M. Ali Haider",
    title:
      "CO2 reduction and ethane dehydrogenation on transition metal catalysts: mechanistic insights, reactivity trends and rational design of bimetallic alloys",
    venue: "Catalysis Science & Technology",
    details: "11, 97-115",
    url: "https://doi.org/10.1039/D0CY01290D",
    note: "Front cover",
    tags: ["CO2", "alloys"],
  },
  {
    type: "journal",
    year: 2020,
    authors:
      "Shivam Saxena, Tuhin S. Khan, Fatima Jalid, Manoj Kumar Ramteke, M. Ali Haider",
    title:
      "In silico high throughput screening of bimetallic and single atom alloys using machine learning and ab initio microkinetic modelling",
    venue: "Journal of Materials Chemistry A",
    details: "8, 107-123",
    url: "https://doi.org/10.1039/C9TA07651D",
    note: "Front cover",
    tags: ["machine learning", "screening"],
  },
  {
    type: "journal",
    year: 2019,
    authors: "Fatima Jalid, Tuhin S. Khan, M. Ali Haider",
    title:
      "In-silico screening of Pt-based bimetallic alloy catalysts using ab initio microkinetic modeling for non-oxidative dehydrogenation of ethanol to produce acetaldehyde",
    venue: "MRS Communications",
    details: "9, 107-113",
    url: "https://doi.org/10.1557/mrc.2019.6",
    tags: ["screening", "ethanol"],
  },
  {
    type: "journal",
    year: 2018,
    authors: "Tuhin S. Khan, Fatima Jalid, M. Ali Haider",
    title:
      "First-Principle Microkinetic Modeling of Ethanol Dehydrogenation on Metal Catalyst Surfaces in Non-oxidative Environment: Design of Bimetallic Alloys",
    venue: "Topics in Catalysis",
    details: "61, 1820-1831",
    url: "https://doi.org/10.1007/s11244-018-1028-9",
    note: "Equal first-author contribution",
    tags: ["ethanol", "microkinetics"],
  },
  {
    type: "journal",
    year: 2017,
    authors: "Fatima Jalid, Tuhin S. Khan, Fasil Q. Mir, M. Ali Haider",
    title:
      "Understanding trends in hydrodeoxygenation reactivity of metal and bimetallic alloy catalysts from ethanol reaction on stepped surface",
    venue: "Journal of Catalysis",
    details: "353, 265-273",
    url: "https://doi.org/10.1016/j.jcat.2017.07.018",
    tags: ["ethanol", "alloys"],
  },
  {
    type: "chapter",
    year: 2024,
    authors: "Fatima Jalid, Aravi Muzaffar",
    title:
      "Aqueous Phase Reforming of Biomass Derived Feedstocks - Towards the Design of Catalytic Systems for the Production of Hydrogen",
    venue: "Hydrogen Energy Production, Storage and Utilization",
    url: "https://www.routledge.com/Hydrogen-Energy-Production-Storage-and-Utilization/Khan-Choudhary-Sharma/p/book/9781032393032",
  },
  {
    type: "chapter",
    year: 2024,
    authors: "Fatima Jalid, Aravi Muzaffar",
    title: "Biological and Chemical Stability of Coatings",
    venue: "Magnesium Alloys for Biomedical Applications: Advances and Challenges",
    url: "https://www.routledge.com/Magnesium-Alloys-for-Biomedical-Applications-Advances-and-Challenges/Kumar-Ansari/p/book/9781032508818",
  },
  {
    type: "chapter",
    year: 2024,
    authors: "Aravi Muzaffar, Fatima Jalid",
    title:
      "Mechanical, chemical, fatigue, and biological compatible properties of Mg alloys",
    venue: "Magnesium Alloys for Biomedical Applications: Advances and Challenges",
    url: "https://www.routledge.com/Magnesium-Alloys-for-Biomedical-Applications-Advances-and-Challenges/Kumar-Ansari/p/book/9781032508818",
  },
  {
    type: "patent",
    year: 2023,
    authors: "Fatima Jalid and collaborators",
    title:
      "Electrodialytic purification and recovery of fermentation derived cyclic esters for catalytic upgrading",
    venue: "Indian Patent",
    details: "Patent no. 433616, granted 02 June 2023",
  },
];

export const publicationStats = [
  { value: "11", label: "Peer-reviewed papers" },
  { value: "03", label: "Book chapters" },
  { value: "01", label: "Granted patent" },
];
