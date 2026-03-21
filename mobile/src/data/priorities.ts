import type { PillarId } from '../config/brand';

export interface PillarStat {
  number: string;
  label: string;
  description: string;
}

export interface PillarSection {
  eyebrow: string;
  title: string;
  content: string;
}

export interface PillarSolution {
  icon: string;
  title: string;
  description: string;
}

export interface PillarQuote {
  quote: string;
  attribution: string;
}

export interface Pillar {
  id: PillarId;
  title: string;
  subtitle: string;
  heroImage: string;
  priorityNumber: number;
  overviewTitle: string;
  overviewContent: string;
  stats: PillarStat[];
  keyStat: PillarStat;
  sections: PillarSection[];
  solutions: PillarSolution[];
  policyCommitments: string[];
  quotes: PillarQuote[];
}

export const pillars: Pillar[] = [
  {
    id: 'growth',
    title: 'Growth & Infrastructure',
    subtitle: 'Managing sustainable growth while building the infrastructure our community needs',
    heroImage: 'https://media.kara.fosterlabs.org/Website%20Media%20(Organized)/01_Hero_Images/Hero_Growth.jpg',
    priorityNumber: 1,
    overviewTitle: 'The Challenge',
    overviewContent:
      'Davis County is experiencing unprecedented growth. Over the last decade, our population has grown by 25%, and the growth shows no signs of slowing. This is good news\u2014it reflects the appeal of our community and the opportunity it offers families. But without thoughtful planning and strategic infrastructure investment, rapid growth can overwhelm us.\n\nToday, Davis County faces a $4.2 billion infrastructure gap. Commute times have increased to an average of 34 minutes. Water and utility systems are strained. Roads are congested. Schools are overcrowded. The question isn\'t whether we\'ll grow\u2014it\'s whether we\'ll grow smartly, with the infrastructure and planning in place to handle that growth.',
    stats: [
      { number: '25%', label: 'Population Growth', description: "Davis County's growth rate over the past decade" },
      { number: '$4.2B', label: 'Infrastructure Gap', description: 'Estimated investment needed for roads, water, and utilities' },
      { number: '34 min', label: 'Average Commute', description: 'Current average commute time in Davis County' },
      { number: '90+', label: 'Schools', description: 'Managing growth in K-12 and higher education' },
    ],
    keyStat: { number: '25%', label: 'Population Growth', description: "Davis County's growth rate over the past decade" },
    sections: [
      {
        eyebrow: 'Smart Growth',
        title: 'Transportation and Roads',
        content:
          'A thriving county needs modern transportation infrastructure. Kara supports coordinated regional transportation planning, investment in public transit options, smart corridor management, pedestrian and bike infrastructure in growing communities, and strategic placement of new growth to minimize commute distances.',
      },
      {
        eyebrow: 'Essential Services',
        title: 'Water, Utilities, and Services',
        content:
          'Growth strains water and utility systems. Kara\'s approach includes working with Utah Division of Water Resources on long-term water security, coordinating with water districts on infrastructure investment, planning utility expansions concurrent with development, and investing in water conservation.',
      },
      {
        eyebrow: 'Thoughtful Development',
        title: 'Smart Growth and Community Character',
        content:
          'Not all growth is created equal. Kara believes the county should work with cities on comprehensive land use planning, encourage higher-density development near transit, preserve agricultural land and open space, support mixed-use development, and require developers to contribute to infrastructure needs.',
      },
    ],
    solutions: [
      { icon: '\uD83D\uDEE3\uFE0F', title: 'Transportation Infrastructure', description: 'Regional planning, transit investment, and smart corridor management to keep people moving' },
      { icon: '\uD83D\uDCA7', title: 'Water and Utilities', description: 'Proactive infrastructure investment and water security planning for long-term sustainability' },
      { icon: '\uD83C\uDFD8\uFE0F', title: 'Smart Growth Planning', description: 'Coordinated development patterns that create better communities while preserving character' },
      { icon: '\uD83E\uDD1D', title: 'Regional Coordination', description: 'Working with neighboring counties and the state on shared infrastructure challenges' },
    ],
    policyCommitments: [
      'Develop a comprehensive 20-year infrastructure plan for Davis County',
      'Support the I-15 expansion and coordinate regional transportation planning',
      'Invest in public transit options and pedestrian/bike infrastructure',
      'Work with water districts on long-term water security and conservation',
      'Ensure developer contributions match infrastructure demands from new growth',
      'Coordinate city and county planning to prevent sprawl and preserve open space',
      'Regularly update development impact studies to guide growth patterns',
      'Support workforce housing near jobs to reduce commute distances',
    ],
    quotes: [
      { quote: "Davis County's growth is an asset, but only if we manage it wisely. Smart infrastructure investment today ensures opportunity for our children tomorrow.", attribution: 'Kara Toone' },
      { quote: 'Growth without planning is chaos. We can have both growth and quality of life\u2014but only with leadership that thinks strategically.', attribution: 'Kara Toone' },
    ],
  },
  {
    id: 'housing',
    title: 'Housing',
    subtitle: 'Ensuring our children can afford to live in the communities they grew up in',
    heroImage: 'https://media.kara.fosterlabs.org/Website%20Media%20(Organized)/01_Hero_Images/Hero_Housing.jpg',
    priorityNumber: 2,
    overviewTitle: 'Why Housing Matters',
    overviewContent:
      "Housing isn't just a policy issue for Kara\u2014it's personal. Her oldest child asked: \"Can we stay here when I grow up, or will houses be too expensive?\"\n\nThe median home price has skyrocketed to $485,000\u2014a 38% increase in just five years. Young families can't afford to buy homes. Teachers, nurses, first responders, and small business owners are being priced out. The housing crisis isn't inevitable. It's a result of policy choices\u2014and it can be fixed with the right leadership.",
    stats: [
      { number: '$485K', label: 'Median Home Price', description: 'Current median home price in Davis County' },
      { number: '38%', label: 'Five-Year Increase', description: 'Median home price increase since 2020' },
      { number: '6.2x', label: 'Income Ratio', description: 'Home price to household income ratio (4x is considered affordable)' },
      { number: '72%', label: 'Lack of Workforce Housing', description: 'Percentage of new housing above median income requirements' },
    ],
    keyStat: { number: '$485K', label: 'Median Price', description: 'Current median home price in Davis County' },
    sections: [
      {
        eyebrow: 'Starter Homes',
        title: 'Enabling First-Time Homebuyers',
        content:
          'Young families need starter homes. Kara supports zoning changes that allow smaller-lot single-family homes, missing-middle housing (duplexes, townhomes), down payment assistance programs, community land trust models, and incentives for builders.',
      },
      {
        eyebrow: 'Developer Partnerships',
        title: 'Speeding Permitting and Reducing Development Costs',
        content:
          'Housing costs are driven partly by limited supply and restrictive permitting. Kara will streamline permitting, reduce development impact fees, coordinate between county and cities, support modular construction, and create incentive programs for workforce housing.',
      },
      {
        eyebrow: 'Local Control',
        title: 'Empowering Local Communities',
        content:
          'Housing policy works best when cities and the county work together. Kara believes in strong city-county coordination, supporting local control while encouraging housing diversity, and county support for cities taking on affordable housing projects.',
      },
      {
        eyebrow: 'Programs & Support',
        title: 'First-Time Buyer Assistance',
        content:
          'Market forces alone won\'t solve the affordability crisis. Kara supports first-time homebuyer down payment assistance, shared equity models, property tax relief for affordable rental housing, and financing assistance for in-fill development.',
      },
    ],
    solutions: [
      { icon: '\uD83C\uDFE0', title: 'Starter Home Zoning', description: 'Zoning changes that enable smaller, more affordable homes and missing-middle housing' },
      { icon: '\u26A1', title: 'Faster Permitting', description: 'Streamlined permitting and development review to reduce costs and timelines' },
      { icon: '\uD83E\uDD1D', title: 'Local Partnerships', description: 'County support for cities implementing workforce housing solutions' },
      { icon: '\uD83D\uDCB0', title: 'First-Time Buyer Help', description: 'Down payment assistance and financing programs for first-time homebuyers' },
    ],
    policyCommitments: [
      'Support zoning for missing-middle housing (duplexes, townhomes, small apartments)',
      'Streamline permitting while maintaining quality and neighborhood compatibility',
      'Create first-time homebuyer assistance programs through county resources',
      'Establish community land trusts to keep homes affordable permanently',
      'Encourage developers to include workforce housing in new projects',
      'Coordinate city-county housing policy to ensure regional coherence',
      'Reduce development impact fees where feasible to lower housing costs',
      'Support property tax relief for affordable rental housing',
      'Invest in infill development and redevelopment of underutilized land',
    ],
    quotes: [
      { quote: "A community where young families can't afford to stay is a community losing its future. We need to fix the housing crisis now.", attribution: 'Kara Toone' },
      { quote: "Housing affordability isn't about charity\u2014it's about keeping our workforce, maintaining neighborhood stability, and building the Utah County we want our children to inherit.", attribution: 'Kara Toone' },
    ],
  },
  {
    id: 'safety',
    title: 'Public Safety',
    subtitle: 'Supporting those who keep us safe and addressing root causes of crime',
    heroImage: 'https://media.kara.fosterlabs.org/Website%20Media%20(Organized)/01_Hero_Images/Hero_Safety.jpg',
    priorityNumber: 3,
    overviewTitle: 'The Challenge',
    overviewContent:
      'Public safety is the foundation of a healthy community. Today, Davis County faces a critical law enforcement crisis. Police departments are struggling with officer recruitment and retention. Many experienced officers are leaving. New recruits struggle with PTSD at alarming rates. 911 response times are increasing and officer morale is declining.\n\nThis demands real solutions\u2014better pay, mental health support, equipment investment, and community partnership.',
    stats: [
      { number: '18%', label: 'Police Vacancy Rate', description: 'Current vacancy rate in Davis County law enforcement' },
      { number: '30%', label: 'PTSD Rate', description: 'Officers diagnosed with PTSD in the region' },
      { number: '#1', label: 'Top Community Concern', description: 'Public safety is the #1 concern for Davis County residents' },
      { number: '\u2191 35%', label: 'Response Time Increase', description: 'Increase in 911 response times due to staffing shortages' },
    ],
    keyStat: { number: '18%', label: 'Police Vacancy', description: 'Current vacancy rate in Davis County law enforcement' },
    sections: [
      {
        eyebrow: 'Supporting Officers',
        title: 'Recruitment, Retention, and Compensation',
        content:
          'We can\'t have public safety without police officers. Kara supports county salary supplements, sign-on bonuses for experienced officers, tuition reimbursement, equipment investment, community liaison roles, and career advancement pathways.',
      },
      {
        eyebrow: 'Mental Health Crisis',
        title: 'Supporting First Responder Mental Health',
        content:
          'Thirty percent of officers struggle with PTSD. Kara\'s approach includes comprehensive mental health services for law enforcement, peer support programs, mandatory mental health check-ins, crisis intervention teams, and family support services.',
      },
      {
        eyebrow: 'Community Policing',
        title: 'Building Trust and Partnership',
        content:
          'Public safety works best when law enforcement and communities work together. Kara supports community liaison officers, regular community meetings, training in de-escalation and implicit bias, accountability measures, and youth engagement programs.',
      },
      {
        eyebrow: 'Root Causes',
        title: 'Addressing Drug Addiction and Prevention',
        content:
          'Crime often stems from addiction, mental health challenges, and lack of opportunity. Kara supports treatment programs, youth prevention programs, mental health services, coordination between law enforcement and social services, and reentry programs.',
      },
    ],
    solutions: [
      { icon: '\uD83D\uDC6E', title: 'Officer Recruitment & Retention', description: 'Competitive pay, equipment, and career advancement to attract the best officers' },
      { icon: '\uD83E\uDDE0', title: 'Mental Health Support', description: 'Comprehensive mental health services and peer support for first responders' },
      { icon: '\uD83E\uDD1D', title: 'Community Policing', description: 'Building trust and partnership between law enforcement and neighborhoods' },
      { icon: '\uD83D\uDEE1\uFE0F', title: 'Prevention & Treatment', description: 'Addressing drug addiction and root causes of crime through proven programs' },
    ],
    policyCommitments: [
      'Support county salary supplements to make police compensation competitive',
      'Provide sign-on bonuses and retention incentives for experienced officers',
      'Expand mental health services specifically designed for law enforcement',
      'Establish peer support teams to address officer PTSD and suicide crisis',
      'Invest in training for de-escalation, community engagement, and implicit bias',
      'Support community liaison officers in all major neighborhoods',
      'Coordinate with courts and social services on addiction treatment',
      'Fund youth prevention and mentorship programs',
      'Ensure transparent reporting on police activities and outcomes',
      'Support reentry programs that reduce recidivism',
    ],
    quotes: [
      { quote: 'We ask our police officers to run toward danger while the rest of us run away. The least we can do is support them with competitive pay, mental health services, and community partnership.', attribution: 'Kara Toone' },
      { quote: "Public safety isn't just enforcement\u2014it's prevention, treatment, community trust, and supporting the heroes who keep us safe.", attribution: 'Kara Toone' },
    ],
  },
  {
    id: 'education',
    title: 'Education',
    subtitle: "Investing in quality schools and the teachers who shape our children's futures",
    heroImage: 'https://media.kara.fosterlabs.org/Website%20Media%20(Organized)/01_Hero_Images/Hero_Education.jpg',
    priorityNumber: 4,
    overviewTitle: "Education is Kara's Passion",
    overviewContent:
      "For over a decade, Kara has worked directly in Davis County education as an executive at the Davis County Education Foundation. She knows our 72,000+ students, our 90+ schools, and our 5,000+ educators.\n\nEducation is the most important function of local government. Children who receive a great education are healthier, earn more, and build stronger families and communities. Yet our schools are underfunded. Teachers struggle with stagnant salaries. Schools lack modern facilities. Kara believes investing in education is the best investment any county can make.",
    stats: [
      { number: '72,000+', label: 'Students', description: 'K-12 students in Davis County schools' },
      { number: '90+', label: 'Schools', description: 'Public schools across Davis County' },
      { number: '5,000+', label: 'Educators', description: 'Teachers and support staff' },
      { number: '\u2191 12%', label: 'Growth Since 2015', description: 'Student population growth outpacing funding increases' },
    ],
    keyStat: { number: '72K+', label: 'Students', description: 'K-12 students in Davis County schools' },
    sections: [
      {
        eyebrow: "Kara's Foundation",
        title: 'Davis County Education Foundation Leadership',
        content:
          "Kara's role at the Davis County Education Foundation has given her deep insight into schools. She has built relationships with every school administrator, funded classroom grants, supported teacher professional development, and worked with schools on equity and access.",
      },
      {
        eyebrow: 'Funding and Accountability',
        title: 'Adequate School Funding and Financial Transparency',
        content:
          'Schools need adequate funding to thrive. Kara supports county funding for school priorities, transparent budgeting, capital facility improvements, early childhood programs, special education funding, and programs for English language learners.',
      },
      {
        eyebrow: 'Students and Families',
        title: 'Student Success and Family Support',
        content:
          'Great schools serve whole students and families. Kara supports mental health services, after-school and summer programs, family engagement, career and technical education, college planning support, and programs addressing food insecurity.',
      },
      {
        eyebrow: 'Teachers and Staff',
        title: 'Supporting Educators',
        content:
          'Teachers are the foundation of great schools. Kara supports competitive teacher salaries, professional development, career advancement, reducing class sizes, supporting school staff, and working conditions that let teachers focus on teaching.',
      },
      {
        eyebrow: 'Equity and Excellence',
        title: 'Closing Achievement Gaps',
        content:
          'All students deserve a quality education regardless of background. Kara supports additional resources for lower-income schools, diverse and inclusive curriculum, support for students with disabilities, culturally responsive teaching, and regular monitoring of equity outcomes.',
      },
    ],
    solutions: [
      { icon: '\uD83D\uDCB0', title: 'Adequate Funding', description: 'County investment in school priorities and capital facility improvements' },
      { icon: '\uD83D\uDC68\u200D\uD83C\uDFEB', title: 'Support Educators', description: 'Competitive salaries, professional development, and working conditions' },
      { icon: '\uD83D\uDC68\u200D\uD83D\uDC67\u200D\uD83D\uDC66', title: 'Family Engagement', description: 'Programs that support students, families, and parent involvement' },
      { icon: '\uD83C\uDF93', title: 'Equity & Excellence', description: 'Closing achievement gaps and ensuring quality education for all students' },
    ],
    policyCommitments: [
      'Allocate county resources to support school-identified priorities and capital projects',
      'Ensure transparent accounting of all education funding and outcomes',
      'Support competitive teacher salaries and professional development',
      'Invest in mental health services and student wellness programs',
      'Fund after-school and summer programs that keep students engaged',
      'Support career and technical education programs',
      'Advocate for adequate state and federal school funding',
      'Work with schools on programs addressing achievement gaps',
      'Support family engagement and parent involvement initiatives',
      'Ensure schools have modern facilities, technology, and resources',
    ],
    quotes: [
      { quote: "I've worked in Davis County education for over a decade. I know our schools. I know our teachers. And I know we can do better. Our children deserve nothing less than excellent schools and support.", attribution: 'Kara Toone' },
      { quote: 'Education is the foundation of everything. Great schools create great communities. Investing in education is the best investment we can make.', attribution: 'Kara Toone' },
    ],
  },
  {
    id: 'fiscal',
    title: 'Fiscal Responsibility',
    subtitle: 'Transparent government and stewardship of taxpayer resources',
    heroImage: 'https://media.kara.fosterlabs.org/Website%20Media%20(Organized)/01_Hero_Images/Hero_Fiscal.jpg',
    priorityNumber: 5,
    overviewTitle: 'Taxpayers Deserve Better',
    overviewContent:
      'Taxpayers in Davis County work hard for their money. They deserve a government that respects that sacrifice\u2014a government that spends wisely, is transparent about how money is spent, and eliminates waste.\n\nKara believes in 100% transparency in government spending, zero waste and maximum efficiency, and local communities\u2014not distant bureaucrats\u2014controlling resources and making decisions about priorities. Fiscal responsibility is foundational to good government.',
    stats: [
      { number: '100%', label: 'Transparency Target', description: 'Goal for public access to government spending data' },
      { number: '$0', label: 'Waste Goal', description: 'Commitment to identifying and eliminating wasteful spending' },
      { number: '\u2191 15%', label: 'Unfunded Mandates', description: 'State mandates without adequate funding create county budget stress' },
      { number: 'Local', label: 'Control', description: 'Communities should decide priorities, not distant government' },
    ],
    keyStat: { number: '100%', label: 'Transparency', description: 'Goal for public access to government spending data' },
    sections: [
      {
        eyebrow: 'Transparency',
        title: '100% Government Spending Transparency',
        content:
          'Government budgets should be open books. Kara\'s commitment includes simple understandable budget documents online, regular public reporting, clear justification for major expenditures, whistleblower protections, annual performance reports, and public databases of contracts.',
      },
      {
        eyebrow: 'Efficiency',
        title: 'Eliminating Waste and Government Efficiency',
        content:
          'Government should operate efficiently. Kara supports regular audits, performance-based budgeting, program reviews, competitive bidding, technology investment, shared services, and zero-based budgeting reviews.',
      },
      {
        eyebrow: 'Local Control',
        title: 'Local Communities Making Local Decisions',
        content:
          'Communities have different needs. Kara believes county government should defer to city governments where appropriate, give communities a voice, protect local authority, and ensure community input processes are genuine and influential.',
      },
      {
        eyebrow: 'Partnership',
        title: 'Government-Community Partnership',
        content:
          'The best solutions come from government, business, nonprofit, and community working together. Kara supports public-private partnerships, county support for nonprofits, business-friendly policies, and diverse voices in government.',
      },
      {
        eyebrow: 'Unfunded Mandates',
        title: 'Pushing Back on Unfunded State and Federal Mandates',
        content:
          'State and federal governments often impose requirements without funding them. Kara believes requirements should include funding, counties should have flexibility, unfunded mandates should be challenged, and local solutions should be preferred.',
      },
    ],
    solutions: [
      { icon: '\uD83D\uDC41\uFE0F', title: 'Government Transparency', description: '100% public access to spending data and government decision-making' },
      { icon: '\u2699\uFE0F', title: 'Operational Efficiency', description: 'Eliminating waste and getting maximum value from every tax dollar' },
      { icon: '\uD83C\uDFD8\uFE0F', title: 'Local Control', description: 'Communities making decisions that affect them, with real influence' },
      { icon: '\uD83E\uDD1D', title: 'Community Partnership', description: 'Government enabling and supporting community-led solutions' },
    ],
    policyCommitments: [
      'Provide 100% public access to county spending data and budgets',
      'Publish annual performance reports showing results for each program',
      'Conduct regular audits to identify and eliminate waste',
      'Implement performance-based budgeting tied to measurable outcomes',
      'Hold competitive bidding for all county contracts',
      'Establish whistleblower protections for reporting waste or fraud',
      'Support technology investment that reduces administrative burden',
      'Pursue shared services between departments and with other jurisdictions',
      'Defer to city governments where appropriate for local decisions',
      'Challenge unfunded state and federal mandates',
      'Work with business and nonprofit sectors on solutions',
      'Ensure diverse community representation in decision-making',
    ],
    quotes: [
      { quote: 'Taxpayers work hard for their money. Government should respect that by spending wisely, eliminating waste, and being completely transparent about how resources are used.', attribution: 'Kara Toone' },
      { quote: "Fiscal responsibility isn't about cutting services\u2014it's about getting the most value from every dollar so we can invest more in what matters to our communities.", attribution: 'Kara Toone' },
      { quote: 'Local communities understand their own challenges better than distant government. Fiscal responsibility means trusting communities to make decisions about their own priorities.', attribution: 'Kara Toone' },
    ],
  },
];

export function getPillar(id: string): Pillar | undefined {
  return pillars.find((p) => p.id === id);
}

export function getPillarsSorted(): Pillar[] {
  return [...pillars].sort((a, b) => a.priorityNumber - b.priorityNumber);
}
