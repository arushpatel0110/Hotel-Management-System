import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Header from './Components/Header';
import Footer from './Components/Footer';
import TokenLogin from './Components/TokenLogin';
import ProtectedRoute from './Components/ProtectedRoutes';

import Home from './Pages/Home';
import Rooms from './Pages/Rooms';
import RoomDetails from './Pages/RoomDetails';
import Bookings from './Pages/Bookings';
import Dashboard from './Pages/Reviews';
import BookingHistory from './Pages/BookingHistory';
import Login from './Pages/Login';
import Signup from './Pages/Signup';

import { GET_ACCESS_TOKEN } from './constants';

function App() {
  const [login, setLogin] = useState(false);

  useEffect(() => {
    console.log(login);

    if (GET_ACCESS_TOKEN()) {
      setLogin(true);
    }
  });

  function logout() {
    window.localStorage.clear();
    setLogin(false);
  }

  return (
    <Router>
      <Header login={login} logout={logout} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setLogin={setLogin} />} />
        <Route path="/signup" element={<Signup setLogin={setLogin} />} />
        <Route path="/token-login/:token" element={<TokenLogin setLogin={setLogin} />} />

        <Route path="/rooms" element={<ProtectedRoute login={login}><Rooms /></ProtectedRoute>} />
        <Route path="/rooms/:id" element={<ProtectedRoute login={login}><RoomDetails /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute login={login}><Bookings /></ProtectedRoute>} />
        <Route path="/reviews" element={<ProtectedRoute login={login}><Dashboard /></ProtectedRoute>} />
        <Route path="/booking-history" element={<ProtectedRoute login={login}><BookingHistory /></ProtectedRoute>} />
      </Routes>

      <Footer />
    </Router >
  );
}

export default App;
