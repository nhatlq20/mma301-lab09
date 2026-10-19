import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { getMovieById, deleteMovie } from '../database/database';
import { Ionicons } from '@expo/vector-icons';

export default function MovieDetailScreen({ route, navigation }) {
  const { movieId } = route.params;
  const [movie, setMovie] = useState(null);

  const loadMovie = () => {
    const movieData = getMovieById(movieId);
    setMovie(movieData);
  };

  useEffect(() => {
    loadMovie();
    const unsubscribe = navigation.addListener('focus', loadMovie);
    return unsubscribe;
  }, [movieId, navigation]);

  const handleDelete = () => {
    Alert.alert('Confirm', 'Delete this movie?', [
      { text: 'CANCEL', style: 'cancel' },
      {
        text: 'DELETE',
        style: 'destructive',
        onPress: () => {
          const success = deleteMovie(movieId);
          if (success) {
            navigation.goBack();
          } else {
            Alert.alert('Error', 'Failed to delete movie');
          }
        },
      },
    ]);
  };

  if (!movie) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Movie not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{movie.movie_title}</Text>
        <Text style={styles.infoText}>Genre: {movie.genre}</Text>
        <Text style={styles.infoText}>Release Year: {movie.release_year}</Text>
        <Text style={styles.infoText}>Rating: ⭐ {movie.rating}</Text>
        <Text style={styles.infoText}>ID: {movie.id}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => navigation.navigate('EditMovie', { movieId: movie.id, movie })}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, elevation: 2 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#111', marginBottom: 12 },
  infoText: { fontSize: 16, color: '#444', marginVertical: 4 },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: { backgroundColor: '#2979ff' },
  deleteButton: { backgroundColor: '#e53935' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  errorText: { fontSize: 16, color: '#999' },
});