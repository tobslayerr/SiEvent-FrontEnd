import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const RatingEvent = ({ eventId }) => {
  const { userData, backendUrl, isLoggedin } = useContext(AppContent);
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [averageRating, setAverageRating] = useState({ value: "0.0", count: 0 });
  const [refreshUserRating, setRefreshUserRating] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const resRatings = await axios.get(`${backendUrl}/api/rating/readall/${eventId}`);
        setRatings(resRatings.data || []);

        const resAvg = await axios.get(`${backendUrl}/api/rating/readaverage/${eventId}`);
        const { averageRating: avg, totalRatings } = resAvg.data;
        setAverageRating({ value: avg || "0.0", count: totalRatings || 0 });
      } catch (error) {
        console.error("Gagal mengambil rating:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [backendUrl, eventId]);

  useEffect(() => {
    const fetchUserRating = async () => {
      if (!userData || !userData._id || !eventId) return;

      try {
        const res = await axios.get(
          `${backendUrl}/api/rating/readone/user/${userData._id}/event/${eventId}`,
          { withCredentials: true }
        );
        setUserRating(res.data?.rating || null);
      } catch (error) {
        if (error.response?.status === 404) setUserRating(null);
        else console.error("Gagal mengambil rating user:", error.message);
      }
    };

    fetchUserRating();
  }, [backendUrl, userData, eventId, refreshUserRating]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!isLoggedin) return alert("Silakan login terlebih dahulu.");
    if (stars < 1) return alert("Beri bintang minimal 1.");

    try {
      setSubmitting(true);
      const res = await axios.post(
        `${backendUrl}/api/rating/create/${eventId}`,
        { stars, review },
        { withCredentials: true }
      );

      if (res.data.success) {
        setRatings((prev) => [...prev, res.data.data]);
        setStars(0);
        setReview("");
        setRefreshUserRating((prev) => !prev);

        const avgRes = await axios.get(`${backendUrl}/api/rating/readaverage/${eventId}`);
        const { averageRating: avg, totalRatings } = avgRes.data;
        setAverageRating({ value: avg || "0.0", count: totalRatings || 0 });
      }
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 409) {
        setErrorMsg(error.response.data.message || "Anda sudah memberi rating.");
      } else {
        alert("Gagal mengirim rating.");
        console.error("Error on submit rating:", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (value) => {
    const num = parseFloat(value);
    return Array.from({ length: 5 }, (_, i) => {
      if (num >= i + 1) return <FaStar key={i} className="text-yellow-500" />;
      if (num >= i + 0.5) return <FaStarHalfAlt key={i} className="text-yellow-500" />;
      return <FaRegStar key={i} className="text-yellow-500" />;
    });
  };

  const visibleRatings = showAll ? ratings : ratings.slice(0, 4);

  return (
    <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Rating Event</h2>

      <div className="mb-4 flex items-center gap-2">
        <span className="text-lg font-bold text-gray-800">{averageRating.value}</span>
        <div className="flex">{renderStars(averageRating.value)}</div>
        <span className="text-gray-500 text-sm">({averageRating.count})</span>
      </div>

      {loading ? (
        <p>Memuat ulasan...</p>
      ) : ratings.length === 0 ? (
        <p className="text-gray-600">Belum ada ulasan untuk event ini.</p>
      ) : null}

      {isLoggedin && !userRating && (
        <form onSubmit={handleSubmit} className="mt-6">
          <h3 className="font-semibold text-lg mb-2">Beri Ulasan Anda</h3>
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((val) => (
              <FaStar
                key={val}
                className={`cursor-pointer ${val <= stars ? "text-yellow-500" : "text-gray-300"}`}
                onClick={() => setStars(val)}
              />
            ))}
          </div>
          <textarea
            rows={3}
            placeholder="Tulis ulasanmu di sini..."
            className="w-full border p-2 rounded-md mb-3"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            {submitting ? "Mengirim..." : "Kirim Ulasan"}
          </button>
          {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}
        </form>
      )}

      {isLoggedin && userRating && (
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold text-lg mb-2">Ulasan Anda</h3>
          <div className="flex mb-1">{renderStars(userRating.stars)}</div>
          <p className="text-gray-700">{userRating.review}</p>
        </div>
      )}

      {!isLoggedin && (
        <p className="text-sm text-gray-500 mt-4">Login untuk memberi rating.</p>
      )}

      {ratings.length > 0 && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Ulasan dari Pengguna Lain</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <AnimatePresence initial={false}>
              {visibleRatings.map((rating) => (
                <motion.div
                  key={rating._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm border"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-800">
                      {rating.user?.name || "Pengguna"}
                    </span>
                    <div className="flex">{renderStars(rating.stars)}</div>
                  </div>
                  <p className="text-gray-600">{rating.review}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {ratings.length > 4 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAll((prev) => !prev)}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                {showAll ? "Sembunyikan Ulasan" : "Lihat Semua Ulasan"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RatingEvent;
