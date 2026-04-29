/**
 * White-label brand configuration.
 * Reskinned to match kara.wickowaypoint.com campaign site.
 * Gold accent, Fraunces-inspired hierarchy, dark-mode-first.
 */

export const brand = {
  candidateName: 'Kara Toone',
  campaignTitle: 'Kara Toone for Utah House District 14',
  tagline: 'Lifelong Davis County resident. Education leader. Community builder.',
  district: 'Utah House District 14',
  logoUrl:
    'https://media.kara.fosterlabs.org/Website%20Media%20(Organized)/kara_toone_logo_light.png',
  logoDarkUrl:
    'https://media.kara.fosterlabs.org/Website%20Media%20(Organized)/kara_toone_logo_light.png',
  logoLightUrl:
    'https://media.kara.fosterlabs.org/Website%20Media%20(Organized)/kara_toone_logo_dark.png',
  heroImage:
    'https://media.kara.fosterlabs.org/Website%20Media%20(Organized)/02_Hero_Images/Hero_YellowBlazer_FullBody.jpg',
  donateUrl:
    'https://secure.anedot.com/117e8124-433e-4d99-acbd-249fa76c6e0c/donate',
  websiteUrl: 'https://kara.wickowaypoint.com',
  commandUrl: 'https://kara.wickowaypoint.com/command',
  canvassUrl: 'https://kara.wickowaypoint.com/canvass',
  volunteerUrl: 'https://kara.wickowaypoint.com/volunteer',
  contactEmail: 'votekaratoone@gmail.com',
  socialLinks: {
    instagram: 'https://www.instagram.com/karatooneforutah/',
    facebook:
      'https://www.facebook.com/profile.php?id=61584720802611',
    venmo: 'https://www.venmo.com/u/electkaratoone',
  },
  accentColor: '#C9A84C',
  accentColorLight: '#B8962E',
  footerDisclaimer:
    'Paid for by the Committee to Elect Kara Toone. Authorized by Kara Toone.',
  poweredBy: 'Powered by Wicko Waypoint',

  // District data
  district_stats: {
    totalVoters: 25209,
    republicans: 14639,
    daysToElection: 78,
    primaryDate: '2026-06-23',
  },

  pillarColors: {
    growth: { primary: '#2563EB', gradientStart: '#1E40AF', gradientEnd: '#3B82F6' },
    housing: { primary: '#C2410C', gradientStart: '#9A3412', gradientEnd: '#EA580C' },
    safety: { primary: '#DC2626', gradientStart: '#991B1B', gradientEnd: '#EF4444' },
    education: { primary: '#059669', gradientStart: '#065F46', gradientEnd: '#10B981' },
    fiscal: { primary: '#7C3AED', gradientStart: '#5B21B6', gradientEnd: '#8B5CF6' },
  },
} as const;

export type PillarId = keyof typeof brand.pillarColors;
