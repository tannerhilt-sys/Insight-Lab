import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/colors';

const courses = [
  {
    id: '1',
    title: 'Investing 101',
    desc: 'Learn the basics of stock market investing',
    lessons: 8,
    completed: 3,
    icon: 'trending-up' as const,
    color: colors.primary[600],
    level: 'Beginner',
  },
  {
    id: '2',
    title: 'Budgeting Basics',
    desc: 'Master the art of managing your money',
    lessons: 6,
    completed: 6,
    icon: 'wallet' as const,
    color: colors.emerald[500],
    level: 'Beginner',
  },
  {
    id: '3',
    title: 'Understanding Credit',
    desc: 'How credit scores work and how to improve yours',
    lessons: 5,
    completed: 1,
    icon: 'card' as const,
    color: colors.amber[500],
    level: 'Intermediate',
  },
  {
    id: '4',
    title: 'Retirement Planning',
    desc: '401k, IRA, and building long-term wealth',
    lessons: 7,
    completed: 0,
    icon: 'home' as const,
    color: colors.purple[500],
    level: 'Intermediate',
  },
  {
    id: '5',
    title: 'Crypto & Blockchain',
    desc: 'Digital currencies and decentralized finance',
    lessons: 6,
    completed: 0,
    icon: 'logo-bitcoin' as const,
    color: colors.amber[600],
    level: 'Advanced',
  },
];

const dailyTips = [
  { title: 'The 50/30/20 Rule', body: 'Allocate 50% to needs, 30% to wants, and 20% to savings. A simple but powerful framework.' },
  { title: 'Dollar-Cost Averaging', body: 'Invest a fixed amount regularly regardless of market conditions. It reduces the impact of volatility.' },
];

export default function LearnScreen() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const filtered = selectedLevel ? courses.filter((c) => c.level === selectedLevel) : courses;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Progress Header */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Ionicons name="school" size={24} color="#fff" />
          <Text style={styles.progressTitle}>Your Learning Journey</Text>
        </View>
        <View style={styles.progressStats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>10</Text>
            <Text style={styles.statLabel}>Lessons Done</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>5h</Text>
            <Text style={styles.statLabel}>Time Spent</Text>
          </View>
        </View>
      </View>

      {/* Daily Tips */}
      <Text style={styles.sectionTitle}>Daily Tips</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
        {dailyTips.map((tip, i) => (
          <View key={i} style={styles.tipCard}>
            <Ionicons name="bulb" size={20} color={colors.amber[500]} />
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipBody}>{tip.body}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Filter */}
      <View style={styles.filterRow}>
        <Text style={styles.sectionTitle}>Courses</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          <TouchableOpacity
            style={[styles.filterChip, !selectedLevel && styles.filterChipActive]}
            onPress={() => setSelectedLevel(null)}
          >
            <Text style={[styles.filterText, !selectedLevel && styles.filterTextActive]}>All</Text>
          </TouchableOpacity>
          {levels.map((l) => (
            <TouchableOpacity
              key={l}
              style={[styles.filterChip, selectedLevel === l && styles.filterChipActive]}
              onPress={() => setSelectedLevel(l)}
            >
              <Text style={[styles.filterText, selectedLevel === l && styles.filterTextActive]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Course List */}
      {filtered.map((course) => {
        const pct = Math.round((course.completed / course.lessons) * 100);
        const done = pct === 100;
        return (
          <TouchableOpacity key={course.id} style={styles.courseCard}>
            <View style={styles.courseRow}>
              <View style={[styles.courseIcon, { backgroundColor: course.color + '15' }]}>
                <Ionicons name={course.icon} size={22} color={course.color} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.courseTitleRow}>
                  <Text style={styles.courseName}>{course.title}</Text>
                  {done && (
                    <View style={styles.doneBadge}>
                      <Ionicons name="checkmark-circle" size={14} color={colors.emerald[500]} />
                    </View>
                  )}
                </View>
                <Text style={styles.courseDesc}>{course.desc}</Text>
                <View style={styles.courseMeta}>
                  <Text style={styles.courseMetaText}>{course.lessons} lessons</Text>
                  <Text style={styles.courseMetaDot}>·</Text>
                  <Text style={styles.courseMetaText}>{course.level}</Text>
                </View>
              </View>
            </View>
            <View style={styles.courseProgressBg}>
              <View style={[styles.courseProgressFill, { width: `${pct}%`, backgroundColor: course.color }]} />
            </View>
            <Text style={styles.courseProgressText}>{pct}% complete</Text>
          </TouchableOpacity>
        );
      })}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.slate[50] },
  progressCard: {
    margin: 20,
    backgroundColor: colors.primary[600],
    borderRadius: 20,
    padding: 24,
  },
  progressHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  progressTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  progressStats: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.2)' },

  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.slate[900], paddingHorizontal: 20, marginTop: 16, marginBottom: 12 },

  tipCard: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  tipTitle: { fontSize: 14, fontWeight: '700', color: colors.slate[900], marginTop: 8, marginBottom: 4 },
  tipBody: { fontSize: 12, color: colors.slate[500], lineHeight: 17 },

  filterRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: colors.slate[100] },
  filterChipActive: { backgroundColor: colors.primary[600] },
  filterText: { fontSize: 13, fontWeight: '600', color: colors.slate[500] },
  filterTextActive: { color: '#fff' },

  courseCard: {
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  courseRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  courseIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  courseTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  courseName: { fontSize: 15, fontWeight: '700', color: colors.slate[900] },
  doneBadge: {},
  courseDesc: { fontSize: 12, color: colors.slate[500], marginTop: 2 },
  courseMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  courseMetaText: { fontSize: 11, color: colors.slate[400] },
  courseMetaDot: { fontSize: 11, color: colors.slate[300] },
  courseProgressBg: { height: 4, backgroundColor: colors.slate[100], borderRadius: 2, overflow: 'hidden' },
  courseProgressFill: { height: '100%', borderRadius: 2 },
  courseProgressText: { fontSize: 11, color: colors.slate[400], marginTop: 4 },
});
