import React, { useState } from 'react';
import './Navbar.css';
import Login from './Login';
import Signup from './Signup';

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="nav-buttons">
          <button 
            className="nav-button login" 
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
          <button 
            className="nav-button signup" 
            onClick={() => setShowSignup(true)}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
      {showSignup && <Signup onClose={() => setShowSignup(false)} />}
    </>
  );
};

export default Navbar; 