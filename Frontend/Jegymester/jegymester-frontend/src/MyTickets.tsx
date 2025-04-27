import { useState, useEffect } from 'react';
import { 
  Container, 
  Title, 
  Table, 
  Text, 
  Button, 
  Center, 
  Group,
  Alert
} from '@mantine/core';
import { useAuth } from './AuthContext';

interface Ticket {
  id: number;
  screeningId: number;
  userId?: number;
  email?: string;
  phoneNumber?: string;
  screeningDetails?: {
    movieName: string;
    startTime: string;
    room: number;
    price: number;
  };
}

interface Screening {
  id: number;
  movieId: number;
  startTime: string;
  room: number;
  price: number;
  capacity: number;
}

function MyTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { getToken, user } = useAuth();

  const fetchScreenings = async () => {
    try {
      const response = await fetch('http://localhost:5214/api/Screening/List');
      if (response.ok) {
        const data = await response.json();
        setScreenings(data);
        return data;
      }
      return [];
    } catch (err) {
      console.error('Error fetching screenings:', err);
      return [];
    }
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        setError('Bejelentkezés szükséges');
        setLoading(false);
        return;
      }

      const allScreenings = await fetchScreenings();

      const response = await fetch('http://localhost:5214/api/Ticket/List', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }

      let data = await response.json();
      
      const ticketsWithDetails = await Promise.all(data.map(async (ticket: Ticket) => {
        try {
          const screening = allScreenings.find((s: any) => s.id === ticket.screeningId);
          
          if (screening) {
            try {
             const movieResponse = await fetch(`http://localhost:5214/api/Movie/GetMovie/${screening.movieId}`);
              let movieName = `Film #${screening.movieId}`;
              
              if (movieResponse.ok) {
                const movieData = await movieResponse.json();
                movieName = movieData.name;
              }
              
              return {
                ...ticket,
                screeningDetails: {
                  movieName: movieName,
                  startTime: screening.startTime,
                  room: screening.room,
                  price: screening.price
                }
              };
            } catch (err) {
              console.error('Error fetching movie:', err);
              return {
                ...ticket,
                screeningDetails: {
                  movieName: `Film #${screening.movieId}`,
                  startTime: screening.startTime,
                  room: screening.room,
                  price: screening.price
                }
              };
            }
          }
          return ticket;
        } catch (err) {
          console.error('Error processing ticket:', err);
          return ticket;
        }
      }));
      
      setTickets(ticketsWithDetails);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Hiba történt a jegyek betöltése közben');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleDeleteTicket = async (id: number) => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`http://localhost:5214/api/Ticket/delete-ticket/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSuccessMessage('Jegy sikeresen törölve!');
        setTickets(tickets.filter(t => t.id !== id));
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        const errorText = await response.text();
        setError(errorText || 'Hiba történt a jegy törlése közben');
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    } catch (err) {
      console.error('Error deleting ticket:', err);
      setError('Hiba történt a jegy törlése közben');
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'N/A';
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Budapest'
    };
    return new Date(isoString).toLocaleString('hu-HU', options);
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    
    return new Intl.NumberFormat('hu-HU', { 
      style: 'currency', 
      currency: 'HUF',
      maximumFractionDigits: 0 
    }).format(price);
  };

  if (loading) {
    return <Container><Text>Betöltés...</Text></Container>;
  }

  return (
    <Container>
      <Title order={2} mb="md">Jegyeim</Title>
      
      {error && (
        <Alert color="red" title="Hiba" mb="md">
          {error}
        </Alert>
      )}
      
      {successMessage && (
        <Alert color="green" title="Sikeres művelet" mb="md">
          {successMessage}
        </Alert>
      )}
      
      {tickets.length === 0 ? (
        <Center>
          <Text>Nincs megvásárolt jegyed</Text>
        </Center>
      ) : (
        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>Film</th>
              <th>Időpont</th>
              <th>Terem</th>
              <th>Ár</th>
              <th>Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id}>
                <td>{ticket.screeningDetails?.movieName || `Vetítés #${ticket.screeningId}`}</td>
                <td>{formatDate(ticket.screeningDetails?.startTime)}</td>
                <td>{ticket.screeningDetails?.room || 'N/A'}</td>
                <td>{formatPrice(ticket.screeningDetails?.price)}</td>
                <td>
                  <Group>
                    <Button
                      color="red"
                      size="xs"
                      onClick={() => handleDeleteTicket(ticket.id)}
                    >
                      Törlés
                    </Button>
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default MyTickets;

