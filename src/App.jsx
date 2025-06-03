import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AppContent } from './context/AppContext';

import Navbar from './components/Global/Navbar';
import Footer from './components/Global/Footer';
import Loading from './components/Global/Loading';

import Home from './pages/Home';
import Profile from './pages/Customer/Profile';
import Event from './pages/Event';
import Login from './pages/Auth/Login';
import EmailVerify from './pages/Auth/EmailVerify';
import ResetPassword from './pages/Auth/ResetPassword';
import SiCreatorDashboard from './pages/SiCreator/SiCreatorDashboard';
import EventDetails from './pages/Customer/Eventdetails';
import ResetPasswordDashboard from './pages/Auth/ResetPasswordDashboard';
import MengapaHarusSiEvent from './pages/Customer/MengapaHarusSiEvent';
import Bantuan from './pages/Customer/Bantuan';
import SyaratKetentuan from './pages/Customer/SyaratKetentuan';
import ApaItuSiEvent from './pages/Customer/ApaItuSievent';
import KebijakanPrivasi from './pages/Customer/KebijakanPrivasi';
import HubungiKami from './pages/Customer/HubungiKami';
import NotFound from './pages/Global/NotFound';

const App = () => {
  const location = useLocation();
  const { isLoggedin } = useContext(AppContent);

  const [loading, setLoading] = useState(true);
  const hiddenRoutes = ["/login", "/verify-email", "/reset-password"];
  const hideLayout = hiddenRoutes.includes(location.pathname);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const restrictedWhenLoggedIn = ["/login"];
  if (isLoggedin && restrictedWhenLoggedIn.includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/event" element={<Event />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<EmailVerify />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/sicreator/dashboard" element={<SiCreatorDashboard />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/reset-password-profile" element={<ResetPasswordDashboard />} />
          <Route path="/mengapa-harus-sievent" element={<MengapaHarusSiEvent />} />
          <Route path="/bantuan" element={<Bantuan />} />
          <Route path="/syarat-ketentuan" element={<SyaratKetentuan />} />
          <Route path="/apa-sievent" element={<ApaItuSiEvent />} />
          <Route path="/kebijakan-privasi" element={<KebijakanPrivasi />} />
          <Route path="/hubungi-kami" element={<HubungiKami />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;
