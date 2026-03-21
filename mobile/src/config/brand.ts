/**
 * White-label brand configuration.
 * Swap this file to reskin the entire app for any campaign client.
 */

export const brand = {
  candidateName: 'Kara Toone',
  campaignTitle: 'Kara Toone for Utah House District 14',
  tagline: 'Lifelong Davis County resident. Education leader. Community builder.',
  district: 'Utah House District 14',
  logoUrl:
    'https://media.kara.fosterlabs.org/Website%20Media%20(Organized)/kara_toone_logo_light.png',
  heroImage:
    'https://media.kara.fosterlabs.org/Website%20Media%20(Organized)/01_Hero_Images/Hero_Home.jpg',
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
  accentColor: '#0EA5E9',
  footerDisclaimer:
    'Paid for by the Committee to Elect Kara Toone. Authorized by Kara Toone.',
  poweredBy: 'Powered by Wicko Waypoint',

  pillarColors: {
    growth: { primary: '#0EA5E9', gradientStart: '#0EA5E9', gradientEnd: '#0369A1' },
    housing: { primary: '#F97316', gradientStart: '#F97316', gradientEnd: '#C2410C' },
    safety: { primary: '#EF4444', gradientStart: '#EF4444', gradientEnd: '#B91C1C' },
    education: { primary: '#10B981', gradientStart: '#10B981', gradientEnd: '#047857' },
    fiscal: { primary: '#8B5CF6', gradientStart: '#8B5CF6', gradientEnd: '#6D28D9' },
  },
} as const;

export type PillarId = keyof typeof brand.pillarColors;
