import { useState } from 'react';
import { MantineProvider, Container, Title, TextInput, NumberInput, Button, Group, Text, Alert, Card, LoadingOverlay } from '@mantine/core';

// Define validation patterns and error messages
const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s\-:,.!?()]{2,100}$/;
const GENRE_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-,]{2,50}$/;
const ID_PATTERN = /^\d+$/;

// Define types for movie data
interface Movie {
  id: number;
  name: string;
  length: number;
  genre: string;
  ageLimit: number;
}

interface MovieForm {
  name: string;
  length: number | '';
  genre: string;
  ageLimit: number | '';
}

interface FormErrors {
  id?: string;
  name?: string;
  length?: string;
  genre?: string;
  ageLimit?: string;
}

function UpdateMovie() {
  // State for movie ID
  const [id, setId] = useState('');
  const [idError, setIdError] = useState('');
  
  // State for form
  const [form, setForm] = useState<MovieForm>({
    name: '',
    length: '',
    genre: '',
    ageLimit: ''
  });
  
  // State for UI
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [movieFound, setMovieFound] = useState(false);
  
  // Validate ID input
  const validateId = (value: string): string => {
    if (!value.trim()) return 'Az ID megadása kötelező';
    if (!ID_PATTERN.test(value)) return 'Az ID csak számokat tartalmazhat';
    return '';
  };
  
  // Handle ID change
  const handleIdChange = (value: string) => {
    setId(value);
    setIdError(validateId(value));
    
    // Reset movie data if ID changes
    if (movieFound) {
      setMovieFound(false);
    }
  };
  
  // Validate a single field
  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'A film nevét kötelező megadni';
        if (!NAME_PATTERN.test(value)) return 'A film neve érvénytelen karaktereket tartalmaz';
        return '';
      case 'length':
        if (value === '' || value === null) return 'A film hosszát kötelező megadni';
        if (typeof value === 'number' && (value <= 0 || value > 600)) 
          return 'A film hossza 1 és 600 perc között lehet';
        return '';
      case 'genre':
        if (!value.trim()) return 'A műfajt kötelező megadni';
        if (!GENRE_PATTERN.test(value)) return 'A műfaj érvénytelen karaktereket tartalmaz';
        return '';
      case 'ageLimit':
        if (value === '' || value === null) return 'A korhatárt kötelező megadni';
        if (typeof value === 'number' && (value < 0 || value > 18 || !Number.isInteger(value)))
          return 'A korhatár 0 és 18 közötti egész szám lehet';
        return '';
      default:
        return '';
    }
  };
  
  // Handle change in any input field
  const handleChange = (name: string, value: any) => {
    // Update form state
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate and update errors
    const errorMessage = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };
  
  // Validate entire form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    
    // Validate each field
    Object.keys(form).forEach(key => {
      const fieldName = key as keyof MovieForm;
      const errorMessage = validateField(fieldName, form[fieldName]);
      if (errorMessage) {
        newErrors[fieldName] = errorMessage;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Fetch movie data by ID
  const fetchMovie = async () => {
    const error = validateId(id);
    if (error) {
      setIdError(error);
      return;
    }
    
    setIsSearching(true);
    setMessage('');
    setIsError(false);
    
    try {
      const response = await fetch(`http://localhost:5214/api/Movie/get-movie/${id}`);
      
      if (response.ok) {
        const movieData: Movie = await response.json();
        setForm({
          name: movieData.name,
          length: movieData.length,
          genre: movieData.genre,
          ageLimit: movieData.ageLimit
        });
        setMovieFound(true);
        setMessage('Film betöltve, szerkesztheti az adatokat.');
        setIsError(false);
      } else {
        setMovieFound(false);
        if (response.status === 404) {
          setMessage('A megadott ID-vel nem található film.');
        } else {
          setMessage(`Hiba történt: ${response.statusText}`);
        }
        setIsError(true);
      }
    } catch (error) {
      console.error('Hiba történt:', error);
      setMessage('Hiba történt a szerverrel való kommunikáció során');
      setIsError(true);
      setMovieFound(false);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Create Update DTO object
  const createUpdateDto = () => {
    return {
      name: form.name,
      length: typeof form.length === 'string' ? parseInt(form.length || '0') : form.length,
      genre: form.genre,
      ageLimit: typeof form.ageLimit === 'string' ? parseInt(form.ageLimit || '0') : form.ageLimit
    };
  };
  
  // Handle form submission for update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    
    // Validate all fields before submission
    if (!validateForm()) {
      return;
    }
    
    const updateDto = createUpdateDto();
    
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5214/api/Movie/update-movie/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateDto),
      });
      
      if (response.ok) {
        setMessage('Film sikeresen frissítve!');
        setIsError(false);
      } else {
        const errorText = await response.text();
        setMessage(`Hiba történt: ${errorText || response.statusText}`);
        setIsError(true);
      }
    } catch (error) {
      console.error('Hiba történt:', error);
      setMessage('Hiba történt a szerverrel való kommunikáció során');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <MantineProvider>
      <Container size="sm">
        <Title order={2} mb="md">Film frissítése</Title>
        
        {message && (
          <Alert 
            color={isError ? "red" : "green"} 
            title={isError ? "Hiba" : "Sikeres művelet"}
            mb="md"
            withCloseButton
            onClose={() => setMessage('')}
          >
            {message}
          </Alert>
        )}
        
        <Card shadow="sm" padding="lg" mb="md">
          <Title order={4} mb="md">Film keresése</Title>
          <Group align="flex-end">
            <TextInput
              label="Film ID"
              placeholder="Adja meg a film azonosítóját"
              value={id}
              onChange={(e) => handleIdChange(e.target.value)}
              error={idError}
              required
              style={{ flex: 1 }}
              disabled={isSearching}
            />
            <Button 
              onClick={fetchMovie} 
              loading={isSearching}
              disabled={!!idError || !id}
            >
              Film keresése
            </Button>
          </Group>
        </Card>
        
        <div style={{ position: 'relative' }}>
          <LoadingOverlay visible={isLoading} />
          
          <form onSubmit={handleSubmit}>
            <Title order={4} mb="md">Film adatainak módosítása</Title>
            
            <TextInput
              label="Név"
              placeholder="Például: A nagy kaland"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
              required
              mb="md"
              disabled={!movieFound || isLoading}
            />
            
            <NumberInput
              label="Hossz (perc)"
              placeholder="Például: 120"
              value={form.length}
              onChange={(value) => handleChange('length', value)}
              error={errors.length}
              required
              min={1}
              max={600}
              mb="md"
              disabled={!movieFound || isLoading}
            />
            
            <TextInput
              label="Műfaj"
              placeholder="Például: Akció, Kaland"
              value={form.genre}
              onChange={(e) => handleChange('genre', e.target.value)}
              error={errors.genre}
              required
              mb="md"
              disabled={!movieFound || isLoading}
            />
            
            <NumberInput
              label="Korhatár"
              placeholder="Például: 12"
              value={form.ageLimit}
              onChange={(value) => handleChange('ageLimit', value)}
              error={errors.ageLimit}
              required
              min={0}
              max={18}
              mb="md"
              //precision={0}
              disabled={!movieFound || isLoading}
            />
            
            <Group justify="flex-end" mt="xl">
              <Button 
                type="submit" 
                loading={isLoading}
                disabled={!movieFound || Object.values(errors).some(error => !!error) || isLoading}
              >
                Film frissítése
              </Button>
            </Group>
          </form>
        </div>
      </Container>
    </MantineProvider>
  );
}

export default UpdateMovie;