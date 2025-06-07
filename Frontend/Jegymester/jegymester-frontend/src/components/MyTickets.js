import React, { useState, useEffect } from 'react';
import { getTickets, deleteTicket, getScreenings, getMovies } from '../services/api';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      
      // Fetch tickets, screenings, and movies
      const [ticketsData, screeningsData, moviesData] = await Promise.all([
        getTickets(),
        getScreenings(),
        getMovies()
      ]);

      // Create lookup maps for better performance
      const screeningsMap = new Map(screeningsData.map(screening => [screening.id, screening]));
      const moviesMap = new Map(moviesData.map(movie => [movie.id, movie]));

      // Enrich tickets with screening and movie data
      const enrichedTickets = ticketsData.map(ticket => {
        const screening = screeningsMap.get(ticket.screeningId);
		console.log(screening);
        const movie = screening ? moviesMap.get(screening.movieId) : null;

        return {
          ...ticket,
          // Add screening data
          screeningTime: screening?.startTime || null,
          room: screening?.room || 'Unknown',
          price: screening?.price || 0,
          // Add movie data
          movieName: movie?.name || 'Unknown Movie',
          movieLength: movie?.length || 0,
          movieGenre: movie?.genre || 'Unknown',
          movieAgeLimit: movie?.ageLimit || 0
        };
      });

      setTickets(enrichedTickets);
      setError('');
    } catch (err) {
      setError('Failed to load tickets');
      console.error('Error loading tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (ticketId, screeningTime) => {
    if (!screeningTime) {
      setError('Cannot determine screening time for refund');
      return;
    }

    const now = new Date();
    const screening = new Date(screeningTime);
    const hoursUntilScreening = (screening - now) / (1000 * 60 * 60);

    if (hoursUntilScreening <= 4) {
      setError('Cannot refund tickets within 4 hours of screening time.');
      return;
    }

    if (window.confirm('Are you sure you want to refund this ticket?')) {
      try {
        await deleteTicket(ticketId);
        setSuccess('Ticket refunded successfully!');
        setError('');
        await loadTickets();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to refund ticket. ' + (err.response?.data || err.message));
        console.error('Error refunding ticket:', err);
      }
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'Unknown';
    const date = new Date(dateTime);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const formatPrice = (price) => {
    if (!price) return '0 Ft';
    return price.toFixed(0) + ' Ft';
  };

  const canRefund = (screeningTime) => {
    if (!screeningTime) return false;
    const now = new Date();
    const screening = new Date(screeningTime);
    const hoursUntilScreening = (screening - now) / (1000 * 60 * 60);
    return hoursUntilScreening > 4;
  };

  const isPastScreening = (screeningTime) => {
    if (!screeningTime) return false;
    const now = new Date();
    const screening = new Date(screeningTime);
    return screening < now;
  };

  const getTicketStatus = (screeningTime) => {
    if (!screeningTime) {
      return { status: 'unknown', label: 'Unknown', class: 'status-unknown' };
    }
    
    if (isPastScreening(screeningTime)) {
      return { status: 'past', label: 'Past Screening', class: 'status-past' };
    } else if (canRefund(screeningTime)) {
      return { status: 'refundable', label: 'Refundable', class: 'status-refundable' };
    } else {
      return { status: 'non-refundable', label: 'Non-refundable', class: 'status-non-refundable' };
    }
  };

  if (loading) return <div className="loading">Loading your tickets...</div>;

  return (
    <div className="my-tickets">
      <h1>My Tickets</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {tickets.length === 0 ? (
        <div className="no-tickets">
          <p>You haven't purchased any tickets yet.</p>
          <p>Visit the <strong>Screenings</strong> page to buy tickets for upcoming movies!</p>
        </div>
      ) : (
        <div className="tickets-container">
          <div className="tickets-summary">
            <h3>Summary</h3>
            <p>Total tickets: <strong>{tickets.length}</strong></p>
            <p>Upcoming: <strong>{tickets.filter(t => t.screeningTime && !isPastScreening(t.screeningTime)).length}</strong></p>
            <p>Past: <strong>{tickets.filter(t => t.screeningTime && isPastScreening(t.screeningTime)).length}</strong></p>
          </div>

          <div className="tickets-list">
            {tickets.map(ticket => {
              const ticketStatus = getTicketStatus(ticket.screeningTime);
              
              return (
                <div key={ticket.id} className={`ticket-card ${ticketStatus.class}`}>
                  <div className="ticket-header">
                    <h3>{ticket.movieName}</h3>
                    <span className={`ticket-status ${ticketStatus.class}`}>
                      {ticketStatus.label}
                    </span>
                  </div>
                  
                  <div className="ticket-details">
                    <div className="detail-row">
                      <span className="label">Ticket ID:</span>
                      <span>#{ticket.id}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Date & Time:</span>
                      <span>{formatDateTime(ticket.screeningTime)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Room:</span>
                      <span>{ticket.room}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Duration:</span>
                      <span>{ticket.movieLength} minutes</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Genre:</span>
                      <span>{ticket.movieGenre}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Age Limit:</span>
                      <span>{ticket.movieAgeLimit}+</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Email:</span>
                      <span>{ticket.email}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Phone:</span>
                      <span>{ticket.phoneNumber}</span>
                    </div>
                    <div className="detail-row price-row">
                      <span className="label">Price:</span>
                      <span className="price">{formatPrice(ticket.price)}</span>
                    </div>
                  </div>

                  <div className="ticket-actions">
                    {ticketStatus.status === 'refundable' && (
                      <button 
                        className="btn-refund"
                        onClick={() => handleRefund(ticket.id, ticket.screeningTime)}
                      >
                        Refund Ticket
                      </button>
                    )}
                    {ticketStatus.status === 'non-refundable' && (
                      <p className="refund-info">
                        Refund not available within 4 hours of screening
                      </p>
                    )}
                    {ticketStatus.status === 'past' && (
                      <p className="refund-info">
                        Screening has already taken place
                      </p>
                    )}
                    {ticketStatus.status === 'unknown' && (
                      <p className="refund-info">
                        Screening information unavailable
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTickets;