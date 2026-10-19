import * as SQLite from 'expo-sqlite';

// Mở hoặc tạo file database SQLite đồng bộ
const db = SQLite.openDatabaseSync('movies.db');

let isInitialized = false;

export const initDatabase = () => {
  if (isInitialized) return;
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        movie_title TEXT NOT NULL,
        genre TEXT NOT NULL,
        release_year INTEGER NOT NULL,
        rating REAL NOT NULL
      );
    `);
    console.log('Database initialized successfully');
    insertSampleData();
    isInitialized = true;
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export const insertSampleData = () => {
  try {
    const count = db.getFirstSync('SELECT COUNT(*) as count FROM movies');
    if (count && count.count === 0) {
      const sampleMovies = [
        { title: 'Inception', genre: 'Sci-Fi', year: 2010, rating: 4.8 },
        { title: 'The Dark Knight', genre: 'Action', year: 2008, rating: 4.9 },
        { title: 'The Shawshank Redemption', genre: 'Drama', year: 1994, rating: 4.9 },
        { title: 'Pulp Fiction', genre: 'Crime', year: 1994, rating: 4.7 },
        { title: 'Forrest Gump', genre: 'Drama', year: 1994, rating: 4.5 },
      ];
      sampleMovies.forEach((m) => {
        db.runSync(
          'INSERT INTO movies (movie_title, genre, release_year, rating) VALUES (?, ?, ?, ?)',
          [m.title, m.genre, m.year, m.rating]
        );
      });
      console.log('Sample data inserted successfully');
    }
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
};

export const getAllMovies = () => {
  try {
    initDatabase();
    return db.getAllSync('SELECT * FROM movies ORDER BY id DESC');
  } catch (error) {
    console.error('Error getting movies:', error);
    return [];
  }
};

export const searchMovies = (searchText) => {
  try {
    initDatabase();
    return db.getAllSync(
      'SELECT * FROM movies WHERE movie_title LIKE ? ORDER BY id DESC',
      [`%${searchText}%`]
    );
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

export const getMovieById = (id) => {
  try {
    initDatabase();
    return db.getFirstSync('SELECT * FROM movies WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error getting movie by ID:', error);
    return null;
  }
};

export const addMovie = (movieTitle, genre, releaseYear, rating) => {
  try {
    const result = db.runSync(
      'INSERT INTO movies (movie_title, genre, release_year, rating) VALUES (?, ?, ?, ?)',
      [movieTitle, genre, releaseYear, rating]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding movie:', error);
    return null;
  }
};

export const updateMovie = (id, movieTitle, genre, releaseYear, rating) => {
  try {
    db.runSync(
      'UPDATE movies SET movie_title = ?, genre = ?, release_year = ?, rating = ? WHERE id = ?',
      [movieTitle, genre, releaseYear, rating, id]
    );
    return true;
  } catch (error) {
    console.error('Error updating movie:', error);
    return false;
  }
};

export const deleteMovie = (id) => {
  try {
    db.runSync('DELETE FROM movies WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error('Error deleting movie:', error);
    return false;
  }
};

export const getStatistics = () => {
  try {
    initDatabase();
    const total = db.getFirstSync('SELECT COUNT(*) as count FROM movies');
    const avg = db.getFirstSync('SELECT AVG(rating) as average FROM movies');
    const genreStats = db.getAllSync(
      'SELECT genre, COUNT(*) as count FROM movies GROUP BY genre ORDER BY count DESC'
    );
    return {
      totalMovies: total ? total.count : 0,
      averageRating: avg && avg.average ? Number(avg.average).toFixed(2) : '0.00',
      genreStats: genreStats || [],
    };
  } catch (error) {
    console.error('Error getting statistics:', error);
    return { totalMovies: 0, averageRating: '0.00', genreStats: [] };
  }
};