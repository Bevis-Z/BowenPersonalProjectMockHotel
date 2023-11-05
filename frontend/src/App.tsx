import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import About from './Components/About';
import LoginModal from './Components/User/LoginModal';
import RegisterModal from './Components/User/RegisterModal';
import Navbar from './Components/Navbar/Navbar';
import { AuthProvider } from './AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
// eslint-disable-next-line import/extensions
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App () {
  const location = useLocation();
  const navigate = useNavigate();

  // 检查是否存在后台路由状态
  const backgroundLocation = location.state && location.state.backgroundLocation;

  // 用于控制模态框显示的状态
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // 当路径是 '/login' 时显示模态框
  useEffect(() => {
    const currentPath = location.pathname;
    const isLoginRoute = currentPath === '/login';
    const isRegisterRoute = currentPath === '/register';

    setShowLoginModal(isLoginRoute);
    setShowRegisterModal(isRegisterRoute);
  }, [location]);

  const handleLoginClick = () => {
    // 设置背景路由状态，并导航至 '/login'
    navigate('/login', { state: { backgroundLocation: location } });
  };
  const handleCloseModal = () => {
    setShowLoginModal(false);
    // 如果 backgroundLocation 存在，则回到那个位置
    if (backgroundLocation) {
      navigate(backgroundLocation.pathname, { replace: true });
    } else {
      // 否则回到首页
      navigate('/', { replace: true });
    }
  };

  const handleRegisterClick = () => {
    // 设置背景路由状态，并导航至 '/login'
    navigate('/register', { state: { backgroundLocation: location } });
  };
  return (
    <AuthProvider>
      <Navbar onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick}/>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
      </Routes>

      {/* 当路径为/login时显示模态框 */}
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
