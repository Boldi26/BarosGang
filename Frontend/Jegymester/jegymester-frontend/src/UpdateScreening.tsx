import { useState } from 'react';
import { MantineProvider, Container, Title, TextInput, Button, Group, Text } from '@mantine/core';

function UpdateScreening() {
  const [id, setId] = useState('');
  const [form, setForm] = useState({ 
    startTime: '', 
    room: '',
    capacity: '',
    price: ''
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5214/api/Screening/update-screening/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: new Date(form.startTime).toISOString(),
          room: parseInt(form.room),
          capacity: parseInt(form.capacity),
          price: parseInt(form.price)
        }),
      });
      
      if (response.ok) {
        setMessage('Vetítés sikeresen frissítve!');
        setForm({ startTime: '', room: '', capacity: '', price: '' });
        setId('');
      } else {
        const errorData = await response.json();
        setMessage(`Hiba: ${errorData.message || 'Ismeretlen hiba'}`);
      }
    } catch (error) {
      setMessage('Hálózati hiba történt');
    }
  };

  return (
    <MantineProvider>
      <Container>
        <Title order={2} mb="lg">Vetítés frissítése</Title>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Vetítés ID"
            placeholder="Add meg a vetítés ID-ját"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            mb="md"
          />
          
          <TextInput
            label="Kezdési időpont"
            type="datetime-local"
            value={form.startTime}
            onChange={(e) => setForm({...form, startTime: e.target.value})}
            required
            mb="md"
          />
          
          <TextInput
            label="Terem száma"
            type="number"
            placeholder="1-20 között"
            value={form.room}
            onChange={(e) => setForm({...form, room: e.target.value})}
            min={1}
            max={20}
            required
            mb="md"
          />
          
          <TextInput
            label="Férőhelyek száma"
            type="number"
            placeholder="1-500 között"
            value={form.capacity}
            onChange={(e) => setForm({...form, capacity: e.target.value})}
            min={1}
            max={500}
            required
            mb="md"
          />
          
          <TextInput
            label="Jegyár (HUF)"
            type="number"
            placeholder="1-100000 között"
            value={form.price}
            onChange={(e) => setForm({...form, price: e.target.value})}
            min={1}
            max={100000}
            required
            mb="md"
          />

          <Group mt="xl">
            <Button type="submit" size="md">Frissítés</Button>
          </Group>
        </form>
        
        {message && (
          <Text mt="md" color={message.includes("sikeresen") ? "green" : "red"}>
            {message}
          </Text>
        )}
      </Container>
    </MantineProvider>
  );
}

export default UpdateScreening;