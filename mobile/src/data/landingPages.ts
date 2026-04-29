export interface LandingPageMeta {
  slug: string;
  title: string;
  subtitle: string;
  category: 'delegate' | 'community';
  shareText: string;
  shareUrl: string;
}

export const landingPages: LandingPageMeta[] = [
  // Convention Delegate Pages
  {
    slug: 'delegate-overview',
    title: 'Delegate Overview',
    subtitle: "Kara's qualifications and why she's the right choice",
    category: 'delegate',
    shareText: "See why Kara Toone is the strongest candidate for Utah House District 14",
    shareUrl: 'https://kara.wickowaypoint.com/landing/delegate-overview.html',
  },
  {
    slug: 'delegate-education',
    title: 'Education & Schools',
    subtitle: '30+ years of education expertise for Davis County families',
    category: 'delegate',
    shareText: "Kara Toone's education platform — 30 years of experience for Utah families",
    shareUrl: 'https://kara.wickowaypoint.com/landing/delegate-education.html',
  },
  {
    slug: 'delegate-fiscal',
    title: 'Fiscal Responsibility',
    subtitle: 'Budget transparency and taxpayer accountability',
    category: 'delegate',
    shareText: "Kara Toone on fiscal responsibility — real budget experience, not just talk",
    shareUrl: 'https://kara.wickowaypoint.com/landing/delegate-fiscal.html',
  },
  {
    slug: 'delegate-growth',
    title: 'Growth & Infrastructure',
    subtitle: 'Managing Davis County growth responsibly',
    category: 'delegate',
    shareText: "How Kara Toone plans to manage Davis County's growth responsibly",
    shareUrl: 'https://kara.wickowaypoint.com/landing/delegate-growth.html',
  },
  {
    slug: 'delegate-housing',
    title: 'Housing Affordability',
    subtitle: 'Keeping homes attainable for Davis County families',
    category: 'delegate',
    shareText: "Kara Toone's plan for housing affordability in Davis County",
    shareUrl: 'https://kara.wickowaypoint.com/landing/delegate-housing.html',
  },
  {
    slug: 'delegate-public-safety',
    title: 'Public Safety',
    subtitle: 'Strong support for law enforcement and safe communities',
    category: 'delegate',
    shareText: "Kara Toone on public safety — standing with law enforcement, keeping communities safe",
    shareUrl: 'https://kara.wickowaypoint.com/landing/delegate-public-safety.html',
  },

  // Community & Constituent Pages
  {
    slug: 'meet-kara',
    title: 'Meet Kara',
    subtitle: 'Your neighbor for Utah House District 14',
    category: 'community',
    shareText: "Meet Kara Toone — your neighbor running for Utah House District 14",
    shareUrl: 'https://kara.wickowaypoint.com/landing/meet-kara.html',
  },
  {
    slug: 'parents',
    title: 'For Parents',
    subtitle: 'School funding, classroom support, and student success',
    category: 'community',
    shareText: "Kara Toone understands what parents need — education funding that works",
    shareUrl: 'https://kara.wickowaypoint.com/landing/parents.html',
  },
  {
    slug: 'homeowners',
    title: 'For Homeowners',
    subtitle: 'Protecting property values and keeping taxes fair',
    category: 'community',
    shareText: "Homeowners — see Kara Toone's plan for fair taxes and property protection",
    shareUrl: 'https://kara.wickowaypoint.com/landing/homeowners.html',
  },
  {
    slug: 'young-families',
    title: 'Young Families',
    subtitle: 'Affordable housing, great schools, and safe neighborhoods',
    category: 'community',
    shareText: "Young families in Davis County — Kara Toone is fighting for affordable housing and great schools",
    shareUrl: 'https://kara.wickowaypoint.com/landing/young-families.html',
  },
  {
    slug: 'veterans-first-responders',
    title: 'Veterans & First Responders',
    subtitle: 'Honoring service and supporting those who protect us',
    category: 'community',
    shareText: "Kara Toone stands with veterans and first responders in Davis County",
    shareUrl: 'https://kara.wickowaypoint.com/landing/veterans-first-responders.html',
  },
  {
    slug: 'community-roots',
    title: 'Community Roots',
    subtitle: '40 years in Davis County — deep community connections',
    category: 'community',
    shareText: "40 years in Davis County — Kara Toone's deep community roots make the difference",
    shareUrl: 'https://kara.wickowaypoint.com/landing/community-roots.html',
  },
];

export const delegatePages = landingPages.filter(p => p.category === 'delegate');
export const communityPages = landingPages.filter(p => p.category === 'community');
