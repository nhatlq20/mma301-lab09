import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { updateMovie } from '../database/database';

export default function EditMovieScreen({ route, navigation }) {
  const { movieId, movie } = route.params;
  const [movieTitle, setMovieTitle] = useState(movie.movie_title);
  const [genre, setGenre] = useState(movie.genre);
  const [releaseYear, setReleaseYear] = useState(movie.release_year.toString());
  const [rating, setRating] = useState(movie.rating.toString());

  const handleSave = () => {
    if (!movieTitle.trim()) {
      Alert.alert('Error', 'Please enter movie title');
      return;
    }
    if (!genre.trim()) {
      Alert.alert('Error', 'Please enter genre');
      return;
    }
    const yearNum = parseInt(releaseYear, 10);
    if (!releaseYear.trim() || isNaN(yearNum)) {
      Alert.alert('Error', 'Please enter valid release year');
      return;
    }
    const ratingNum = parseFloat(rating);
    if (!rating.trim() || isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      Alert.alert('Error', 'Please enter valid rating (0.0 to 5.0)');
      return;
    }

    const success = updateMovie(movieId, movieTitle.trim(), genre.trim(), yearNum, ratingNum);
    if (success) {
      Alert.alert('Saved', 'Movie updated', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Error', 'Failed to update movie');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Movie Title</Text>
            <TextInput
              style={styles.input}
              value={movieTitle}
              onChangeText={setMovieTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Genre</Text>
            <TextInput
              style={styles.input}
              value={genre}
              onChangeText={setGenre}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Release Year</Text>
            <TextInput
              style={styles.input}
              value={releaseYear}
              onChangeText={setReleaseYear}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Rating (0-5)</Text>
            <TextInput
              style={styles.input}
              value={rating}
              onChangeText={setRating}
              keyboardType="decimal-pad"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContainer: { padding: 20 },
  form: { backgroundColor: '#fff', borderRadius: 12, padding: 20, elevation: 2 },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  saveButton: {
    backgroundColor: '#2979ff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});