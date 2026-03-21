import React, { useState, useMemo } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { Text, SearchBar, Badge, FilterChipGroup } from '../../../../src/components/ui';
import { fetchContacts, Contact } from '../../../../src/api/contacts';
import { getSupportConfig } from '../../../../src/utils/supportColors';
import { colors, spacing, fonts, fontSizes, borderRadius } from '../../../../src/theme';

const filterOptions = [
  { label: 'All', value: '' },
  { label: 'Volunteers', value: 'volunteer' },
  { label: 'Donors', value: 'donor' },
  { label: 'Delegates', value: 'delegate' },
  { label: 'Yard Signs', value: 'yardsign' },
];

export default function ContactsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => fetchContacts(),
  });

  const contacts = data?.contacts || [];

  const filtered = useMemo(() => {
    let result = contacts;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        c =>
          c.first_name?.toLowerCase().includes(q) ||
          c.last_name?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.phone?.includes(q)
      );
    }
    if (typeFilter) {
      result = result.filter(c => c.type?.includes(typeFilter));
    }
    return result;
  }, [contacts, search, typeFilter]);

  const renderContact = ({ item }: { item: Contact }) => {
    const support = getSupportConfig(item.support_level);
    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          Haptics.selectionAsync();
          router.push(`/(tabs)/war-room/contacts/${item.id}`);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.rowMain}>
          <View style={[styles.avatar, { backgroundColor: support.color + '20' }]}>
            <Text style={[styles.avatarText, { color: support.color }]}>
              {(item.first_name?.[0] || '') + (item.last_name?.[0] || '')}
            </Text>
          </View>
          <View style={styles.rowInfo}>
            <Text style={styles.name}>
              {item.first_name} {item.last_name}
            </Text>
            <Text style={styles.detail}>
              {item.email || item.phone || 'No contact info'}
            </Text>
          </View>
        </View>
        <View style={[styles.supportDot, { backgroundColor: support.color }]} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search contacts..." />
      </View>
      <FilterChipGroup options={filterOptions} selected={typeFilter} onSelect={setTypeFilter} />
      <Text style={styles.count}>{filtered.length} contacts</Text>
      <FlatList
        data={filtered}
        renderItem={renderContact}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.navy} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  searchContainer: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },
  count: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  list: {
    paddingBottom: spacing['3xl'],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  rowMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.sm,
  },
  rowInfo: {
    flex: 1,
  },
  name: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.base,
    color: colors.text,
  },
  detail: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  supportDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
