import { useEffect, useState } from 'react';
import { MantineProvider, Container, Title, Table, Text, Center, Button } from '@mantine/core';

interface Screening {
  id: number;
  movieId: number;
  startTime: string;
  room: string;
}

function ScreeningList() {
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
    try {
      const response = await fetch(`http://localhost:5214/api/Screening/delete-screening/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setScreenings(screenings.filter(s => s.id !== id));
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

  const renderContent = () => {
    if (loading) return <Center><Text>Betöltés...</Text></Center>;
    if (error) return <Center><Text color="red">Hiba történt</Text></Center>;
    if (screenings.length === 0) return <Center><Text>Nincs vetítés</Text></Center>;

    return (
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Film ID</th>
            <th>Dátum</th>
            <th>Terem</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {screenings.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.movieId}</td>
              <td>{formatDate(s.startTime)}</td>
              <td>{s.room}</td>
              <td>
                <Button 
                  color="red" 
                  onClick={() => handleDelete(s.id)}
                  size="xs"
                >
                  Törlés
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <MantineProvider>
      <Container>
        <Title order={2} mb="lg" ta="center">Vetítések</Title>
        {renderContent()}
      </Container>
    </MantineProvider>
  );
}

export default ScreeningList;