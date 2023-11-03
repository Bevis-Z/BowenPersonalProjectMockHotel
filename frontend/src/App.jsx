import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import About from './Components/About';
import Home from './Components/Home';

function App () {
  const location = useLocation();
  const background = location.state && location.state.background;
  return (
    <>
      <Routes location={background || location}>
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Home />} />
      </Routes>
      {background && <Routes>
        <Route path="/login" element={<LoginModal />} />
        <Route path="/register" element={<RegisterModal />} />
      </Routes>}
    </>
  );
}

export default App;
