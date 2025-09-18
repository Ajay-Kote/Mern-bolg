import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import './Navbar.scss';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <h2>MERN Blog</h2>
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/blogs" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
            Blogs
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/create-blog" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                Write
              </Link>
              <Link to="/my-blogs" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                My Blogs
              </Link>
              {user?.id && (
                <Link to={`/profile/${user.id}`} className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                  Profile
                </Link>
              )}
              <button className="navbar-link logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Link to="/signup" className="navbar-link signup-btn" onClick={() => setIsMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        <div className="navbar-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
