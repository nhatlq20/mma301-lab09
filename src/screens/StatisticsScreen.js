import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { getStatistics } from '../database/database';

export default function StatisticsScreen({ navigation }) {
  const [stats, setStats] = useState({
    totalMovies: 0,
    averageRating: '0.00',
    genreStats: [],
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadStatistics = () => {
    const s = getStatistics();
    setStats(s);
  };

  useEffect(() => {
    loadStatistics();
    const unsubscribe = navigation.addListener('focus', loadStatistics);
    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    loadStatistics();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.card}>
        <Text style={styles.header}>Collection Statistics</Text>
        <Text style={styles.statLine}>Total Movies: {stats.totalMovies}</Text>
        <Text style={styles.statLine}>Average Rating: {stats.averageRating}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Count by Genre</Text>
        {stats.genreStats.length === 0 ? (
          <Text style={styles.emptyText}>No data available</Text>
        ) : (
          stats.genreStats.map((item, index) => (
            <View key={index} style={styles.genreRow}>
              <Text style={styles.genreName}>{item.genre}</Text>
              <Text style={styles.genreCount}>{item.count}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 15, elevation: 2 },
  header: { fontSize: 20, fontWeight: 'bold', color: '#111', marginBottom: 12 },
  statLine: { fontSize: 16, color: '#444', marginVertical: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111', marginBottom: 12 },
  genreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  genreName: { fontSize: 16, color: '#333' },
  genreCount: { fontSize: 16, fontWeight: 'bold', color: '#2979ff' },
  emptyText: { color: '#999', fontStyle: 'italic', marginTop: 8 },
});