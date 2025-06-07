import React, { useState, useEffect } from 'react';
import { movieAPI, screeningAPI, ticketAPI } from '../services/api';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalScreenings: 0,
    myTickets: 0,
    upcomingScreenings: 0
  });
  const [recentMovies, setRecentMovies] = useState([]);
  const [upcomingScreenings, setUpcomingScreenings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
  try {
    const [moviesRes, screeningsRes, ticketsRes] = await Promise.all([
      movieAPI.getMovies(),
      screeningAPI.getScreenings(),
      ticketAPI.getTickets()
    ]);

    console.log('moviesRes:', moviesRes);
    console.log('screeningsRes:', screeningsRes);
    console.log('ticketsRes:', ticketsRes);

    const movies = moviesRes.data || moviesRes;
    const screenings = screeningsRes.data || screeningsRes;
    const tickets = ticketsRes.data || ticketsRes;

    const now = new Date();
    const upcoming = screenings?.filter(s => new Date(s.startTime) > now) || [];

    setStats({
      totalMovies: movies.length,
      totalScreenings: screenings.length,
      myTickets: tickets.length,
      upcomingScreenings: upcoming.length
    });

    setRecentMovies(movies.slice(0, 6));
    setUpcomingScreenings(upcoming.slice(0, 5));
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  } finally {
    setLoading(false);
  }
};


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('hu-HU', {
      style: 'currency',
      currency: 'HUF'
    }).format(price);
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Welcome to Jegymester</h1>
        <p>Your cinema ticket booking dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalMovies}</div>
          <div className="stat-label">Available Movies</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalScreenings}</div>
          <div className="stat-label">Total Screenings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.myTickets}</div>
          <div className="stat-label">My Tickets</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.upcomingScreenings}</div>
          <div className="stat-label">Upcoming Shows</div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Recent Movies */}
        <div className="card">
          <div className="card-title">🎬 Featured Movies</div>
          <div className="card-content">
            {recentMovies.length > 0 ? (
              <div className="grid grid-2" style={{ gap: '1rem' }}>
                {recentMovies.map(movie => (
                  <div key={movie.id} className="movie-item" style={{
                    padding: '1rem',
                    border: '1px solid #e1e1e1',
                    borderRadius: '8px',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#667eea' }}>
                      {movie.name}
                    </h4>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                      <strong>Genre:</strong> {movie.genre}
                    </p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                      <strong>Duration:</strong> {movie.length} min
                    </p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                      <strong>Age Limit:</strong> {movie.ageLimit}+
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No movies available</p>
            )}
          </div>
        </div>

        {/* Upcoming Screenings */}
        <div className="card">
          <div className="card-title">🎭 Upcoming Screenings</div>
          <div className="card-content">
            {upcomingScreenings.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {upcomingScreenings.map(screening => (
                  <div key={screening.id} style={{
                    padding: '1rem',
                    border: '1px solid #e1e1e1',
                    borderRadius: '8px',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#667eea' }}>
                      Movie ID: {screening.movieId}
                    </h4>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                      <strong>📅 Time:</strong> {formatDate(screening.startTime)}
                    </p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                      <strong>🎪 Room:</strong> {screening.room}
                    </p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                      <strong>💰 Price:</strong> {formatPrice(screening.price)}
                    </p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                      <strong>🪑 Capacity:</strong> {screening.capacity} seats
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No upcoming screenings</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-title">🚀 Quick Actions</div>
        <div className="card-content">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="/movies" className="btn btn-primary">
              Browse Movies
            </a>
            <a href="/screenings" className="btn btn-secondary">
              View Screenings
            </a>
            <a href="/tickets" className="btn btn-success">
              My Tickets
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;