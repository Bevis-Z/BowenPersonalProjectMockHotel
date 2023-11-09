import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../AuthContext';
import { SearchFilters } from '../../App';

type NavbarProps = {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onSearch: (filters: SearchFilters) => void;
};

function Navbar ({ onLoginClick, onRegisterClick, onSearch }: NavbarProps) {
  const [searchText, setSearchText] = useState('');
  const location = useLocation();
  const isRootPath = location.pathname === '/';
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  const handleSearch = () => {
    const filters: SearchFilters = {
      searchText,
      minBedrooms: 0,
      maxBedrooms: 0
    };
    onSearch(filters);
  };
  const navigate = useNavigate();
  const userLogout = async () => {
    const response = await fetch('http://localhost:5005/user/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({ token: localStorage.getItem('token') })
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      alert('Logout successfully');
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/');
    }
  }
  return (
    <nav className="navbar navbar-expand-lg" id={'navBar'}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/1200px-Airbnb_Logo_B%C3%A9lo.svg.png"
            alt="" width="auto" height="36" className="d-inline-block align-text-top" />
        </Link>
        {isRootPath && (
          <form className="d-flex" role="search">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={searchText}
                   onChange={(e) => setSearchText(e.target.value)}></input>
            <button className="btn btn-outline-success" type="submit" onClick={handleSearch}>Search</button>
          </form>
        )}
        <div className={'userButton dropdown'}>
          <div className="nav-item">
            <ul className="dropdown-menu dropdown-menu-lg-end">
              {isLoggedIn
                ? (
                  <>
                    <li><a className="dropdown-item" href="/Hosting">Manage listings</a></li>
                    <li><a className="dropdown-item" onClick={userLogout}>Logout</a></li>
                  </>)
                : (
                  <>
                    <li><a className="dropdown-item" onClick={onLoginClick}>Login</a></li>
                    <li><a className="dropdown-item" onClick={onRegisterClick}>Sign Up</a></li>
                  </>)}
            </ul>
          </div>
          <button className="navbar-nav me-auto mb-2 mb-lg-0" data-bs-toggle="dropdown" id={'navUser'} >
            <FaBars />
            <FaUserCircle
              color={'grey'} size="25px"
            />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
