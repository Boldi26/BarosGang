import { useEffect, useState } from 'react';
import { Container, Title, Table, Text, Center, Button } from '@mantine/core';
import { useAuth } from './AuthContext';

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
  const { isAdmin } = useAuth();

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
    if (!isAdmin) return;

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5214/api/Movie/DeleteMovie/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`  
        }
      });
      
      if (response.ok) {
        setMovies(movies.filter(m => m.id !== id));
      } else {
        console.error('Delete failed:', await response.text());
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
            {isAdmin && <th>ID</th>}
            <th>Név</th>
            <th>Műfaj</th>
            <th>Hossz</th>
            <th>Korhatár</th>
            {isAdmin && <th>Műveletek</th>}
          </tr>
        </thead>
        <tbody>
          {movies.map(movie => (
            <tr key={movie.id}>
              {isAdmin && <td>{movie.id}</td>}
              <td>{movie.name}</td>
              <td>{movie.genre}</td>
              <td>{movie.length} perc</td>
              <td>{movie.ageLimit}+</td>
              {isAdmin && (
                <td>
                  <Button color="red" onClick={() => handleDelete(movie.id)}>Törlés</Button>
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
      <Title order={2} style={{ marginBottom: '1.5rem' }}>Elérhető filmek</Title>
      {renderContent()}
    </Container>
  );
}

export default MovieList;
