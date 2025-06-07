import React, { useState, useEffect } from 'react';
import { getMovies, getScreenings, addMovie, deleteMovie, updateMovie, addScreening, deleteScreening, updateScreening } from '../services/api';

const AdminDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [screenings, setScreenings] = useState([]);
  const [activeTab, setActiveTab] = useState('movies');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Movie form state
  const [movieForm, setMovieForm] = useState({
    name: '',
    length: '',
    genre: '',
    ageLimit: ''
  });
  const [editingMovie, setEditingMovie] = useState(null);

  // Screening form state
  const [screeningForm, setScreeningForm] = useState({
    movieId: '',
    startTime: '',
    capacity: '',
    price: '',
    room: ''
  });
  const [editingScreening, setEditingScreening] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [moviesData, screeningsData] = await Promise.all([
        getMovies(),
        getScreenings()
      ]);
      setMovies(moviesData);
      setScreenings(screeningsData);
      setError('');
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Movie handlers
  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMovie) {
        await updateMovie(editingMovie.id, movieForm);
        setEditingMovie(null);
      } else {
        await addMovie(movieForm);
      }
      setMovieForm({ name: '', length: '', genre: '', ageLimit: '' });
      await loadData();
      setError('');
    } catch (err) {
      setError('Failed to save movie');
      console.error('Error saving movie:', err);
    }
  };

  const handleDeleteMovie = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await deleteMovie(id);
        await loadData();
        setError('');
      } catch (err) {
        setError('Failed to delete movie. It might have existing screenings.');
        console.error('Error deleting movie:', err);
      }
    }
  };

  const startEditMovie = (movie) => {
    setEditingMovie(movie);
    setMovieForm({
      name: movie.name,
      length: movie.length.toString(),
      genre: movie.genre,
      ageLimit: movie.ageLimit.toString()
    });
  };

  const cancelEditMovie = () => {
    setEditingMovie(null);
    setMovieForm({ name: '', length: '', genre: '', ageLimit: '' });
  };

  // Screening handlers
  const handleScreeningSubmit = async (e) => {
    e.preventDefault();
    try {
      const screeningData = {
        ...screeningForm,
        movieId: parseInt(screeningForm.movieId),
        capacity: parseInt(screeningForm.capacity),
        price: parseInt(screeningForm.price),
        room: parseInt(screeningForm.room)
      };

      if (editingScreening) {
        await updateScreening(editingScreening.id, screeningData);
        setEditingScreening(null);
      } else {
        await addScreening(screeningData);
      }
      setScreeningForm({ movieId: '', startTime: '', capacity: '', price: '', room: '' });
      await loadData();
      setError('');
    } catch (err) {
      setError('Failed to save screening');
      console.error('Error saving screening:', err);
    }
  };

  const handleDeleteScreening = async (id) => {
    if (window.confirm('Are you sure you want to delete this screening?')) {
      try {
        await deleteScreening(id);
        await loadData();
        setError('');
      } catch (err) {
        setError('Failed to delete screening. It might have existing tickets.');
        console.error('Error deleting screening:', err);
      }
    }
  };

  const startEditScreening = (screening) => {
    setEditingScreening(screening);
    const startTime = new Date(screening.startTime);
    const formattedDateTime = startTime.toISOString().slice(0, 16);
    
    setScreeningForm({
      movieId: screening.movieId.toString(),
      startTime: formattedDateTime,
      capacity: screening.capacity.toString(),
      price: screening.price.toString(),
      room: screening.room.toString()
    });
  };

  const cancelEditScreening = () => {
    setEditingScreening(null);
    setScreeningForm({ movieId: '', startTime: '', capacity: '', price: '', room: '' });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="tabs">
        <button 
          className={activeTab === 'movies' ? 'active' : ''}
          onClick={() => setActiveTab('movies')}
        >
          Movies
        </button>
        <button 
          className={activeTab === 'screenings' ? 'active' : ''}
          onClick={() => setActiveTab('screenings')}
        >
          Screenings
        </button>
      </div>

      {activeTab === 'movies' && (
        <div className="movies-section">
          <h2>Manage Movies</h2>
          
          <form onSubmit={handleMovieSubmit} className="movie-form">
            <h3>{editingMovie ? 'Edit Movie' : 'Add New Movie'}</h3>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={movieForm.name}
                onChange={(e) => setMovieForm({...movieForm, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Length (minutes):</label>
              <input
                type="number"
                value={movieForm.length}
                onChange={(e) => setMovieForm({...movieForm, length: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Genre:</label>
              <input
                type="text"
                value={movieForm.genre}
                onChange={(e) => setMovieForm({...movieForm, genre: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Age Limit:</label>
              <input
                type="number"
                value={movieForm.ageLimit}
                onChange={(e) => setMovieForm({...movieForm, ageLimit: e.target.value})}
                required
              />
            </div>
            <div className="form-buttons">
              <button type="submit">
                {editingMovie ? 'Update Movie' : 'Add Movie'}
              </button>
              {editingMovie && (
                <button type="button" onClick={cancelEditMovie}>Cancel</button>
              )}
            </div>
          </form>

          <div className="movies-list">
            <h3>Existing Movies</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Length</th>
                  <th>Genre</th>
                  <th>Age Limit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map(movie => (
                  <tr key={movie.id}>
                    <td>{movie.name}</td>
                    <td>{movie.length} min</td>
                    <td>{movie.genre}</td>
                    <td>{movie.ageLimit}+</td>
                    <td>
                      <button onClick={() => startEditMovie(movie)}>Edit</button>
                      <button onClick={() => handleDeleteMovie(movie.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'screenings' && (
        <div className="screenings-section">
          <h2>Manage Screenings</h2>
          
          <form onSubmit={handleScreeningSubmit} className="screening-form">
            <h3>{editingScreening ? 'Edit Screening' : 'Add New Screening'}</h3>
            <div className="form-group">
              <label>Movie:</label>
              <select
                value={screeningForm.movieId}
                onChange={(e) => setScreeningForm({...screeningForm, movieId: e.target.value})}
                required
              >
                <option value="">Select a movie</option>
                {movies.map(movie => (
                  <option key={movie.id} value={movie.id}>
                    {movie.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Start Time:</label>
              <input
                type="datetime-local"
                value={screeningForm.startTime}
                onChange={(e) => setScreeningForm({...screeningForm, startTime: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Capacity:</label>
              <input
                type="number"
                value={screeningForm.capacity}
                onChange={(e) => setScreeningForm({...screeningForm, capacity: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Price (in cents):</label>
              <input
                type="number"
                value={screeningForm.price}
                onChange={(e) => setScreeningForm({...screeningForm, price: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Room:</label>
              <input
                type="number"
                value={screeningForm.room}
                onChange={(e) => setScreeningForm({...screeningForm, room: e.target.value})}
                required
              />
            </div>
            <div className="form-buttons">
              <button type="submit">
                {editingScreening ? 'Update Screening' : 'Add Screening'}
              </button>
              {editingScreening && (
                <button type="button" onClick={cancelEditScreening}>Cancel</button>
              )}
            </div>
          </form>

          <div className="screenings-list">
            <h3>Existing Screenings</h3>
            <table>
              <thead>
                <tr>
                  <th>Movie</th>
                  <th>Start Time</th>
                  <th>Room</th>
                  <th>Capacity</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {screenings.map(screening => (
                  <tr key={screening.id}>
                    <td>{screening.movieName}</td>
                    <td>{new Date(screening.startTime).toLocaleString()}</td>
                    <td>{screening.room}</td>
                    <td>{screening.capacity}</td>
                    <td>{screening.price} Ft</td>
                    <td>
                      <button onClick={() => startEditScreening(screening)}>Edit</button>
                      <button onClick={() => handleDeleteScreening(screening.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;