import React from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

const EventTerdekatCard = ({ event }) => {
  const ratings = event.eventRatings || [];
  const averageRating = ratings.length
    ? (ratings.reduce((sum, val) => sum + Number(val), 0) / ratings.length).toFixed(1)
    : "0.0";
  const stars = Math.floor(averageRating);

  // --- NEW: Determine the price display based on tickets ---
  let priceDisplay = "Gratis"; // Default to Free
  let isFreeEvent = true;
  let minPrice = Infinity;

  if (event.tickets && event.tickets.length > 0) {
    // Check if any ticket is paid
    const paidTickets = event.tickets.filter(ticket => !ticket.isFree && ticket.price > 0);

    if (paidTickets.length > 0) {
      isFreeEvent = false;
      // Find the minimum price among paid tickets
      minPrice = Math.min(...paidTickets.map(ticket => ticket.price));
      priceDisplay = `Mulai dari Rp ${minPrice.toLocaleString("id-ID")}`;
    } else {
      // All tickets are free
      priceDisplay = "Gratis";
      isFreeEvent = true;
    }
  }
  // --- END NEW ---

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
        <p className="text-gray-500 text-sm mb-2">{event.creator?.name || "Unknown"}</p>

        <div className="flex items-center space-x-2 mb-2">
          <p>{averageRating}</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400">
                {i < stars ? "★" : "☆"}
              </span>
            ))}
          </div>
          <p className="text-gray-500">({ratings.length})</p>
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
            <strong>Tipe:</strong> {event.type === "online" ? "Online" : "Offline"}
          </p>
        </div>

        {/* --- Updated Price Display --- */}
        <p className="text-base font-semibold text-gray-800">
          <span className={`inline-block text-sm font-semibold px-2 py-1 rounded ${isFreeEvent ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}>
            {priceDisplay}
          </span>
        </p>
        {/* --- End Updated Price Display --- */}
      </div>
    </div>
    </Link>
  );
};

export default EventTerdekatCard;