import { MantineProvider, AppShell, Title, Container } from '@mantine/core';
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
          <AppShell.Header p="md">
            <Title order={2}>Jegymester</Title>
          </AppShell.Header>
          <AppShell.Navbar p="md">
            <NavLink component={Link} to="/" label="Film lista" />
            <NavLink component={Link} to="/add-movie" label="Új film" />
            <NavLink component={Link} to="/update-movie" label="Film frissítése" /> {/* Fixed typo in path */}
            <NavLink component={Link} to="/screenings" label="Vetítés lista" />
            <NavLink component={Link} to="/add-screening" label="Új vetítés" />
            <NavLink component={Link} to="/update-screening" label="Vetítés frissítése" />
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