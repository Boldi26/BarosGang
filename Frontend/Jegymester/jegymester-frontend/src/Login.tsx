import { useState } from 'react';
import { MantineProvider, Container, Title, TextInput, Button, Group, Text, PasswordInput, Card, Divider, Alert } from '@mantine/core';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { jwtDecode } from "jwt-decode";

interface LoginFormData {
  email: string;
  password: string;
}

function Login() {
  const [form, setForm] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (name: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5214/api/User/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        
        console.log("Raw token received:", token.substring(0, 20) + "...");
        
        try {
          const decoded = jwtDecode(token);
          console.log("Decoded token payload:", decoded);
        } catch (err) {
          console.error("Error decoding token:", err);
        }
        
        login(token);
        navigate('/');
      } else {
        const data = await response.json();
        setError(data.message || 'Hibás e-mail cím vagy jelszó');
      }
    } catch (error) {
      console.error('Hiba történt:', error);
      setError('Hiba történt a szervervel való kommunikáció során');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MantineProvider>
      <Container size="xs" mt="xl">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={2} mb="md" ta="center">Bejelentkezés</Title>

          {error && (
            <Alert color="red" title="Hiba" mb="md" withCloseButton onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextInput
              label="E-mail cím"
              placeholder="Adja meg az e-mail címét"
              required
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              mb="md"
            />

            <PasswordInput
              label="Jelszó"
              placeholder="Adja meg a jelszavát"
              required
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              mb="xl"
            />

            <Group justify="center">
              <Button type="submit" loading={loading} fullWidth>
                Bejelentkezés
              </Button>
            </Group>
          </form>

          <Divider my="md" labelPosition="center" label="vagy" />

          <Text ta="center" size="sm">
            Még nincs fiókja? <Link to="/register">Regisztráljon itt</Link>
          </Text>
        </Card>
      </Container>
    </MantineProvider>
  );
}

export default Login;
