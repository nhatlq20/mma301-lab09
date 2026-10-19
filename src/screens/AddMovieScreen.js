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
import { addMovie } from '../database/database';
import { Ionicons } from '@expo/vector-icons';

export default function AddMovieScreen({ navigation }) {
  const [movieTitle, setMovieTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [rating, setRating] = useState('');

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
    if (!releaseYear.trim() || isNaN(yearNum) || yearNum < 1888 || yearNum > 2100) {
      Alert.alert('Error', 'Please enter a valid release year');
      return;
    }
    const ratingNum = parseFloat(rating);
    if (!rating.trim() || isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      Alert.alert('Error', 'Please enter valid rating (0.0 to 5.0)');
      return;
    }

    const result = addMovie(movieTitle.trim(), genre.trim(), yearNum, ratingNum);
    if (result) {
      Alert.alert('Success', 'Movie added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Error', 'Failed to add movie');
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
            <Text style={styles.label}>Movie Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Inception"
              value={movieTitle}
              onChangeText={setMovieTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Genre *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Sci-Fi, Action, Drama"
              value={genre}
              onChangeText={setGenre}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Release Year *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 2010"
              value={releaseYear}
              onChangeText={setReleaseYear}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Rating (0.0 - 5.0) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 4.5"
              value={rating}
              onChangeText={setRating}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Movie</Text>
            </TouchableOpacity>
          </View>
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
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, gap: 12 },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  saveButton: {
    flex: 1,
    backgroundColor: '#2979ff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});