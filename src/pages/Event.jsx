import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContent } from "../context/AppContext";
import { FaMapMarkerAlt, FaCalendarAlt, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import Select from "react-select";

const lokasiOptionsStatic = [
  { value: "", label: "-- Semua Lokasi --" },
  { value: "Jakarta", label: "Jakarta" },
  { value: "Surabaya", label: "Surabaya" },
  { value: "Bandung", label: "Bandung" },
  { value: "Bali", label: "Bali" },
  { value: "Batu", label: "Batu" },
];

const Event = () => {
  const { backendUrl } = useContext(AppContent);
  const [events, setEvents] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(lokasiOptionsStatic[0]);
  const [searchTitle, setSearchTitle] = useState("");
  const [filterOnline, setFilterOnline] = useState(false);
  const [filterOffline, setFilterOffline] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/event/showevents`);
        if (res.data.success) {
          setEvents(res.data.events);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error("Gagal mengambil event:", error.message);
        setEvents([]);
      }
    };

    fetchEvents();
  }, [backendUrl]);

  const filteredEvents = events
    .filter((event) => {
      if (selectedLocation.value && event.location !== selectedLocation.value) {
        return false;
      }
      return true;
    })
    .filter((event) => {
      const title = event.name.toLowerCase().trim();
      const query = searchTitle.toLowerCase().trim();
      return title.includes(query);
    })
    .filter((event) => {
      if (filterOnline && !filterOffline) return event.type === "online";
      if (!filterOnline && filterOffline) return event.type === "offline";
      return true;
    });

  const renderStars = (rating) => {
    const stars = [];
    const filled = Math.floor(rating);
    const empty = 5 - filled;
    for (let i = 0; i < filled; i++) {
      stars.push(<FaStar key={`filled-${i}`} className="text-yellow-400" />);
    }
    for (let i = 0; i < empty; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }
    return stars;
  };

  return (
    <div className="flex flex-col md:flex-row px-4 md:px-16 py-10 gap-8 bg-gray-50 min-h-screen">
      {/* Sidebar Filter */}
      <aside className="w-full md:w-1/4 bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Filter Event</h2>

        <div className="mb-3">
          <label htmlFor="searchTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Cari nama event
          </label>
          <input
            id="searchTitle"
            type="text"
            placeholder="Misal: Konser Musik"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <label htmlFor="locationSelect" className="block text-sm font-medium text-gray-700 mb-1">
            Cari berdasarkan lokasi
          </label>
          <Select
            inputId="locationSelect"
            options={lokasiOptionsStatic}
            placeholder="Pilih lokasi"
            isSearchable
            value={selectedLocation}
            onChange={setSelectedLocation}
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "0.5rem",
                borderColor: "#d1d5db",
                boxShadow: "none",
                "&:hover": { borderColor: "#3b82f6" },
              }),
            }}
          />
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Jenis Event</h3>
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              className="accent-blue-500"
              checked={filterOnline}
              onChange={() => setFilterOnline((prev) => !prev)}
            />
            Online Events
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-blue-500"
              checked={filterOffline}
              onChange={() => setFilterOffline((prev) => !prev)}
            />
            Offline Events
          </label>
        </div>

        <div className="mt-10">
          <Link to="/">
            <button className="w-full bg-[#00ADB5] text-white text-sm px-4 py-2 rounded-md hover:bg-blue-500 transition active:scale-90">
              Kembali ke Beranda
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full md:w-3/4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 active:scale-95 overflow-hidden"
              >
                <img
                  src={event.bannerUrl}
                  alt={event.name}
                  className="h-44 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-md font-bold mb-1 line-clamp-2">{event.name}</h3>
                  <p className="text-gray-500 text-xs mb-1">{event.creator?.name || "Unknown"}</p>

                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <FaCalendarAlt className="mr-2 text-blue-500" />
                    {new Date(event.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <FaMapMarkerAlt className="mr-2 text-red-500" />
                    {event.location}
                  </div>

                  <div className="text-xs mb-2 text-white px-2 py-1 rounded-full bg-indigo-500 w-fit">
                    {event.type === "online" ? "Online" : "Offline"}
                  </div>

                  {event.rating !== undefined && (
                    <div className="flex items-center gap-1 text-sm text-yellow-500 mb-2">
                      {renderStars(event.rating)}
                      <span className="ml-1 text-gray-600 text-xs">({event.rating.toFixed(1)})</span>
                    </div>
                  )}

                  <span className="inline-block bg-blue-100 text-blue-600 text-sm font-semibold px-3 py-1 rounded-full">
                    {event.price > 0 ? `Rp.${event.price.toLocaleString("id-ID")}` : "Gratis"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">Tidak ada event yang ditemukan.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Event;
