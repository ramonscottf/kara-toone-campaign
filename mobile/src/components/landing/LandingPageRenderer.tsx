import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { HeroSection } from './HeroSection';
import { FactsStrip } from './FactsStrip';
import { StatGrid } from './StatGrid';
import { HighlightList } from './HighlightList';
import { QuoteBlock } from './QuoteBlock';
import { ShareCTA } from './ShareCTA';
import {
  LandingPageContent,
  HeroSection as HeroData,
  FactsSection as FactsData,
  StatsSection as StatsData,
  HighlightsSection as HighlightsData,
  QuoteSection as QuoteData,
  CTASection as CTAData,
} from '../../data/landingContent';
import { LandingPageMeta } from '../../data/landingPages';
import { colors } from '../../theme';

interface LandingPageRendererProps {
  content: LandingPageContent;
  meta: LandingPageMeta;
}

export function LandingPageRenderer({ content, meta }: LandingPageRendererProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {content.sections.map((section, i) => {
        switch (section.type) {
          case 'hero':
            const hero = section as HeroData;
            return (
              <HeroSection
                key={i}
                eyebrow={hero.eyebrow}
                title={hero.title}
                subtitle={hero.subtitle}
                badge={hero.badge}
              />
            );

          case 'facts':
            const facts = section as FactsData;
            return <FactsStrip key={i} items={facts.items} />;

          case 'stats':
            const stats = section as StatsData;
            return <StatGrid key={i} items={stats.items} />;

          case 'highlights':
            const highlights = section as HighlightsData;
            return (
              <HighlightList key={i} title={highlights.title} items={highlights.items} />
            );

          case 'quote':
            const quote = section as QuoteData;
            return <QuoteBlock key={i} text={quote.text} attribution={quote.attribution} />;

          case 'cta':
            const cta = section as CTAData;
            return (
              <ShareCTA
                key={i}
                buttonText={cta.shareButtonText}
                shareText={meta.shareText}
                shareUrl={meta.shareUrl}
                title={meta.title}
              />
            );

          default:
            return null;
        }
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
});
