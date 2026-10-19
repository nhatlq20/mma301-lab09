import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import { getAllMovies, searchMovies } from '../database/database';
import { Ionicons } from '@expo/vector-icons';

export default function MoviesListScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  const loadMovies = () => {
    try {
      const data = getAllMovies();
      setMovies(data);
    } catch (error) {
      console.error('Error loading movies:', error);
    }
  };

  useEffect(() => {
    loadMovies();
    const unsubscribe = navigation.addListener('focus', () => {
      loadMovies();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setSearchText('');
    loadMovies();
    setRefreshing(false);
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      loadMovies();
    } else {
      const results = searchMovies(text.trim());
      setMovies(results);
    }
  };

  const renderMovieItem = ({ item }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}
    >
      <View style={styles.movieHeader}>
        <Text style={styles.movieTitle}>{item.movie_title}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
      </View>
      <View style={styles.movieInfo}>
        <View style={styles.genreContainer}>
          <Ionicons name="film-outline" size={14} color="#666" />
          <Text style={styles.genre}>{item.genre}</Text>
        </View>
        <View style={styles.yearContainer}>
          <Ionicons name="calendar-outline" size={14} color="#666" />
          <Text style={styles.year}>{item.release_year}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Movie Manager</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies by title..."
          value={searchText}
          onChangeText={handleSearch}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={movies}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="film-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No movies found</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddMovie')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#6200ee',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 2,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 16 },
  listContainer: { padding: 15, paddingTop: 0, paddingBottom: 85 },
  movieCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  movieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  movieTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', flex: 1, marginRight: 8 },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rating: { fontSize: 15, fontWeight: 'bold', color: '#333', marginLeft: 4 },
  movieInfo: { flexDirection: 'row', alignItems: 'center' },
  genreContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  genre: { fontSize: 14, color: '#666', marginLeft: 4 },
  yearContainer: { flexDirection: 'row', alignItems: 'center' },
  year: { fontSize: 14, color: '#666', marginLeft: 4 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, fontWeight: 'bold', color: '#999', marginTop: 12 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
});