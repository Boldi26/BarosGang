import { useState } from 'react';
import { MantineProvider, Container, Title, TextInput, Button, Group, Text, NumberInput, ActionIcon } from '@mantine/core';

function AddScreening() {
  const [form, setForm] = useState({
    movieId: '',
    startTime: '',
    room: '',
    capacity: 0,
    price: 0,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!/^\d+$/.test(form.movieId)) {
      setError('A film azonosító csak szám lehet!');
      return false;
    }

    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(form.startTime)) {
      setError('A dátum formátuma hibás! Használja ezt a formátumot: ÉÉÉÉ-HH-NNTóó:pp (pl. 2025-04-05T14:30)');
      return false;
    }

    if (!form.room.trim()) {
      setError('A terem megadása kötelező!');
      return false;
    }

    if (form.capacity <= 0) {
      setError('A kapacitás pozitív szám kell legyen!');
      return false;
    }

    if (form.price <= 0) {
      setError('Az ár pozitív szám kell legyen!');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
  
    const payload = {
      MovieId: parseInt(form.movieId),
      StartTime: new Date(form.startTime).toISOString(),
      Room: parseInt(form.room),
      Capacity: form.capacity,
      Price: form.price,
    };
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5214/api/Screening/AddScreening', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        setMessage('Vetítés sikeresen hozzáadva!');
        setForm({ movieId: '', startTime: '', room: '', capacity: 0, price: 0 });
      } else {
        const errorData = await response.json();
        setError(`Hiba történt: ${response.status} - ${errorData.message || 'Ismeretlen hiba'}`);
      }
    } catch (error) {
      setError('Kapcsolódási hiba történt a szerverhez!');
      console.error('Hiba:', error);
    }
  };

  return (
    <MantineProvider>
      <Container size="sm" px="xs">
        <Title order={2} mb="md">Új vetítés hozzáadása</Title>

        {message && <Text color="green" mb="md">{message}</Text>}
        {error && <Text color="red" mb="md">{error}</Text>}

        <form onSubmit={handleSubmit}>
          <TextInput
            label="Film azonosító"
            placeholder="Pl. 123"
            value={form.movieId}
            onChange={(e) => setForm({ ...form, movieId: e.target.value })}
            mb="sm"
            required
            type="number"
          />

          <TextInput
            label="Kezdési idő"
            placeholder="ÉÉÉÉ-HH-NNTóó:pp (pl. 2025-04-05T14:30)"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            mb="sm"
            required
            type="datetime-local"
          />

          <TextInput
            label="Terem"
            placeholder="Pl. Terem 1"
            value={form.room}
            onChange={(e) => setForm({ ...form, room: e.target.value })}
            mb="sm"
            required
          />

          <NumberInput
            label="Kapacitás"
            placeholder="Pl. 50"
            value={form.capacity}
            onChange={(value) => setForm({ ...form, capacity: value as number })}
            mb="sm"
            required
            min={1}
            rightSection={
              <Group gap={5}>
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  onClick={() => setForm(prev => ({
                    ...prev,
                    capacity: prev.capacity + 1
                  }))}
                >
                  +
                </ActionIcon>
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  onClick={() => setForm(prev => ({
                    ...prev,
                    capacity: Math.max(1, prev.capacity - 1)
                  }))}
                >
                  -
                </ActionIcon>
              </Group>
            }
          />

          <NumberInput
            label="Ár (Ft)"
            placeholder="Pl. 1500"
            value={form.price}
            onChange={(value) => setForm({ ...form, price: value as number })}
            mb="lg"
            required
            min={1}
            decimalScale={2}
            rightSection={
              <Group gap={5}>
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  onClick={() => setForm(prev => ({
                    ...prev,
                    price: prev.price + 1
                  }))}
                >
                  +
                </ActionIcon>
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  onClick={() => setForm(prev => ({
                    ...prev,
                    price: Math.max(1, prev.price - 1)
                  }))}
                >
                  -
                </ActionIcon>
              </Group>
            }
          />

          <Group justify="flex-end" mt="md">
            <Button type="submit" color="blue">Hozzáadás</Button>
          </Group>
        </form>
      </Container>
    </MantineProvider>
  );
}

export default AddScreening;