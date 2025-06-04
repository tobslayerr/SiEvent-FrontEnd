import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContent } from "../context/AppContext";
import { FaMapMarkerAlt, FaCalendarAlt, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";
import Select from "react-select";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(lokasiOptionsStatic[0]);
  const [searchTitle, setSearchTitle] = useState("");
  const [filterOnline, setFilterOnline] = useState(false);
  const [filterOffline, setFilterOffline] = useState(false);
  const [searchParams] = useSearchParams();
  const [ratingsMap, setRatingsMap] = useState({}); // { [eventId]: { average: "0.0", count: 0 } }

  // Baca query params untuk filter
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const type = searchParams.get("type") || "";
    const location = searchParams.get("location") || "";

    setSearchTitle(q);

    if (type === "online") {
      setFilterOnline(true);
      setFilterOffline(false);
    } else if (type === "offline") {
      setFilterOffline(true);
      setFilterOnline(false);
    } else {
      setFilterOnline(false);
      setFilterOffline(false);
    }

    if (location) {
      const matchedLocation = lokasiOptionsStatic.find((loc) => loc.value === location);
      if (matchedLocation) {
        setSelectedLocation(matchedLocation);
      }
    }
  }, [searchParams]);

  // Fetch daftar event
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
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [backendUrl]);

  // Setelah events terisi, fetch rata-rata rating setiap event
  useEffect(() => {
    if (events.length === 0) return;

    const fetchAllAverages = async () => {
      const map = {};
      await Promise.all(
        events.map(async (ev) => {
          try {
            const res = await axios.get(
              `${backendUrl}/api/rating/readaverage/${ev._id}`
            );
            const { averageRating: avg, totalRatings } = res.data;
            map[ev._id] = {
              average: avg || "0.0",
              count: totalRatings || 0,
            };
          } catch (err) {
            console.error(`Gagal mengambil rating untuk event ${ev._id}:`, err.message);
            map[ev._id] = { average: "0.0", count: 0 };
          }
        })
      );
      setRatingsMap(map);
    };

    fetchAllAverages();
  }, [events, backendUrl]);

  // Normalisasi teks untuk pencarian
  const normalizeText = (text) =>
    text
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\s/g, "");

  // Filter event berdasarkan lokasi, judul, dan jenis
  const filteredEvents = events
    .filter((event) => {
      if (selectedLocation.value && event.location !== selectedLocation.value) return false;
      return true;
    })
    .filter((event) => {
      const title = normalizeText(event.name);
      const query = normalizeText(searchTitle);
      return title.includes(query);
    })
    .filter((event) => {
      if (filterOnline && !filterOffline) return event.type === "online";
      if (!filterOnline && filterOffline) return event.type === "offline";
      return true;
    });

  // Render bintang dengan mengakomodasi setengah bintang
  const renderStars = (averageStr) => {
    const stars = [];
    const num = parseFloat(averageStr) || 0;
    const full = Math.floor(num);
    const hasHalf = num - full >= 0.5;

    for (let i = 0; i < full; i++) {
      stars.push(<FaStar key={`filled-${i}`} className="text-yellow-400" />);
    }
    if (hasHalf) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    const emptyCount = 5 - full - (hasHalf ? 1 : 0);
    for (let i = 0; i < emptyCount; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    }
    return stars;
  };

  return (
    <div className="flex flex-col md:flex-row px-4 md:px-16 py-10 gap-8 bg-gray-50 min-h-screen">
      {/* Sidebar Filter */}
      <aside className="w-full md:w-1/4 bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Filter Event</h2>

        <div className="mb-3">
          <label
            htmlFor="searchTitle"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Cari nama event
          </label>
          <input
            id="searchTitle"
            type="text"
            placeholder="Misal: Konser Musik"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setSearchTitle("");
            }}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="locationSelect"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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

      {/* Main Content: Daftar Event */}
      <main className="w-full md:w-3/4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? // Tampilkan skeleton loading
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonTheme
                  baseColor="#e0e0e0"
                  highlightColor="#f5f5f5"
                  key={index}
                >
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <Skeleton height={176} />
                    <div className="p-4 space-y-2">
                      <Skeleton width="80%" height={20} />
                      <Skeleton width="60%" height={15} />
                      <Skeleton width="50%" height={15} />
                      <Skeleton width="40%" height={15} />
                      <Skeleton width="30%" height={20} />
                    </div>
                  </div>
                </SkeletonTheme>
              ))
            : filteredEvents.length > 0 &&
              filteredEvents.map((event) => {
                // Ambil rata-rata dan count dari ratingsMap
                const { average = "0.0", count = 0 } =
                  ratingsMap[event._id] || {};

                return (
                  <Link
                    to={`/event/${event._id}`}
                    key={event._id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 active:scale-95 overflow-hidden block"
                  >
                    <img
                      src={event.bannerUrl}
                      alt={event.name}
                      className="h-44 w-full object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-md font-bold mb-1 line-clamp-2">
                        {event.name}
                      </h3>
                      <p className="text-gray-500 text-xs mb-1">
                        {event.creator?.name || "Unknown"}
                      </p>

                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <FaCalendarAlt className="mr-2 text-blue-500" />
                        {event.date
                          ? new Date(event.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "TBA"}
                      </div>

                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <FaMapMarkerAlt className="mr-2 text-red-500" />
                        {event.location}
                      </div>

                      <div className="text-xs mb-2 text-white px-2 py-1 rounded-full bg-indigo-500 w-fit">
                        {event.type === "online" ? "Online" : "Offline"}
                      </div>

                      {/* Tampilkan Rating */}
                      <div className="flex items-center gap-1 text-sm text-yellow-500 mb-2">
                        {renderStars(average)}
                        <span className="ml-1 text-gray-600 text-xs">
                          {parseFloat(average).toFixed(1)} ({count})
                        </span>
                      </div>

                      {/* Harga / Free */}
                      <span className="inline-block bg-blue-100 text-blue-600 text-sm font-semibold px-3 py-1 rounded-full">
                        {event.price > 0
                          ? `Rp.${event.price.toLocaleString("id-ID")}`
                          : "Gratis"}
                      </span>
                    </div>
                  </Link>
                );
              })}
        </div>
        {!loading && filteredEvents.length === 0 && (
          <p className="text-center mt-10 text-gray-500">
            Tidak ada event yang ditemukan.
          </p>
        )}
      </main>
    </div>
  );
};

export default Event;
