import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import { AppContent } from "../../context/AppContext";

const EventTerdekatCard = ({ event }) => {
  const { backendUrl } = useContext(AppContent);

  // State untuk menyimpan average rating dari backend
  const [averageRating, setAverageRating] = useState("0.0");
  const [ratingCount, setRatingCount] = useState(0);

  useEffect(() => {
    const fetchAverage = async () => {
      try {
        const resAvg = await axios.get(
          `${backendUrl}/api/rating/readaverage/${event._id}`
        );
        const { averageRating: avg, totalRatings } = resAvg.data;
        setAverageRating(avg || "0.0");
        setRatingCount(totalRatings || 0);
      } catch (err) {
        console.error("Gagal mengambil rata-rata rating:", err.message);
        // Jika error, tetap pakai default "0.0" dan count = 0
      }
    };

    if (event._id) {
      fetchAverage();
    }
  }, [backendUrl, event._id]);


  // Konversi averageRating (string) ke integer untuk jumlah bintang penuh
  const stars = Math.floor(parseFloat(averageRating));

  // --- Price display tetap sama seperti sebelumnya ---
  let priceDisplay = "Gratis";
  let isFreeEvent = true;
  let minPrice = Infinity;

  if (event.tickets && event.tickets.length > 0) {
    const paidTickets = event.tickets.filter(
      (ticket) => !ticket.isFree && ticket.price > 0
    );
    if (paidTickets.length > 0) {
      isFreeEvent = false;
      minPrice = Math.min(...paidTickets.map((ticket) => ticket.price));
      priceDisplay = `Mulai dari Rp ${minPrice.toLocaleString("id-ID")}`;
    } else {
      priceDisplay = "Gratis";
      isFreeEvent = true;
    }
  }

  return (
    <Link to={`/event/${event._id}`}>
      <div className="border border-gray-300 pb-6 overflow-hidden rounded-lg transition duration-300 active:scale-95 hover:shadow-lg hover:bg-gray-100 bg-white">
        <img
          className="w-full h-40 object-cover"
          src={event.bannerUrl}
          alt="Event Thumbnail"
        />

        <div className="p-4 text-left">
          <h3 className="text-base font-semibold mb-1">{event.name}</h3>
          <p className="text-gray-500 text-sm mb-2">
            {event.creator?.name || "Unknown"}
          </p>

          <div className="flex items-center space-x-2 mb-2">
            {/* Tampilkan nilai averageRating */}
            <p className="text-base font-semibold text-gray-800">
              {averageRating}
            </p>
            <div className="flex">
              {/* Render bintang penuh */}
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400">
                  {i < stars ? "★" : "☆"}
                </span>
              ))}
            </div>
            <p className="text-gray-500 text-sm">({ratingCount})</p>
          </div>

          <div className="text-sm text-gray-600 space-y-1 mb-2">
            <p className="flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-500" />
              {event.date
                ? new Date(event.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "TBA"}
            </p>
            <p className="flex items-center">
              <FaMapMarkerAlt className="mr-2 text-red-500" />
              {event.location || "Lokasi tidak tersedia"}
            </p>
            <p>
              <strong>Tipe:</strong>{" "}
              {event.type === "online" ? "Online" : "Offline"}
            </p>
          </div>

          {/* --- Price Display --- */}
          <p className="text-base font-semibold text-gray-800">
            <span
              className={`inline-block text-sm font-semibold px-2 py-1 rounded ${
                isFreeEvent
                  ? "bg-green-100 text-green-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {priceDisplay}
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default EventTerdekatCard;
