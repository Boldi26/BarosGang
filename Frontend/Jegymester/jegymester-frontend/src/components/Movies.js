import React, { useState, useEffect } from 'react';
import { movieAPI } from '../services/api';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [sortBy, setSortBy] = useState('name');

   useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await movieAPI.getMovies();
        console.log('Fetched movies:', data);
        setMovies(data);
      } catch (err) {
        console.error('Error fetching movies:', err.message);
        setError(err.message || 'Failed to fetch movies.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Get unique genres for filter
  const genres = [...new Set(movies.map(movie => movie.genre))];

  // Filter and sort movies
  const filteredMovies = movies
    .filter(movie => {
      const matchesSearch = movie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          movie.genre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = !filterGenre || movie.genre === filterGenre;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'length':
          return b.length - a.length;
        case 'ageLimit':
          return a.ageLimit - b.ageLimit;
        case 'genre':
          return a.genre.localeCompare(b.genre);
        default:
          return 0;
      }
    });

  if (loading) {
    return <div className="loading">Loading movies...</div>;
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>🎬 Movies</h1>
        <br></br>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Search and Filter Controls */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-content">
          <div className="grid grid-3" style={{ gap: '1rem', alignItems: 'end' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="search">Search Movies</label>
              <input
                type="text"
                id="search"
                placeholder="Search by title or genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="genre">Filter by Genre</label>
              <select
                id="genre"
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="sort">Sort by</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="length">Duration</option>
                <option value="ageLimit">Age Limit</option>
                <option value="genre">Genre</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Movies Display */}
      <div style={{ marginBottom: '1rem'}}>
        Showing {filteredMovies.length} of {movies.length} movies
      </div>

      {filteredMovies.length === 0 ? (
        <div className="card">
          <div className="card-content" style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>No movies found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-3">
          {filteredMovies.map(movie => (
            <div key={movie.id} className="card">
              <div className="card-title">
                {movie.name}
              </div>
			  <br></br>
              <div className="card-content">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold', color: '#667eea' }}>🎭 Genre:</span>
                    <span>{movie.genre}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold', color: '#667eea' }}>⏱️ Duration:</span>
                    <span>{movie.length} minutes</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold', color: '#667eea' }}>🔞 Age Limit:</span>
                    <span>{movie.ageLimit}+</span>
                  </div>
                </div>
              </div>
			  <br></br>
              <div className="card-actions">
                <a 
                  href={`/screenings?movie=${movie.id}`} 
                  className="btn btn-primary"
                  style={{ textDecoration: 'none' }}
                >
                  View Screenings
                </a>
              </div>
			  <br></br>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies;