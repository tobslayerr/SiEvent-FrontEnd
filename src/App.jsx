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

  // ⛔️ Batasi hanya login & verify-email untuk user yang sudah login
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
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;
