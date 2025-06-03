import React, { useEffect, useState, useContext } from "react";
import EventTerdekatCard from "../EventTerdekat/EventTerdekatCard";
import { AppContent } from "../../context/AppContext";
import { Link } from "react-router-dom";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const EventTerdekat = () => {
  const { backendUrl } = useContext(AppContent);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/event/showevents`);
        if (res.data.success) {
          const allEvents = res.data.events;
          const now = new Date();
          const startDate = new Date(now);
          startDate.setDate(startDate.getDate() + 1);
          const endDate = new Date(now);
          endDate.setDate(endDate.getDate() + 22);

          const filtered = allEvents.filter((event) => {
            const eventDate = new Date(event.date);
            return eventDate >= startDate && eventDate <= endDate;
          });

          const sorted = filtered.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );

          setUpcomingEvents(sorted.slice(0, 5));
        } else {
          setUpcomingEvents([]);
        }
      } catch (err) {
        console.error("Gagal fetch event terdekat:", err.message);
        setUpcomingEvents([]);
      }
      setLoading(false);
    };

    fetchUpcomingEvents();
  }, [backendUrl]);

  return (
    <div className="bg-gradient-to-t from-blue-200 via-white to-blue-10 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Event Terdekat</h2>
          <Link to="/event">
          <button className="ml-4 border bg-[#00ADB5] border-blue-600 rounded-md px-4 py-2 font-medium text-white text-sm transition hover:bg-blue-600 hover:text-white active:scale-90 duration-300">
            Selengkapnya
          </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-2 border rounded-lg bg-white shadow">
                <Skeleton height={120} className="mb-2 rounded-md" />
                <Skeleton height={20} width="80%" className="mb-1" />
                <Skeleton height={16} width="60%" />
              </div>
            ))
          ) : upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <EventTerdekatCard key={event._id} event={event} />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-600">
              Tidak ada event terdekat
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventTerdekat;
