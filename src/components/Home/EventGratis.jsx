import React, { useEffect, useState, useContext } from 'react';
import EventGratisCard from '../EventGratis/EventGratisCard';
import { AppContent } from '../../context/AppContext';
import axios from 'axios';

const EventGratis = () => {
  const { backendUrl } = useContext(AppContent);
  const [freeEvents, setFreeEvents] = useState([]);

  useEffect(() => {
    const fetchFreeEvents = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/event/showevents`);
        if (res.data.success) {
          const allEvents = res.data.events;
          const onlyFree = allEvents.filter((event) => event.price === 0);
          setFreeEvents(onlyFree);
        } else {
          setFreeEvents([]);
        }
      } catch (err) {
        console.error("Gagal fetch event gratis:", err.message);
        setFreeEvents([]);
      }
    };

    fetchFreeEvents();
  }, [backendUrl]);

  return (
    <div className="max-w-[100%] sm:max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-blue-100 shadow-lg rounded-2xl mt-10">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Event Gratis</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {freeEvents.length > 0 ? (
          freeEvents.map((event) => (
            <EventGratisCard key={event._id} event={event} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-600">Tidak ada event gratis yang tersedia saat ini.</p>
        )}
      </div>

      <div className="flex justify-center mt-8">
        <button className="border border-blue-600 bg-[#00ADB5] px-6 py-3 rounded-md text-white text-sm font-medium transition duration-300 hover:bg-blue-600 active:scale-90">
          Selengkapnya
        </button>
      </div>
    </div>
  );
};

export default EventGratis;
