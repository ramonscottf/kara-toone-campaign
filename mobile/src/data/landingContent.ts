/**
 * Structured landing page content for native rendering.
 * This is the same content as the HTML landing pages but in structured form
 * so React Native can render it natively (no WebView).
 */

export interface LandingSection {
  type: 'hero' | 'facts' | 'stats' | 'highlights' | 'comparison' | 'quote' | 'cta';
}

export interface HeroSection extends LandingSection {
  type: 'hero';
  eyebrow: string;
  title: string;
  titleEmphasis?: string;
  subtitle: string;
  badge?: string;
}

export interface FactsSection extends LandingSection {
  type: 'facts';
  items: { icon: string; text: string }[];
}

export interface StatsSection extends LandingSection {
  type: 'stats';
  items: { number: string; label: string; color: 'navy' | 'red' | 'gold' }[];
}

export interface HighlightsSection extends LandingSection {
  type: 'highlights';
  title: string;
  items: { icon: string; title: string; description: string; color: 'navy' | 'red' | 'gold' }[];
}

export interface ComparisonSection extends LandingSection {
  type: 'comparison';
  title: string;
  leftLabel: string;
  rightLabel: string;
  rows: { label: string; left: boolean; right: boolean }[];
}

export interface QuoteSection extends LandingSection {
  type: 'quote';
  text: string;
  attribution: string;
}

export interface CTASection extends LandingSection {
  type: 'cta';
  shareButtonText: string;
}

export type PageSection =
  | HeroSection
  | FactsSection
  | StatsSection
  | HighlightsSection
  | ComparisonSection
  | QuoteSection
  | CTASection;

export interface LandingPageContent {
  slug: string;
  sections: PageSection[];
}

