import { colors } from '../theme';

export const supportLevelConfig: Record<string, { label: string; color: string }> = {
  'strong-support': { label: 'Strong Support', color: colors.supportStrong },
  'leaning-support': { label: 'Leaning Support', color: colors.supportLeaning },
  undecided: { label: 'Undecided', color: colors.supportUndecided },
  'leaning-opponent': { label: 'Leaning Opponent', color: colors.supportOpponent },
  'strong-opponent': { label: 'Strong Opponent', color: colors.supportStrongOpponent },
  'not-contacted': { label: 'Not Contacted', color: colors.supportNotContacted },
  '': { label: 'Unknown', color: colors.supportNotContacted },
};

export function getSupportConfig(level: string) {
  return supportLevelConfig[level] || supportLevelConfig[''];
}

export const audienceOptions = [
  { label: 'All Opt-in', value: 'all-optin' },
  { label: 'Volunteers', value: 'volunteers' },
  { label: 'Donors', value: 'donors' },
  { label: 'Delegates', value: 'delegates' },
  { label: 'Yard Signs', value: 'yardsign' },
];
