import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Pressable } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '../../../src/theme/colors';
import { fontFamilies } from '../../../src/theme/typography';
import { brand } from '../../../src/config/brand';
import { Image } from 'expo-image';

export default function SocialGenerate() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backBtn}>← Back</Text>
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Content Generator</Text>
          <Text style={styles.headerSubtitle}>Create & generate social content</Text>
        </View>
      </View>

      {/* WebView */}
      <View style={styles.webviewContainer}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.red} />
            <Text style={styles.loadingText}>Loading content generator...</Text>
          </View>
        )}
        <WebView
          source={{ uri: brand.socialGenerateUrl }}
          style={styles.webview}
          onLoadEnd={() => setLoading(false)}
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled
          allowsInlineMediaPlayback
          pullToRefreshEnabled
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E8F0',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  backBtn: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 14,
    color: colors.red,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: fontFamilies.displayBold,
    fontSize: 17,
    color: colors.navy,
  },
  headerSubtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.gray,
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cream,
    zIndex: 1,
  },
  loadingText: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.gray,
    marginTop: 12,
  },
});
