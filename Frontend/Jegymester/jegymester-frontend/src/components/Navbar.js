import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout, isAdmin }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        🎬 Jegymester
      </div>
      
      <ul className="navbar-nav">
        <li>
			  <Link 
				to={isAdmin ? "/admin" : "/dashboard"} 
				className={isActive(isAdmin ? '/admin' : '/dashboard')}
			  >
				Dashboard
			  </Link>
			</li>
        <li>
          <Link to="/movies" className={isActive('/movies')}>
            Movies
          </Link>
        </li>
        <li>
          <Link to="/screenings" className={isActive('/screenings')}>
            Screenings
          </Link>
        </li>
        <li>
          <Link to="/tickets" className={isActive('/tickets')}>
            My Tickets
          </Link>
        </li>
      </ul>

      <div className="user-info">
        <span>Welcome, {user.email}</span>
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;