import React, { useEffect, useState, useContext } from 'react';
import EventGratisCard from '../EventGratis/EventGratisCard';
import { AppContent } from '../../context/AppContext';
import { Link } from "react-router-dom";
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const EventGratis = () => {
  const { backendUrl } = useContext(AppContent);
  const [freeEvents, setFreeEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFreeEvents = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/event/showevents`);
        if (res.data.success) {
          const allEvents = res.data.events;

          // Event dianggap gratis jika ADA tiket yang isFree === true
          const onlyFree = allEvents.filter((event) =>
            event.tickets?.some((ticket) => ticket.isFree === true)
          );

          setFreeEvents(onlyFree.slice(0, 4)); // Batasi hanya 4 event
        } else {
          setFreeEvents([]);
        }
      } catch (err) {
        console.error("Gagal fetch event gratis:", err.message);
        setFreeEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFreeEvents();
  }, [backendUrl]);

  const renderSkeletons = () =>
    Array(4)
      .fill(0)
      .map((_, index) => (
        <div
          key={index}
          className="border border-gray-300 pb-4 overflow-hidden rounded-lg bg-white shadow-sm"
        >
          <Skeleton height={160} />
          <div className="p-3 space-y-2">
            <Skeleton height={20} width={`80%`} />
            <Skeleton height={15} width={`60%`} />
            <Skeleton height={15} width={`70%`} />
            <Skeleton height={25} width={`40%`} />
          </div>
        </div>
      ));

  return (
    <div className="max-w-[100%] sm:max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-blue-100 shadow-lg rounded-2xl mt-10">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Event Gratis</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {loading ? (
          renderSkeletons()
        ) : freeEvents.length > 0 ? (
          freeEvents.map((event) => (
            <EventGratisCard key={event._id} event={event} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-600">
            Tidak ada event gratis yang tersedia saat ini.
          </p>
        )}
      </div>

      {!loading && (
        <div className="flex justify-center mt-8">
          <Link to="/event">
          <button className="border border-blue-600 bg-[#00ADB5] px-6 py-3 rounded-md text-white text-sm font-medium transition duration-300 hover:bg-blue-600 active:scale-90">
            Selengkapnya
          </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default EventGratis;
