import { MantineProvider, AppShell, Title, Container, Group } from '@mantine/core';
import { NavLink } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ScreeningList from './ScreeningList';
import AddScreening from './AddScreening';
import UpdateScreening from './UpdateScreening';
import MovieList from './MovieList';
import AddMovie from './AddMovie';
import UpdateMovie from './UpdateMovie';

function App() {
  return (
    <MantineProvider>
      <Router>
        <AppShell
          header={{ height: 60 }}
          navbar={{ width: 200, breakpoint: 'sm' }}
        >
          <AppShell.Header p="md" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Title order={2}>Jegymester</Title>
          </AppShell.Header>
          <AppShell.Navbar p="md" style={{ backgroundColor: '#8B4513', padding: '2rem', height: '60px' }}>
            <Group style={{ display: 'flex', flexDirection: 'row', gap: '1rem', fontFamily: 'Arial, sans-serif',
              fontSize: '1.2rem', fontWeight: 'bold', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
            <NavLink component={Link} to="/" label="Film lista" style={{color: 'black'}} />
            <NavLink component={Link} to="/add-movie" label="Új film" style={{color: 'black'}} />
            <NavLink component={Link} to="/update-movie" label="Film frissítése" style={{color: 'black'}}/> {/* Fixed typo in path */}
            <NavLink component={Link} to="/screenings" label="Vetítés lista" style={{color: 'black'}}/>
            <NavLink component={Link} to="/add-screening" label="Új vetítés" style={{color: 'black'}}/>
            <NavLink component={Link} to="/update-screening" label="Vetítés frissítése" style={{color: 'black'}}/>
          </Group>
          </AppShell.Navbar>
          <AppShell.Main>
            <Container>
              <Routes>
                <Route path="/" element={<MovieList />} />
                <Route path="/add-movie" element={<AddMovie />} />
                <Route path="/update-movie" element={<UpdateMovie />} />
                <Route path="/screenings" element={<ScreeningList />} />
                <Route path="/add-screening" element={<AddScreening />} />
                <Route path="/update-screening" element={<UpdateScreening />} />
              </Routes>
            </Container>
          </AppShell.Main>
        </AppShell>
      </Router>
    </MantineProvider>
  );
}

export default App;