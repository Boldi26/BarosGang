import { useState } from 'react';
import { MantineProvider, Container, Title, TextInput, Button, Group, Text, PasswordInput, Card, Divider, Alert } from '@mantine/core';
import { useNavigate, Link } from 'react-router-dom';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  phoneNumber?: string;
}

function Register() {
  const [form, setForm] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'Az e-mail cím megadása kötelező';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Érvénytelen e-mail cím formátum';
        return '';
      case 'password':
        if (!value) return 'A jelszó megadása kötelező';
        if (value.length < 6) return 'A jelszó legalább 6 karakter legyen';
        return '';
      case 'confirmPassword':
        if (!value) return 'A jelszó megerősítése kötelező';
        if (value !== form.password) return 'A jelszavak nem egyeznek';
        return '';
      case 'phoneNumber':
        if (!value.trim()) return 'A telefonszám megadása kötelező';
        if (!/^(\+36|06)[ -]?\d{1,2}[ -]?\d{3}[ -]?\d{4}$/.test(value.replace(/\s/g, ''))) 
          return 'Érvénytelen telefonszám formátum (pl. +36 30 123 4567)';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (name: string, value: string) => {
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
      const fieldName = key as keyof RegisterFormData;
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
    setApiError('');
    
    if (!validateForm()) {
      return;
    }

    const registrationData = {
      email: form.email,
      password: form.password,
      phoneNumber: form.phoneNumber,
      roleIds: [2] 
    };
    

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5214/api/User/Register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      let data;
      const responseText = await response.text();
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (error) {
        console.error('JSON elemzési hiba:', error);
        data = { message: 'Hibás válasz a szervertől' };
      }
      
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        console.error('Szerver válasz:', data);
        setApiError(data.message || `Regisztráció sikertelen: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Hiba történt:', error);
      setApiError('Hiba történt a szerverrel való kommunikáció során');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MantineProvider>
      <Container size="xs" mt="xl">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={2} mb="md" ta="center">Regisztráció</Title>
          
          {apiError && (
            <Alert color="red" title="Hiba" mb="md">
              {apiError}
            </Alert>
          )}
          
          {success && (
            <Alert color="green" title="Sikeres regisztráció" mb="md">
              Regisztrációja sikeres volt! Átirányítjuk a bejelentkezési oldalra...
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <TextInput
              label="E-mail cím"
              placeholder="pelda@domain.hu"
              required
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              mb="md"
            />
            
            <TextInput
              label="Telefonszám"
              placeholder="+36 30 123 4567"
              required
              value={form.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              error={errors.phoneNumber}
              mb="md"
            />
            
            <PasswordInput
              label="Jelszó"
              placeholder="Adjon meg egy jelszót"
              required
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
              mb="md"
            />
            
            <PasswordInput
              label="Jelszó megerősítése"
              placeholder="Jelszó megerősítése"
              required
              value={form.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              mb="xl"
            />
            
            <Group justify="center">
              <Button type="submit" loading={loading} fullWidth disabled={success}>
                Regisztráció
              </Button>
            </Group>
          </form>
          
          <Divider my="md" labelPosition="center" label="vagy" />
          
          <Text ta="center" size="sm">
            Már van fiókja? <Link to="/login">Jelentkezzen be</Link>
          </Text>
        </Card>
      </Container>
    </MantineProvider>
  );
}

export default Register;