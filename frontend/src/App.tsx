import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import LandingPage from './Pages/LandingPage/LandingPage';
import Hosting from './Pages/Hosting/Hosting';
import LoginModal from './Components/User/LoginModal';
import RegisterModal from './Components/User/RegisterModal';
import Navbar from './Components/Navbar/Navbar';
import { AuthProvider } from './AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListingDetail from './Components/ListingDetail/ListingDetail';
import BookingDetails from './Components/BookingDetails/BookingDetails';

export interface SearchFilters {
  searchText: string;
  minBedrooms: number | null;
  maxBedrooms: number | null;
  startDate: Date | null;
  endDate: Date | null;
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;
  maxRating: number | null;
}
const initialSearchFilters: SearchFilters = {
  searchText: '',
  minBedrooms: null,
  maxBedrooms: null,
  startDate: null,
  endDate: null,
  minPrice: null,
  maxPrice: null,
  minRating: null,
  maxRating: null,
};
function App () {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(initialSearchFilters);

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  // Check if the current location has a background state
  const backgroundLocation = location.state && location.state.backgroundLocation;

  // Use to control the visibility of the modal
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // when the location changes, check if the path is '/login' or '/register'
  useEffect(() => {
    const currentPath = location.pathname;
    const isLoginRoute = currentPath === '/login';
    const isRegisterRoute = currentPath === '/register';

    setShowLoginModal(isLoginRoute);
    setShowRegisterModal(isRegisterRoute);
  }, [location]);

  const handleLoginClick = () => {
    // Set the background location state
    navigate('/login', { state: { backgroundLocation: location } });
  };
  const handleCloseModal = () => {
    setShowLoginModal(false);
    // If there is a background location, navigate to that location
    if (backgroundLocation) {
      navigate(backgroundLocation.pathname, { replace: true });
    } else {
      // Else navigate to the home page
      navigate('/', { replace: true });
    }
  };
  const handleRegisterClick = () => {
    // Set the background location state
    navigate('/register', { state: { backgroundLocation: location } });
  };
  return (
    <AuthProvider>
      <Navbar onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} onSearch={handleSearch}/>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<LandingPage searchFilters={searchFilters} />} />
        <Route path="/hosting" element={<Hosting />} />
        <Route path="/edit-hosting/:id" element={<Hosting />} />
        <Route path="/listing/:id" element={ <ListingDetail /> } />
        <Route path="/bookings/:listingId" element={<BookingDetails />} />
      </Routes>
      {/* When the current path equal to 'login' show loginModal */}
      {showLoginModal && (
        <LoginModal show={showLoginModal} onHide={handleCloseModal} />
      )}
      {showRegisterModal && (
        <RegisterModal show={showRegisterModal} onHide={handleCloseModal} />
      )}
    </AuthProvider>
  );
}

export default App;
