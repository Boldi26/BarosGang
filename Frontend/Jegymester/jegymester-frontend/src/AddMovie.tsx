import { useState } from 'react';
import { MantineProvider, Container, Title, TextInput, NumberInput, Button, Group, Text, Alert, ActionIcon } from '@mantine/core';

const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s\-:,.!?()]{2,100}$/;
const GENRE_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-,]{2,50}$/;

interface MovieForm {
  name: string;
  length: number | '';
  genre: string;
  ageLimit: number | '';
}

interface FormErrors {
  name?: string;
  length?: string;
  genre?: string;
  ageLimit?: string;
}

function AddMovie() {
  const [form, setForm] = useState<MovieForm>({
    name: '',
    length: '',
    genre: '',
    ageLimit: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  const handleChange = (name: string, value: any) => {
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    const errorMessage = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    
    if (!validateForm()) {
      return;
    }

    const formData = {
      name: form.name,
      length: typeof form.length === 'string' ? parseInt(form.length || '0') : form.length,
      genre: form.genre,
      ageLimit: typeof form.ageLimit === 'string' ? parseInt(form.ageLimit || '0') : form.ageLimit
    };

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5214/api/Movie/add-movie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Film sikeresen hozzáadva!');
        setForm({ name: '', length: '', genre: '', ageLimit: '' });
        setIsError(false);
      } else {
        setMessage(`Hiba történt: ${data.message || response.statusText}`);
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
        <Title order={2} mb="md">Új film hozzáadása</Title>
        
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
        
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Film címe"
            placeholder="Például: A nagy kaland"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            required
            mb="md"
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
            rightSection={
              <Group gap={5}>
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  onClick={() => setForm(prev => ({
                    ...prev,
                    length: Math.min(600, (typeof prev.length === 'number' ? prev.length : 0) + 1)
                  }))}
                >
                  +
                </ActionIcon>
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  onClick={() => setForm(prev => ({
                    ...prev,
                    length: Math.max(1, (typeof prev.length === 'number' ? prev.length : 0) - 1)
                  }))}
                >
                  -
                </ActionIcon>
              </Group>
            }
          />
          
          <TextInput
            label="Műfaj"
            placeholder="Például: Akció, Kaland"
            value={form.genre}
            onChange={(e) => handleChange('genre', e.target.value)}
            error={errors.genre}
            required
            mb="md"
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
            rightSection={
              <Group gap={5}>
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  onClick={() => setForm(prev => ({
                    ...prev,
                    ageLimit: Math.min(18, (typeof prev.ageLimit === 'number' ? prev.ageLimit : 0) + 1)
                  }))}
                >
                  +
                </ActionIcon>
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  onClick={() => setForm(prev => ({
                    ...prev,
                    ageLimit: Math.max(0, (typeof prev.ageLimit === 'number' ? prev.ageLimit : 0) - 1)
                  }))}
                >
                  -
                </ActionIcon>
              </Group>
            }
          />
          
          <Group justify="flex-end" mt="xl">
            <Button 
              type="submit" 
              loading={isLoading}
              disabled={Object.values(errors).some(error => !!error)}
            >
              {isLoading ? 'Feldolgozás...' : 'Film hozzáadása'}
            </Button>
          </Group>
        </form>
      </Container>
    </MantineProvider>
  );
}

export default AddMovie;