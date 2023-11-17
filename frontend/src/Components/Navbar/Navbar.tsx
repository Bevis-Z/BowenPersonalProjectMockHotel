import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../AuthContext';
import { SearchFilters } from '../../App';
import dayjs from 'dayjs';
import SearchDropdownMenu from './SearcgDropdownMenu/SearchDropdownMenu';
import { Dropdown } from 'react-bootstrap';
import { message } from 'antd';

type NavbarProps = {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onSearch: (filters: SearchFilters) => void;
};

// This is the Navbar component that will be rendered in the App component
function Navbar ({ onLoginClick, onRegisterClick, onSearch }: NavbarProps) {
  const [searchText, setSearchText] = useState('');
  const [minBedrooms, setMinBedrooms] = useState<number | null>(null);
  const [maxBedrooms, setMaxBedrooms] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [maxRating, setMaxRating] = useState<number | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const location = useLocation();
  const isRootPath = location.pathname === '/';
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false); // State to manage user menu visibility

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
    setSearchText('');
    setMinBedrooms(null);
    setMaxBedrooms(null);
    setDateRange([null, null]);
    setMinPrice(null);
    setMaxPrice(null);
    setMinRating(null);
    setMaxRating(null);
    onSearch({
      searchText: '',
      minBedrooms: null,
      maxBedrooms: null,
      startDate: null,
      endDate: null,
      minPrice: null,
      maxPrice: null,
      minRating: null,
      maxRating: null,
    });
    setIsDropdownVisible(false);
  };
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 阻止表单默认行为
    const filters: SearchFilters = {
      searchText,
      minBedrooms,
      maxBedrooms,
      startDate: dateRange[0] ? dateRange[0].toDate() : null,
      endDate: dateRange[1] ? dateRange[1].toDate() : null,
      minPrice,
      maxPrice,
      minRating,
      maxRating,
    };
    onSearch(filters);
    setIsDropdownVisible(false);
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
      message.success('Logout successfully');
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/');
    }
  }
  const toggleUserMenu = () => setShowUserMenu(!showUserMenu); // Handler to toggle user menu
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set to true if token exists, false otherwise
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserMenu(false); // 点击外部区域时关闭Dropdown弹窗
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const renderAvatar = () => {
    if (isLoggedIn) {
      return <FaUserCircle color={'#FF595F'} size="25px" />;
    }
    return <FaUserCircle color={'grey'} size="25px" />;
  };
  return (
    <nav className="navbar navbar-expand-lg" id={'navBar'}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/" onClick={handleReset}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/1200px-Airbnb_Logo_B%C3%A9lo.svg.png"
            alt="logo" width="auto" height="36" className="d-inline-block align-text-top" />
        </Link>
        {isRootPath && (
          <div className={'search-dropdown dropup'}>
            <Dropdown className={'dropup-center'}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Search
              </Dropdown.Toggle>
              <Dropdown.Menu className="centered-dropdown-menu">
                <SearchDropdownMenu
                  searchText={searchText}
                  setSearchText={setSearchText}
                  minBedrooms={minBedrooms}
                  setMinBedrooms={setMinBedrooms}
                  maxBedrooms={maxBedrooms}
                  setMaxBedrooms={setMaxBedrooms}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  minPrice={minPrice}
                  setMinPrice={setMinPrice}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  minRating={minRating}
                  setMinRating={setMinRating}
                  maxRating={maxRating}
                  setMaxRating={setMaxRating}
                  handleSearch={handleSearch}
                  handleReset={handleReset}
                />
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )}
        <div className="user-button" ref={dropdownRef}>
          <button
            className="navbar-nav me-auto mb-2 mb-lg-0"
            onClick={toggleUserMenu}
            id="navUser"
          >
            <FaBars className={'icon'}/>
            {renderAvatar()}
          </button>
          <Dropdown show={showUserMenu} className="custom-dropdown">
            <Dropdown.Menu>
              {
                isLoggedIn
                  ? (
                    <>
                      <Dropdown.Item href="/hosting">Manage listings</Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          userLogout();
                          setShowUserMenu(false); // Close the dropdown after logout
                        }}
                      >
                        Logout
                      </Dropdown.Item>
                    </>
                    )
                  : (
                    <>
                      <Dropdown.Item
                        onClick={() => {
                          onLoginClick();
                          setShowUserMenu(false); // Close the dropdown after login action
                        }}
                      >
                        Login
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          onRegisterClick();
                          setShowUserMenu(false); // Close the dropdown after register action
                        }}
                      >
                        Sign Up
                      </Dropdown.Item>
                    </>
                    )
              }
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
