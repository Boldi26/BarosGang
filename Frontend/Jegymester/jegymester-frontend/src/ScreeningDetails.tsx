import { useState, useEffect } from 'react';
import { 
  Container, 
  Title, 
  Card, 
  Text, 
  Group, 
  Button, 
  Divider,
  Collapse
} from '@mantine/core';
import { useAuth } from './AuthContext';
import TicketPurchase from './TicketPurchase';

interface Movie {
  id: number;
  name: string;
  length: number;
  genre: string;
  ageLimit: number;
}

interface Screening {
  id: number;
  movieId: number;
  startTime: string;
  room: number;
  price: number;
  capacity: number;
  movie?: Movie;
}

function ScreeningCard({ screening }: { screening: Screening }) {
  const [showPurchase, setShowPurchase] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isAdmin, hasRole } = useAuth();
  const isCashier = hasRole('Cashier');

  const canPurchaseTicket = (isAuthenticated && !isAdmin) || isCashier;

  useEffect(() => {
    const fetchMovie = async () => {
      if (!screening.movie && screening.movieId) {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5214/api/Movie/GetMovie/${screening.movieId}`);
          if (response.ok) {
            const data = await response.json();
            setMovie(data);
          }
        } catch (error) {
          console.error('Error fetching movie:', error);
        } finally {
          setLoading(false);
        }
      } else if (screening.movie) {
        setMovie(screening.movie);
      }
    };
    
    fetchMovie();
  }, [screening]);

  const formatDate = (isoString: string) => {
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('hu-HU', { 
      style: 'currency', 
      currency: 'HUF',
      maximumFractionDigits: 0 
    }).format(price);
  };

  const handlePurchaseSuccess = () => {
    setShowPurchase(false);
  };

  return (
    <Card shadow="sm" padding="md" mb="md">
      <Group justify="space-between" mb="xs">
        <Title order={4}>{movie?.name || `Film ID: ${screening.movieId}`}</Title>
        <Text>{formatPrice(screening.price)}</Text>
      </Group>

      <Text size="sm" mb="xs">Időpont: {formatDate(screening.startTime)}</Text>
      <Text size="sm" mb="xs">Terem: {screening.room}</Text>
      
      {movie && (
        <>
          <Text size="sm" mb="xs">Műfaj: {movie.genre}</Text>
          <Text size="sm" mb="xs">Hossz: {movie.length} perc</Text>
          <Text size="sm" mb="xs">Korhatár: {movie.ageLimit}+</Text>
        </>
      )}

      {canPurchaseTicket && (
        <>
          <Divider my="sm" />
          <Group justify="flex-end">
            <Button 
              onClick={() => setShowPurchase(!showPurchase)}
              variant={showPurchase ? "outline" : "filled"}
            >
              {showPurchase ? 'Mégsem' : 'Jegyvásárlás'}
            </Button>
          </Group>

          <Collapse in={showPurchase}>
            <TicketPurchase 
              screeningId={screening.id}
              price={screening.price}
              movieName={movie?.name || `Film ID: ${screening.movieId}`}
              startTime={screening.startTime}
              onSuccess={handlePurchaseSuccess}
            />
          </Collapse>
        </>
      )}
    </Card>
  );
}

function ScreeningDetails() {
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScreenings = async () => {
      try {
        const response = await fetch('http://localhost:5214/api/Screening/list');
        if (!response.ok) throw new Error('Failed to fetch screenings');
        const data = await response.json();
        setScreenings(data);
      } catch (err) {
        setError('Hiba történt a vetítések betöltése során.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchScreenings();
  }, []);

  if (loading) return <Container><Text>Betöltés...</Text></Container>;
  if (error) return <Container><Text color="red">{error}</Text></Container>;
  if (screenings.length === 0) return <Container><Text>Nincs elérhető vetítés</Text></Container>;

  return (
    <Container>
      <Title order={2} mb="lg">Elérhető vetítések</Title>
      {screenings.map(screening => (
        <ScreeningCard key={screening.id} screening={screening} />
      ))}
    </Container>
  );
}

export default ScreeningDetails;
