import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css'

// PAGES
import Home from './Pages/Home';
import Listener from './Pages/Listener';

function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const resizeWindow = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', resizeWindow);

    return () => {
      window.removeEventListener('resize', resizeWindow);
    };
  }, [windowWidth]);

  return (
      <Routes>
        <Route path="/" element={<Home windowWidth={windowWidth}/>}/>
        <Route path="/captions" element={<Listener />}/>
      </Routes>
  )
}

export default App
