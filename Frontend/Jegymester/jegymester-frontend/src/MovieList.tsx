import { useEffect, useState } from 'react';
import { MantineProvider, Container, Title, Table, Text, Center, Button } from '@mantine/core';

interface Movie {
  id: number;
  name: string;
  length: number;
  genre: string;
  ageLimit: number;
}

function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:5214/api/Movie/List');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5214/api/Movie/delete-movie/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMovies(movies.filter(m => m.id !== id));
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const renderContent = () => {
    if (loading) return <Center><Text>Betöltés...</Text></Center>;
    if (error) return <Center><Text color="red">Hiba történt</Text></Center>;
    if (movies.length === 0) return <Center><Text>Nincs film</Text></Center>;

    return (
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Név</th>
            <th>Műfaj</th>
            <th>Hossz</th>
            <th>Korhatár</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {movies.map(movie => (
            <tr key={movie.id}>
              <td>{movie.name}</td>
              <td>{movie.genre}</td>
              <td>{movie.length} perc</td>
              <td>{movie.ageLimit}+</td>
              <td>
                <Button color="red" onClick={() => handleDelete(movie.id)}>Törlés</Button>
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
        <Title order={2} mb="lg">Elérhető filmek</Title>
        {renderContent()}
      </Container>
    </MantineProvider>
  );
}

export default MovieList;