// Content for each landing page
export const landingContent: Record<string, LandingPageContent> = {
  'meet-kara': {
    slug: 'meet-kara',
    sections: [
      {
        type: 'hero',
        eyebrow: 'Your Neighbor',
        title: 'Meet Kara Toone',
        subtitle: 'A lifelong Davis County resident, mother, grandmother, and 30-year education leader running for Utah House District 14.',
        badge: 'HD-14',
      },
      {
        type: 'facts',
        items: [
          { icon: '📍', text: '40+ Years in Davis County' },
          { icon: '👨‍👩‍👧‍👦', text: 'Mother & Grandmother' },
          { icon: '🎓', text: '30+ Years in Education' },
          { icon: '🏛️', text: 'Community Leader' },
        ],
      },
      {
        type: 'stats',
        items: [
          { number: '40+', label: 'Years in Davis County', color: 'navy' },
          { number: '30+', label: 'Years in Education', color: 'red' },
          { number: '73K+', label: 'Students Served', color: 'gold' },
          { number: '14', label: 'House District', color: 'navy' },
        ],
      },
      {
        type: 'highlights',
        title: "Why Kara's Running",
        items: [
          { icon: '🏫', title: 'Education Champion', description: 'Three decades of hands-on education leadership — from classroom teacher to district administrator.', color: 'red' },
          { icon: '💰', title: 'Fiscal Steward', description: 'Managed multi-million dollar school budgets with transparency and accountability.', color: 'navy' },
          { icon: '🏘️', title: 'Community Builder', description: 'Deep roots in Davis County with relationships spanning every neighborhood.', color: 'gold' },
          { icon: '👮', title: 'Public Safety Advocate', description: 'Strong supporter of law enforcement and community policing.', color: 'red' },
          { icon: '🏠', title: 'Housing Champion', description: 'Practical solutions for keeping homes attainable in Davis County.', color: 'navy' },
        ],
      },
      {
        type: 'quote',
        text: "I'm not a politician — I'm your neighbor. I've spent my career serving Davis County families, and I'm ready to take that experience to the State House.",
        attribution: 'Kara Toone',
      },
      {
        type: 'cta',
        shareButtonText: 'Share with a Neighbor',
      },
    ],
  },

  'delegate-overview': {
    slug: 'delegate-overview',
    sections: [
      {
        type: 'hero',
        eyebrow: 'Convention Delegates',
        title: 'The Clear Choice',
        titleEmphasis: 'Clear Choice',
        subtitle: 'Why Kara Toone is the strongest, most qualified candidate for Utah House District 14.',
        badge: 'Delegate Brief',
      },
      {
        type: 'facts',
        items: [
          { icon: '✅', text: 'Lifelong Republican' },
          { icon: '📊', text: 'Budget Experience' },
          { icon: '🎓', text: 'Education Expert' },
          { icon: '🤝', text: 'Consensus Builder' },
        ],
      },
      {
        type: 'stats',
        items: [
          { number: '40+', label: 'Years in District', color: 'navy' },
          { number: '30+', label: 'Years Public Service', color: 'red' },
          { number: '$50M+', label: 'Budgets Managed', color: 'gold' },
          { number: '100%', label: 'Conservative Values', color: 'navy' },
        ],
      },
      {
        type: 'highlights',
        title: 'Delegate Talking Points',
        items: [
          { icon: '🏛️', title: 'Proven Conservative', description: 'Lifelong Republican with a track record of fiscal conservatism and limited government principles.', color: 'navy' },
          { icon: '📋', title: 'Real Experience', description: "Not a career politician — decades of actual management and leadership experience.", color: 'red' },
          { icon: '🗳️', title: 'Electable', description: 'Broad community appeal with deep personal connections across every precinct in HD-14.', color: 'gold' },
          { icon: '💪', title: 'Ready Day One', description: 'Education, budget, and infrastructure expertise means immediate effectiveness on the Hill.', color: 'navy' },
        ],
      },
      {
        type: 'quote',
        text: "I ask for your vote not as a politician, but as a neighbor who has spent her entire career serving our community. I'm ready to bring that same dedication to the State House.",
        attribution: 'Kara Toone',
      },
      {
        type: 'cta',
        shareButtonText: 'Share This Page',
      },
    ],
  },

  'delegate-education': {
    slug: 'delegate-education',
    sections: [
      {
        type: 'hero',
        eyebrow: 'Policy Focus',
        title: 'Education & Schools',
        subtitle: "Three decades of education leadership. Kara knows Utah's schools from the inside.",
        badge: 'Education',
      },
      {
        type: 'stats',
        items: [
          { number: '73K+', label: 'Students Served', color: 'navy' },
          { number: '30+', label: 'Years in Education', color: 'red' },
          { number: '#1', label: 'Priority', color: 'gold' },
          { number: '$50M+', label: 'Education Budgets', color: 'navy' },
        ],
      },
      {
        type: 'highlights',
        title: "Kara's Education Platform",
        items: [
          { icon: '📚', title: 'Funding That Works', description: 'Advocate for per-student funding that actually reaches classrooms, not bureaucracy.', color: 'red' },
          { icon: '👩‍🏫', title: 'Teacher Support', description: 'Competitive pay and reduced mandates so teachers can focus on teaching.', color: 'navy' },
          { icon: '👨‍👩‍👧', title: 'Parental Rights', description: 'Parents are the primary stakeholders in their children\'s education.', color: 'gold' },
          { icon: '🔧', title: 'Career Pathways', description: 'Expand CTE and vocational programs for students who choose non-college paths.', color: 'red' },
        ],
      },
      {
        type: 'quote',
        text: "Education isn't just a line item in a budget — it's the foundation of our community's future. I've spent 30 years making sure every dollar invested in our kids counts.",
        attribution: 'Kara Toone',
      },
      { type: 'cta', shareButtonText: 'Share Education Platform' },
    ],
  },

  'delegate-fiscal': {
    slug: 'delegate-fiscal',
    sections: [
      {
        type: 'hero',
        eyebrow: 'Policy Focus',
        title: 'Fiscal Responsibility',
        subtitle: 'Real budget experience, not just campaign promises.',
        badge: 'Fiscal',
      },
      {
        type: 'stats',
        items: [
          { number: '$50M+', label: 'Budgets Managed', color: 'navy' },
          { number: '30+', label: 'Years of Stewardship', color: 'red' },
          { number: '0', label: 'Budget Deficits', color: 'gold' },
          { number: '100%', label: 'Accountability', color: 'navy' },
        ],
      },
      {
        type: 'highlights',
        title: 'Fiscal Platform',
        items: [
          { icon: '💰', title: 'Budget Transparency', description: 'Every tax dollar accounted for. Public dashboards for state spending.', color: 'navy' },
          { icon: '📉', title: 'Tax Relief', description: 'Keep taxes low while maintaining essential services.', color: 'red' },
          { icon: '🏛️', title: 'Limited Government', description: 'Government should do less, better. Cut waste, not services.', color: 'gold' },
          { icon: '📊', title: 'Data-Driven', description: 'Policy decisions backed by data, not political pressure.', color: 'navy' },
        ],
      },
      {
        type: 'quote',
        text: "I've balanced multi-million dollar budgets for decades. I know the difference between a want and a need, and I'll bring that discipline to the State House.",
        attribution: 'Kara Toone',
      },
      { type: 'cta', shareButtonText: 'Share Fiscal Platform' },
    ],
  },

  'delegate-growth': {
    slug: 'delegate-growth',
    sections: [
      {
        type: 'hero',
        eyebrow: 'Policy Focus',
        title: 'Growth & Infrastructure',
        subtitle: "Davis County is growing. Let's manage it right.",
        badge: 'Growth',
      },
      {
        type: 'stats',
        items: [
          { number: '370K+', label: 'County Population', color: 'navy' },
          { number: '15%', label: 'Growth Rate', color: 'red' },
          { number: '40+', label: "Kara's Years Here", color: 'gold' },
          { number: '#1', label: 'Fastest Growing', color: 'navy' },
        ],
      },
      {
        type: 'highlights',
        title: 'Growth Platform',
        items: [
          { icon: '🛣️', title: 'Transportation', description: 'Infrastructure that keeps pace with growth. Smart highway and transit investments.', color: 'navy' },
          { icon: '🏗️', title: 'Smart Development', description: 'Growth should enhance communities, not overwhelm them.', color: 'red' },
          { icon: '💧', title: 'Water & Resources', description: 'Sustainable resource planning for our growing population.', color: 'gold' },
          { icon: '🌳', title: 'Quality of Life', description: 'Preserve the character that makes Davis County special.', color: 'navy' },
        ],
      },
      {
        type: 'quote',
        text: "I've watched Davis County grow for 40 years. Growth is inevitable — but how we manage it is a choice. I choose smart, sustainable growth that keeps our community strong.",
        attribution: 'Kara Toone',
      },
      { type: 'cta', shareButtonText: 'Share Growth Platform' },
    ],
  },

  'delegate-housing': {
    slug: 'delegate-housing',
    sections: [
      {
        type: 'hero',
        eyebrow: 'Policy Focus',
        title: 'Housing Affordability',
        subtitle: 'Keeping the American Dream alive in Davis County.',
        badge: 'Housing',
      },
      {
        type: 'stats',
        items: [
          { number: '$500K+', label: 'Avg Home Price', color: 'navy' },
          { number: '45%', label: 'Price Increase 5yr', color: 'red' },
          { number: '2,500+', label: 'New Units Needed/yr', color: 'gold' },
          { number: '35%', label: "Can't Afford Median", color: 'navy' },
        ],
      },
      {
        type: 'highlights',
        title: 'Housing Platform',
        items: [
          { icon: '🏠', title: 'First-Time Buyers', description: 'Expand programs that help young families buy their first home.', color: 'red' },
          { icon: '📋', title: 'Zoning Reform', description: 'Reduce red tape that drives up construction costs.', color: 'navy' },
          { icon: '🏘️', title: 'Missing Middle', description: 'More townhomes and duplexes — options between apartments and McMansions.', color: 'gold' },
          { icon: '👴', title: 'Aging in Place', description: 'Help seniors stay in their communities with accessible housing options.', color: 'navy' },
        ],
      },
      {
        type: 'quote',
        text: "Every family in Davis County deserves a place to call home. I'll fight for policies that make that possible without sacrificing the neighborhoods we love.",
        attribution: 'Kara Toone',
      },
      { type: 'cta', shareButtonText: 'Share Housing Platform' },
    ],
  },

  'delegate-public-safety': {
    slug: 'delegate-public-safety',
    sections: [
      {
        type: 'hero',
        eyebrow: 'Policy Focus',
        title: 'Public Safety',
        subtitle: 'Standing with law enforcement. Keeping communities safe.',
        badge: 'Safety',
      },
      {
        type: 'stats',
        items: [
          { number: '100%', label: 'Back the Blue', color: 'navy' },
          { number: 'Top 10', label: 'Safest State', color: 'red' },
          { number: '24/7', label: 'Community Policing', color: 'gold' },
          { number: '0', label: 'Defund Tolerance', color: 'navy' },
        ],
      },
      {
        type: 'highlights',
        title: 'Safety Platform',
        items: [
          { icon: '👮', title: 'Law Enforcement Support', description: 'Full funding, competitive pay, and respect for the men and women in uniform.', color: 'navy' },
          { icon: '🚔', title: 'Community Policing', description: 'Officers embedded in neighborhoods building trust and relationships.', color: 'red' },
          { icon: '⚖️', title: 'Tough on Crime', description: 'Enforce existing laws. No revolving door for repeat offenders.', color: 'gold' },
          { icon: '🏥', title: 'Mental Health Response', description: 'Better crisis intervention so officers can focus on crime.', color: 'navy' },
        ],
      },
      {
        type: 'quote',
        text: "Our first responders run toward danger so we don't have to. They deserve our full support — not just words, but funding, resources, and respect.",
        attribution: 'Kara Toone',
      },
      { type: 'cta', shareButtonText: 'Share Safety Platform' },
    ],
  },

  'parents': {
    slug: 'parents',
    sections: [
      {
        type: 'hero',
        eyebrow: 'For Parents',
        title: 'Your Kids Deserve Better',
        subtitle: "Kara's spent 30 years fighting for your students. Now she's taking that fight to the Capitol.",
        badge: 'Parents',
      },
      {
        type: 'stats',
        items: [
          { number: '73K+', label: 'Students Served', color: 'navy' },
          { number: '#46', label: 'UT Per-Student Rank', color: 'red' },
          { number: '$4,400', label: 'Below Nat. Avg', color: 'gold' },
          { number: '30+', label: 'Years in Schools', color: 'navy' },
        ],
      },
      {
        type: 'highlights',
        title: 'For Your Family',
        items: [
          { icon: '💵', title: 'More Funding, Less Waste', description: 'Fight for per-student funding that actually reaches your child\'s classroom.', color: 'red' },
          { icon: '👩‍🏫', title: 'Great Teachers', description: 'Competitive teacher pay so the best educators stay in Davis County.', color: 'navy' },
          { icon: '📖', title: 'Parental Voice', description: 'You know your child best. Kara will protect parental rights in education decisions.', color: 'gold' },
          { icon: '🛡️', title: 'Safe Schools', description: 'Every child deserves to feel safe at school, every day.', color: 'navy' },
        ],
      },
      {
        type: 'quote',
        text: "As a mother, grandmother, and educator, I've seen both sides — the parent worried about their child and the teacher doing everything they can. I'll bring both perspectives to the Capitol.",
        attribution: 'Kara Toone',
      },
      { type: 'cta', shareButtonText: 'Share with Parents' },
    ],
  },

  'homeowners': {
    slug: 'homeowners',
    sections: [
      {
        type: 'hero',
        eyebrow: 'For Homeowners',
        title: 'Protecting Your Investment',
        subtitle: 'Fair taxes, strong neighborhoods, and a voice for property owners at the Capitol.',
        badge: 'Homeowners',
      },
      {
        type: 'stats',
        items: [
          { number: '$500K+', label: 'Avg Home Value', color: 'navy' },
          { number: '45%', label: 'Value Increase', color: 'red' },
          { number: '40+', label: "Kara's Years Here", color: 'gold' },
          { number: '100%', label: 'Homeowner Advocate', color: 'navy' },
        ],
      },
      {
        type: 'highlights',
        title: "Kara's Promise to Homeowners",
        items: [
          { icon: '🏠', title: 'Property Tax Reform', description: 'Keep property taxes fair as home values rise. No taxation without representation.', color: 'navy' },
          { icon: '🏘️', title: 'Neighborhood Protection', description: 'Sensible zoning that preserves the character of established neighborhoods.', color: 'red' },
          { icon: '📈', title: 'Value Protection', description: "Smart community investments that maintain and grow your home's value.", color: 'gold' },
          { icon: '🌳', title: 'Quality of Life', description: 'Parks, trails, and community spaces that make Davis County special.', color: 'navy' },
        ],
      },
      {
        type: 'quote',
        text: "Your home is more than an investment — it's where your family grows and your memories are made. I'll protect it at the Capitol.",
        attribution: 'Kara Toone',
      },
      { type: 'cta', shareButtonText: 'Share with Neighbors' },
    ],
  },

  'young-families': {
    slug: 'young-families',
    sections: [
      {
        type: 'hero',
        eyebrow: 'For Young Families',
        title: 'Building Your Future Here',
        subtitle: 'Affordable homes, great schools, and safe neighborhoods — everything your family needs.',
        badge: 'Families',
      },
      {
        type: 'stats',
        items: [
          { number: '3.4', label: 'Avg Family Size', color: 'navy' },
          { number: '35%', label: "Can't Afford Median", color: 'red' },
          { number: 'A+', label: 'School Rating', color: 'gold' },
          { number: '#1', label: 'Family-Friendly', color: 'navy' },
        ],
      },
      {
        type: 'highlights',
        title: 'For Your Growing Family',
        items: [
          { icon: '🏠', title: 'Affordable Housing', description: 'Expand first-time homebuyer programs and reduce barriers to homeownership.', color: 'red' },
          { icon: '🎓', title: 'Great Schools', description: 'Fight for funding that gives your kids the education they deserve.', color: 'navy' },
          { icon: '🛡️', title: 'Safe Neighborhoods', description: 'Support law enforcement and community programs that keep your family safe.', color: 'gold' },
          { icon: '🌳', title: 'Family Activities', description: 'Parks, recreation, and community spaces for your growing family.', color: 'navy' },
        ],
      },
      {
        type: 'quote',
        text: "I raised my family in Davis County and I want every young family to have that same opportunity. I'll fight to make that possible.",
        attribution: 'Kara Toone',
      },
      { type: 'cta', shareButtonText: 'Share with Young Families' },
    ],
  },

  'veterans-first-responders': {
    slug: 'veterans-first-responders',
    sections: [
      {
        type: 'hero',
        eyebrow: 'Veterans & First Responders',
        title: 'Honoring Your Service',
        subtitle: 'You answered the call. Now Kara will answer yours.',
        badge: 'Service',
      },
      {
        type: 'stats',
        items: [
          { number: '100%', label: 'Support', color: 'navy' },
          { number: '30K+', label: 'UT Veterans', color: 'red' },
          { number: '24/7', label: 'First Responders', color: 'gold' },
          { number: '0', label: 'Defund Tolerance', color: 'navy' },
        ],
      },
      {
        type: 'highlights',
        title: "Kara's Commitment",
        items: [
          { icon: '🎖️', title: 'Veteran Benefits', description: 'Protect and expand state veteran benefits — healthcare, education, and employment.', color: 'navy' },
          { icon: '👮', title: 'First Responder Pay', description: 'Competitive compensation for police, fire, and EMS professionals.', color: 'red' },
          { icon: '🏥', title: 'Mental Health', description: 'Expanded mental health resources for those who serve.', color: 'gold' },
          { icon: '🤝', title: 'Transition Support', description: 'Help veterans transition to civilian careers with skills and training programs.', color: 'navy' },
        ],
      },
      {
        type: 'quote',
        text: "Our veterans and first responders don't just deserve our gratitude — they deserve a legislator who will fight for their benefits, their families, and their futures.",
        attribution: 'Kara Toone',
      },
      { type: 'cta', shareButtonText: 'Share with a Veteran' },
    ],
  },

  'community-roots': {
    slug: 'community-roots',
    sections: [
      {
        type: 'hero',
        eyebrow: 'Davis County',
        title: 'Deep Community Roots',
        subtitle: "40 years in Davis County. Kara isn't just running here — she lives here, raised her family here, and serves here.",
        badge: 'Roots',
      },
      {
        type: 'facts',
        items: [
          { icon: '📍', text: '40+ Years in Davis County' },
          { icon: '🏫', text: 'Davis School District' },
          { icon: '⛪', text: 'Community Service' },
          { icon: '👨‍👩‍👧‍👦', text: 'Family Legacy' },
        ],
      },
      {
        type: 'stats',
        items: [
          { number: '40+', label: 'Years in Davis Co.', color: 'navy' },
          { number: '3', label: 'Generations Here', color: 'red' },
          { number: '1000s', label: 'Families Served', color: 'gold' },
          { number: '100%', label: 'Committed', color: 'navy' },
        ],
      },
      {
        type: 'highlights',
        title: "Kara's Davis County Story",
        items: [
          { icon: '🏠', title: 'Lifelong Resident', description: 'Raised her family right here in the heart of Davis County.', color: 'navy' },
          { icon: '🎓', title: 'Educator & Mentor', description: "Served thousands of students and families through Davis School District.", color: 'red' },
          { icon: '🤝', title: 'Community Volunteer', description: 'Active in local organizations, service groups, and neighborhood associations.', color: 'gold' },
          { icon: '❤️', title: 'Loves This Place', description: "Davis County isn't just where Kara lives — it's who she is.", color: 'red' },
        ],
      },
      {
        type: 'quote',
        text: "This is my home. These are my neighbors. When I go to the Capitol, I'm not leaving Davis County — I'm taking it with me.",
        attribution: 'Kara Toone',
      },
      { type: 'cta', shareButtonText: 'Share This Story' },
    ],
  },
};
