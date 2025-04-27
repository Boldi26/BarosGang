import { useState } from 'react';
import { 
  Container, 
  Title, 
  TextInput, 
  Button, 
  Group, 
  Box, 
  Text, 
  Alert
} from '@mantine/core';
import { useAuth } from './AuthContext';

interface TicketPurchaseProps {
  screeningId: number;
  price: number;
  movieName: string;
  startTime: string;
  onSuccess?: () => void;
}

function TicketPurchase({ screeningId, price, movieName, startTime, onSuccess }: TicketPurchaseProps) {
  const { isAuthenticated, isAdmin, hasRole, user, getToken } = useAuth();
  const isCashier = hasRole('Cashier');
  
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const formatPrice = (priceValue: number) => {
    return new Intl.NumberFormat('hu-HU', { 
      style: 'currency', 
      currency: 'HUF',
      maximumFractionDigits: 0 
    }).format(priceValue);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const ticketData: any = {
        screeningId: screeningId,
      };


      if (isCashier && (email || phoneNumber)) {
        ticketData.email = email;
        ticketData.phoneNumber = phoneNumber;
      } else if (user) {
        ticketData.userId = user.userId;
      }

      const token = getToken();
      
      console.log("Sending purchase request:", ticketData);
      
      const response = await fetch('http://localhost:5214/api/Ticket/purchase-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(ticketData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Ticket purchase successful:", result);
        setSuccess('Jegy sikeresen megvásárolva!');
        if (isCashier) {
          setEmail('');
          setPhoneNumber('');
        }
        if (onSuccess) {
          onSuccess();
        }
      } else {
        const errorText = await response.text();
        console.error("Ticket purchase failed:", errorText);
        setError(errorText || 'Hiba történt a jegyvásárlás során.');
      }
    } catch (err) {
      console.error('Purchase error:', err);
      setError('Hiba történt a jegyvásárlás során. Kérjük, próbálja újra később.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAdmin && !isCashier) {
    return (
      <Container size="sm">
        <Alert color="blue" title="Rendszergazdai figyelmeztetés">
          Rendszergazdai jogosultságokkal nem lehet jegyet vásárolni.
        </Alert>
      </Container>
    );
  }

  if (!isAuthenticated && !isCashier) {
    return (
      <Container size="sm">
        <Alert color="yellow" title="Bejelentkezés szükséges">
          Jegyvásárláshoz kérjük, jelentkezzen be.
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="sm">
      <Title order={3} mb="md">Jegyvásárlás</Title>
      
      <Box mb="lg">
        <Text fw={500}>Film: {movieName}</Text>
        <Text>Időpont: {formatDate(startTime)}</Text>
        <Text>Ár: {formatPrice(price)}</Text>
      </Box>

      {error && (
        <Alert color="red" title="Hiba" mb="md">
          {error}
        </Alert>
      )}

      {success && (
        <Alert color="green" title="Sikeres vásárlás" mb="md">
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {isCashier && (
          <>
            <TextInput
              label="E-mail cím"
              placeholder="pelda@email.hu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              mb="md"
              required
            />
            <TextInput
              label="Telefonszám"
              placeholder="+36201234567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              mb="md"
              required
            />
          </>
        )}

        <Group justify="flex-end" mt="md">
          <Button 
            type="submit" 
            loading={isSubmitting}
            disabled={isCashier && (!email || !phoneNumber)}
          >
            Jegy vásárlása
          </Button>
        </Group>
      </form>
    </Container>
  );
}

export default TicketPurchase;
