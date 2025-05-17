import { useContext } from 'react';
import { AppContent } from '../context/AppContext';
import Hero from '../components/Home/Hero';
import EventTerdekat from '../components/Home/EventTerdekat';
import EventGratis from '../components/Home/EventGratis';
import ToLogin from '../components/Home/ToLogin';
import Loading from '../components/Global/Loading';

const Home = () => {
  const { isLoggedin, loading } = useContext(AppContent);

  if (loading) return <Loading />;

  return (
    <div className="h-full">
      <Hero />
      <div>
        <EventTerdekat />
      </div>
      <div className="p-12 h-auto bg-gradient-to-b from-blue-200 via-white to-blue-20">
        <EventGratis />
      </div>
      {!isLoggedin && (
        <div>
          <ToLogin />
        </div>
      )}
    </div>
  );
};

export default Home;
