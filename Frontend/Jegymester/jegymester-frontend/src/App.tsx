import { NavLink } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ScreeningList from './ScreeningList';
import AddScreening from './AddScreening';
import UpdateScreening from './UpdateScreening';
import MovieList from './MovieList';
import AddMovie from './AddMovie';
import UpdateMovie from './UpdateMovie';
import Login from './Login';
import Register from './Register';
import ScreeningDetails from './ScreeningDetails';
import MyTickets from './MyTickets';
import { AuthProvider, useAuth } from './AuthContext';
import { MantineProvider, AppShell, Title, Container, Group, Button, Text } from '@mantine/core';

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function AppContent() {
  const { isAuthenticated, isAdmin, hasRole, logout, user } = useAuth();
  const isCashier = hasRole('Cashier');

  return (
    <Router>
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 200, breakpoint: 'sm' }}
      >
        <AppShell.Header p="md" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Title order={2}>Jegymester</Title>
          <Group>
            {isAuthenticated ? (
              <>
                <Text size="sm">Üdvözöljük, {user?.username}!</Text>
                <Button onClick={logout} variant="subtle" size="xs">Kijelentkezés</Button>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" variant="subtle" size="xs">Bejelentkezés</Button>
                <Button component={Link} to="/register" variant="subtle" size="xs">Regisztráció</Button>
              </>
            )}
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md" style={{ backgroundColor: '#8B4513', padding: '2rem', height: '60px' }}>
          <Group style={{ display: 'flex', flexDirection: 'row', gap: '1rem', fontFamily: 'Arial, sans-serif',
            fontSize: '1.2rem', fontWeight: 'bold', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
            <NavLink component={Link} to="/" label="Film lista" style={{color: 'black'}} />
            <NavLink component={Link} to="/screenings" label="Vetítés lista" style={{color: 'black'}}/>
            <NavLink component={Link} to="/screenings/details" label="Jegyvásárlás" style={{color: 'black'}}/>
            
            {isAuthenticated && !isAdmin && (
              <NavLink component={Link} to="/my-tickets" label="Jegyeim" style={{color: 'black'}}/>
            )}
            
            {isCashier && (
              <NavLink component={Link} to="/sell-tickets" label="Jegy eladás" style={{color: 'black'}}/>
            )}
            
            {isAdmin && (
              <>
                <NavLink component={Link} to="/add-movie" label="Új film" style={{color: 'black'}} />
                <NavLink component={Link} to="/update-movie" label="Film frissítése" style={{color: 'black'}}/>
                <NavLink component={Link} to="/add-screening" label="Új vetítés" style={{color: 'black'}}/>
                <NavLink component={Link} to="/update-screening" label="Vetítés frissítése" style={{color: 'black'}}/>
              </>
            )}
          </Group>
        </AppShell.Navbar>
        <AppShell.Main>
          <Container>
            <Routes>
              <Route path="/" element={<MovieList />} />
              <Route path="/screenings" element={<ScreeningList />} />
              <Route path="/screenings/details" element={<ScreeningDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/my-tickets" element={
                <ProtectedRoute>
                  <MyTickets />
                </ProtectedRoute>
              } />
              
              <Route path="/sell-tickets" element={
                <ProtectedRoute>
                  {isCashier ? <ScreeningDetails /> : <Navigate to="/" />}
                </ProtectedRoute>
              } />
              
              <Route path="/add-movie" element={
                <ProtectedAdminRoute>
                  <AddMovie />
                </ProtectedAdminRoute>
              } />
              <Route path="/update-movie" element={
                <ProtectedAdminRoute>
                  <UpdateMovie />
                </ProtectedAdminRoute>
              } />
              <Route path="/add-screening" element={
                <ProtectedAdminRoute>
                  <AddScreening />
                </ProtectedAdminRoute>
              } />
              <Route path="/update-screening" element={
                <ProtectedAdminRoute>
                  <UpdateScreening />
                </ProtectedAdminRoute>
              } />
            </Routes>
          </Container>
        </AppShell.Main>
      </AppShell>
    </Router>
  );
}

function App() {
  return (
    <MantineProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
