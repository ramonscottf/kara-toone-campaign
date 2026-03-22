/**
 * White-label brand configuration.
 * Swap this file to reskin the entire app for any campaign client.
 */

const MEDIA_BASE = 'https://media.kara.fosterlabs.org/Website%20Media%20(Organized)';

export const brand = {
  candidateName: 'Kara Toone',
  campaignTitle: 'Kara Toone for Utah House District 14',
  tagline: 'Lifelong Davis County resident. Education leader. Community builder.',
  district: 'Utah House District 14',
  logoUrl: `${MEDIA_BASE}/kara_toone_logo_light.png`,
  heroImage: `${MEDIA_BASE}/02_Hero_Images/Hero_YellowBlazer_FullBody.jpg`,
  donateUrl:
    'https://secure.anedot.com/117e8124-433e-4d99-acbd-249fa76c6e0c/donate',
  websiteUrl: 'https://kara.wickowaypoint.com',
  contactEmail: 'votekaratoone@gmail.com',
  socialLinks: {
    instagram: 'https://www.instagram.com/karatooneforutah/',
    facebook:
      'https://www.facebook.com/profile.php?id=61584720802611',
    venmo: 'https://www.venmo.com/u/electkaratoone',
  },
  // Social media tools (admin only)
  socialToolsUrl: 'https://social.wickowaypoint.com',
  socialGenerateUrl: 'https://social.wickowaypoint.com/generate',

  accentColor: '#0EA5E9',
  footerDisclaimer:
    'Paid for by the Committee to Elect Kara Toone. Authorized by Kara Toone.',
  poweredBy: 'Powered by Wicko Waypoint',

  // All campaign images from the website
  images: {
    heroFullBody: `${MEDIA_BASE}/02_Hero_Images/Hero_YellowBlazer_FullBody.jpg`,
    heroBurgundy: `${MEDIA_BASE}/02_Hero_Images/Hero_BurgundySweater_Outdoor.jpg`,
    heroHome: `${MEDIA_BASE}/01_Hero_Images/Hero_Home.jpg`,
    heroGrowth: `${MEDIA_BASE}/01_Hero_Images/Hero_Growth.jpg`,
    heroHousing: `${MEDIA_BASE}/01_Hero_Images/Hero_Housing.jpg`,
    heroSafety: `${MEDIA_BASE}/01_Hero_Images/Hero_Safety.jpg`,
    heroEducation: `${MEDIA_BASE}/01_Hero_Images/Hero_Education.jpg`,
    heroFiscal: `${MEDIA_BASE}/01_Hero_Images/Hero_Fiscal.jpg`,
    headshot: `${MEDIA_BASE}/03_Headshots/Headshot_CloseUp_38.jpg`,
    familyFormal: `${MEDIA_BASE}/04_Family_Photos/Family_Formal.jpeg`,
    familyOutdoor: `${MEDIA_BASE}/04_Family_Photos/Family_Outdoor_Steps.jpeg`,
    coupleOutdoors: `${MEDIA_BASE}/04_Family_Photos/Couple_Outdoors.jpeg`,
    familyIceCream: `${MEDIA_BASE}/04_Family_Photos/Family_IceCream.jpeg`,
    americanFlag: `${MEDIA_BASE}/05_Community_Involvement/AmericanFlag_WithStudents.jpeg`,
    communityParade: `${MEDIA_BASE}/05_Community_Involvement/Community_Parade.jpeg`,
    politicalEvent: `${MEDIA_BASE}/05_Community_Involvement/Political_Event_Group.jpeg`,
    bestOfState: `${MEDIA_BASE}/05_Community_Involvement/BestOfState_Award.jpeg`,
    communityEvent: `${MEDIA_BASE}/05_Community_Involvement/Community_Event.jpg`,
    socialShare: `${MEDIA_BASE}/KARA2N4UTAH.png`,
  },

  // About page content (from website)
  about: {
    bio: `Kara Toone is a lifelong Davis County resident, education leader, and community builder running to represent Utah House District 14 in the state legislature.\n\nAs Executive Director of the Davis Education Foundation, Kara has spent years working to strengthen schools, support teachers, and ensure every student has the resources they need to succeed.\n\nA mother, wife, and active community volunteer, Kara understands the challenges families face — from housing affordability to infrastructure demands in one of Utah's fastest-growing regions.\n\nShe's running because she believes District 14 deserves a representative who listens, who shows up, and who fights for the values that make our community strong.`,
    familyText: 'Kara and her husband Logan are raising their family in the community they love. Their roots run deep in Davis County.',
  },

  // Endorsements
  endorsements: [
    { name: 'Davis County Republican Party', quote: 'A proven leader who will fight for our values in the Utah Legislature.' },
    { name: 'Utah Education Association', quote: 'Kara\'s dedication to education makes her an exceptional candidate for District 14.' },
    { name: 'Local Business Coalition', quote: 'We need leaders like Kara who understand the balance between growth and preserving our community character.' },
  ],

  // Events
  events: [
    { month: 'APR', day: '12', weekday: 'SAT', title: 'Town Hall Meeting', description: 'Join Kara for an open Q&A session at Clearfield Community Center.', location: 'Clearfield Community Center', time: '6:00 PM' },
    { month: 'APR', day: '19', weekday: 'SAT', title: 'Door-to-Door Canvassing', description: 'Help us reach every voter in District 14.', location: 'Meet at Campaign HQ', time: '9:00 AM' },
    { month: 'MAY', day: '3', weekday: 'SAT', title: 'Community BBQ & Rally', description: 'Bring the family for food, music, and campaign updates.', location: 'Syracuse City Park', time: '4:00 PM' },
  ],

  // Stats band (from website)
  stats: [
    { number: '25+', label: 'Years in Davis County' },
    { number: '10K', label: 'Students Impacted' },
    { number: '50+', label: 'Community Partners' },
    { number: '14', label: 'House District' },
  ],

  // Get involved cards
  getInvolved: [
    { icon: '🤝', title: 'Volunteer', description: 'Join our team and help make a difference in District 14.', action: 'Sign Up' },
    { icon: '🪧', title: 'Yard Sign', description: 'Show your support with a Kara Toone yard sign.', action: 'Request Sign' },
    { icon: '❤️', title: 'Donate', description: 'Every dollar helps us reach more voters across the district.', action: 'Contribute' },
  ],

  // Ticker items (scrolling banner)
  tickerItems: [
    'KARA TOONE FOR UTAH',
    'HOUSE DISTRICT 14',
    'EDUCATION LEADER',
    'COMMUNITY BUILDER',
    'DAVIS COUNTY STRONG',
    'REPUBLICAN',
    'VOTE 2026',
  ],

  pillarColors: {
    growth: { primary: '#0EA5E9', gradientStart: '#0EA5E9', gradientEnd: '#0369A1' },
    housing: { primary: '#F97316', gradientStart: '#F97316', gradientEnd: '#C2410C' },
    safety: { primary: '#EF4444', gradientStart: '#EF4444', gradientEnd: '#B91C1C' },
    education: { primary: '#10B981', gradientStart: '#10B981', gradientEnd: '#047857' },
    fiscal: { primary: '#8B5CF6', gradientStart: '#8B5CF6', gradientEnd: '#6D28D9' },
  },
} as const;

export type PillarId = keyof typeof brand.pillarColors;
