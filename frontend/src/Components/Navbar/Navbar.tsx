import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../AuthContext';
import { SearchFilters } from '../../App';
import dayjs from 'dayjs';
import SearchDropdownMenu from './SearcgDropdownMenu/SearchDropdownMenu';
import { Dropdown } from 'react-bootstrap';

type NavbarProps = {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onSearch: (filters: SearchFilters) => void;
};

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
    setIsDropdownVisible(false); // 隐藏下拉菜单
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
    setIsDropdownVisible(false); // 隐藏下拉菜单
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set to true if token exists, false otherwise
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
            alt="" width="auto" height="36" className="d-inline-block align-text-top" />
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
            {renderAvatar()}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
