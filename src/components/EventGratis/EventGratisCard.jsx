import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import axios from "axios";
import { AppContent } from "../../context/AppContext";

const EventGratisCard = ({ event }) => {
  const { backendUrl } = useContext(AppContent);

  // Cek apakah ada minimal satu tiket gratis
  const isFree = event.tickets?.some((ticket) => ticket.isFree === true);
  if (!isFree) return null; // Tidak ditampilkan jika tidak ada tiket gratis

  // State untuk rata-rata rating dan jumlah rating
  const [averageRating, setAverageRating] = useState("0.0");
  const [ratingCount, setRatingCount] = useState(0);

  // Fetch rata-rata dan jumlah rating dari backend
  useEffect(() => {
    const fetchAverage = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/rating/readaverage/${event._id}`);
        const { averageRating: avg, totalRatings } = res.data;
        setAverageRating(avg || "0.0");
        setRatingCount(totalRatings || 0);
      } catch (err) {
        console.error("Gagal mengambil rata-rata rating:", err.message);
      }
    };

    if (event._id) {
      fetchAverage();
    }
  }, [backendUrl, event._id]);

  // Hitung jumlah bintang penuh dan setengah
  const filledStars = Math.floor(parseFloat(averageRating));
  const hasHalfStar = parseFloat(averageRating) - filledStars >= 0.5;
  const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < filledStars; i++) {
      stars.push(<FaStar key={`filled-${i}`} className="text-yellow-400 text-sm" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400 text-sm" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300 text-sm" />);
    }
    return stars;
  };

  return (
    <Link to={`/event/${event._id}`}>
      <div className="border border-gray-300 pb-4 overflow-hidden rounded-lg transition duration-300 active:scale-95 hover:shadow-md hover:bg-gray-100 bg-white">
        <img
          className="w-full h-36 object-cover sm:h-40 md:h-44 lg:h-48"
          src={event.bannerUrl}
          alt="Event Thumbnail"
        />

        <div className="p-3 text-left text-sm sm:text-base">
          <h3 className="text-sm font-semibold leading-tight">{event.name}</h3>
          <p className="text-gray-500 text-xs mb-1">
            {event.creator?.name || "Unknown"}
          </p>

          <div className="flex items-center space-x-1 mt-1 mb-2 text-xs text-gray-700">
            <p className="text-gray-600">{parseFloat(averageRating).toFixed(1)}</p>
            <div className="flex">{renderStars()}</div>
            <p className="text-gray-500">({ratingCount})</p>
          </div>

          <div className="text-xs text-gray-600 leading-snug space-y-1">
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
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <FaMapMarkerAlt className="mr-2 text-red-500" />
              {event.location || "-"}
            </div>
            <div className="flex items-center">
              <div className="text-xs mb-2 text-white px-2 py-1 rounded-full bg-indigo-500 w-fit">
                {event.type === "online" ? "Online" : "Offline"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventGratisCard;
