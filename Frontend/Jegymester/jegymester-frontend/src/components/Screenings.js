import React, { useState, useEffect } from 'react';
import { getScreenings, getMovies, getTickets, purchaseTicket } from '../services/api';
import { useLocation } from 'react-router-dom';

const Screenings = ({ user }) => {
  const [screenings, setScreenings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedScreening, setSelectedScreening] = useState(null);
  const [ticketForm, setTicketForm] = useState({
    email: '',
    phoneNumber: '',
    quantity: 1
  });
const location = useLocation();
const searchParams = new URLSearchParams(location.search);
const movieFilterId = searchParams.get('movie');

useEffect(() => {
  loadData();
}, [user]);


  const loadData = async () => {
    try {
      const [screeningData, movieData] = await Promise.all([
	  getScreenings(),
	  getMovies()
	]);

	let ticketData = [];
	if (user) {
	  try {
		ticketData = await getTickets();
	  } catch (ticketErr) {
		console.warn("Ticket loading failed (likely not logged in):", ticketErr);
	  }
	}


      const now = new Date();
      const futureScreenings = screeningData
        .filter(screening => new Date(screening.startTime) > now)
        .map(screening => {
		  const movie = movieData.find(m => m.id === screening.movieId);
		  const soldCount = ticketData.filter(t => t.screeningId === screening.id).length;
		  return {
			...screening,
			movieName: movie?.name || 'Unknown',
			genre: movie?.genre || 'N/A',
			ageLimit: movie?.ageLimit ?? 'N/A',
			length: movie?.length ?? 'N/A',
			soldTickets: soldCount
		  };
		});


      const filteredScreenings = movieFilterId
	  ? futureScreenings.filter(s => s.movieId === parseInt(movieFilterId))
	  : futureScreenings;
	  
	  setScreenings(filteredScreenings);
      setMovies(movieData);
      setError('');
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load screenings or movies.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseTicket = (screening) => {
    setSelectedScreening(screening);
    setTicketForm({
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      quantity: 1
    });
  };

  const submitPurchase = async (e) => {
    e.preventDefault();
    try {
      const purchaseData = {
        screeningId: selectedScreening.id,
        email: ticketForm.email,
        phoneNumber: ticketForm.phoneNumber,
        userId: user?.id
      };

      for (let i = 0; i < ticketForm.quantity; i++) {
        await purchaseTicket(purchaseData);
      }

      setSuccess('Successfully purchased '+ticketForm.quantity+' ticket(s) for '+selectedScreening.movieName);
      setSelectedScreening(null);
      setError('');
	  await loadData();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to purchase ticket. ' + (err.response?.data || err.message));
      console.error('Error purchasing ticket:', err);
    }
  };

  const formatPrice = (price) => price.toFixed(0) + ' Ft';

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString('hu-HU') + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getAvailableSeats = (screening) => {
    const sold = screening.soldTickets ?? 0;
    return screening.capacity - sold;
  };

  if (loading) return <div className="loading">Loading screenings...</div>;

  return (
    <div className="screenings">
      <h1>Movie Screenings</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {screenings.length === 0 ? (
        <p>No upcoming screenings available.</p>
      ) : (
        <div className="screenings-grid">
          {screenings.map(screening => (
            <div key={screening.id} className="screening-card">
              <div className="screening-header">
                <h3>{screening.movieName}</h3>
                <p className="genre">{screening.genre}</p>
              </div>

              <div className="screening-details">
                <div className="detail-row">
                  <span className="label">Date & Time:</span>
                  <span>{formatDateTime(screening.startTime)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Room:</span>
                  <span>{screening.room}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Duration:</span>
                  <span>{screening.length} minutes</span>
                </div>
                <div className="detail-row">
                  <span className="label">Age Limit:</span>
                  <span>{screening.ageLimit}+</span>
                </div>
                <div className="detail-row">
                  <span className="label">Available Seats:</span>
                  <span>{getAvailableSeats(screening)} / {screening.capacity}</span>
                </div>
                <div className="detail-row price-row">
                  <span className="label">Price:</span>
                  <span className="price">{formatPrice(screening.price)}</span>
                </div>
              </div>

              <div className="screening-actions">
                {getAvailableSeats(screening) > 0 ? (
                  <button className="btn-primary" onClick={() => handlePurchaseTicket(screening)}>
                    Buy Ticket
                  </button>
                ) : (
                  <button className="btn-secondary" disabled>Sold Out</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedScreening && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Purchase Ticket</h2>
              <button className="close-btn" onClick={() => setSelectedScreening(null)}>×</button>
            </div>

            <div className="modal-body">
              <div className="screening-summary">
                <h3>{selectedScreening.movieName}</h3>
                <p>{formatDateTime(selectedScreening.startTime)}</p>
                <p>Room {selectedScreening.room}</p>
                <p>Genre: {selectedScreening.genre}</p>
                <p>Age Limit: {selectedScreening.ageLimit}+</p>
                <p>Duration: {selectedScreening.length} minutes</p>
                <p className="price">Price: {formatPrice(selectedScreening.price)} per ticket</p>
              </div>

              <form onSubmit={submitPurchase}>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={ticketForm.email}
                    onChange={(e) => setTicketForm({ ...ticketForm, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number:</label>
                  <input
                    type="tel"
                    value={ticketForm.phoneNumber}
                    onChange={(e) => setTicketForm({ ...ticketForm, phoneNumber: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Number of Tickets:</label>
                  <select
                    value={ticketForm.quantity}
                    onChange={(e) => setTicketForm({ ...ticketForm, quantity: parseInt(e.target.value) })}
                  >
                    {[...Array(Math.min(5, getAvailableSeats(selectedScreening)))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                <div className="total-price">
                  <strong>Total: {formatPrice(ticketForm.quantity * selectedScreening.price)}</strong>
                </div>

                <button type="submit" className="btn-primary">Confirm Purchase</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Screenings;