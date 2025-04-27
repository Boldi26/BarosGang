import { useEffect, useState } from 'react';
import { Container, Title, Table, Text, Center, Button } from '@mantine/core';
import { useAuth } from './AuthContext';

interface Screening {
  id: number;
  movieId: number;
  startTime: string;
  room: number;
  price: number;
  capacity: number;
}

function ScreeningList() {
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { isAdmin } = useAuth();

  const fetchScreenings = async () => {
    try {
      const response = await fetch('http://localhost:5214/api/Screening/list');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setScreenings(data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScreenings();
  }, []);

  const handleDelete = async (id: number) => {
    if (!isAdmin) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5214/api/Screening/DeleteScreening/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
      
      if (response.ok) {
        setScreenings(screenings.filter(s => s.id !== id));
      } else {
        console.error('Delete failed:', await response.text());
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };
  
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

  const renderContent = () => {
    if (loading) return <Center><Text>Betöltés...</Text></Center>;
    if (error) return <Center><Text color="red">Hiba történt</Text></Center>;
    if (screenings.length === 0) return <Center><Text>Nincs vetítés</Text></Center>;

    return (
      <Table striped highlightOnHover>
        <thead>
          <tr>
            {isAdmin && <th>ID</th>}
            {isAdmin && <th>Film ID</th>}
            <th>Dátum</th>
            <th>Terem</th>
            <th>Ár</th>
            {isAdmin && <th>Műveletek</th>}
          </tr>
        </thead>
        <tbody>
          {screenings.map(s => (
            <tr key={s.id}>
              {isAdmin && <td>{s.id}</td>}
              {isAdmin && <td>{s.movieId}</td>}
              <td>{formatDate(s.startTime)}</td>
              <td>{s.room}</td>
              <td>{formatPrice(s.price)}</td>
              {isAdmin && (
                <td>
                  <Button
                    color="red"
                    onClick={() => handleDelete(s.id)}
                    size="xs"
                  >
                    Törlés
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <Container>
      <Title order={2} mb="lg" ta="center">Vetítések</Title>
      {renderContent()}
    </Container>
  );
}

export default ScreeningList;
