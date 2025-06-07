import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import Movies from './components/Movies';
import Screenings from './components/Screenings';
import MyTickets from './components/MyTickets';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;

        if (payload.exp > currentTime) {
          setUser({
            id: payload[Object.keys(payload).find(key => key.includes('nameidentifier'))],
            email: payload[Object.keys(payload).find(key => key.includes('email'))],
            phoneNumber: payload[Object.keys(payload).find(key => key.includes('mobilephone'))],
            roles: Object.keys(payload)
              .filter(key => key.includes('role'))
              .map(key => payload[key])
          });
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        id: payload[Object.keys(payload).find(key => key.includes('nameidentifier'))],
        email: payload[Object.keys(payload).find(key => key.includes('email'))],
        phoneNumber: payload[Object.keys(payload).find(key => key.includes('mobilephone'))],
        roles: Object.keys(payload)
          .filter(key => key.includes('role'))
          .map(key => payload[key])
      });
    } catch (error) {
      console.error('Error parsing token:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAdmin = () => {
    return user && user.roles && user.roles.some(role =>
      typeof role === 'string' ? role === 'Admin' : role.includes('Admin')
    );
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        {user && <Navbar user={user} onLogout={handleLogout} isAdmin={isAdmin()} />}

        <Routes>
          <Route
            path="/login"
            element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={user && isAdmin() ? <AdminDashboard /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/movies"
            element={user ? <Movies /> : <Navigate to="/login" />}
          />
          <Route
            path="/screenings"
            element={user ? <Screenings user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/tickets"
            element={user ? <MyTickets /> : <Navigate to="/login" />}
          />
          <Route
            path="/"
            element={<Navigate to={user ? "/dashboard" : "/login"} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
