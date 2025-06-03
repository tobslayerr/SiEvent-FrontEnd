import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContent } from "../../context/AppContext";
import axios from "axios";
import { FaCalendarAlt, FaMapMarkerAlt, FaLink } from "react-icons/fa";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl, userData, isLoggedin } = useContext(AppContent);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("deskripsi");
  const [selectedTickets, setSelectedTickets] = useState({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/event/${id}`);
        if (res.data.success) {
          setEvent(res.data.event);
          const initialSelected = {};
          res.data.event.tickets.forEach(ticket => {
            initialSelected[ticket._id] = 0;
          });
          setSelectedTickets(initialSelected);
        } else {
          setEvent(null);
        }
      } catch (err) {
        console.error("Gagal memuat detail event:", err.message);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [backendUrl, id]);

  const getEventPriceRange = () => {
    if (!event?.tickets || event.tickets.length === 0) {
      return "Tidak ada tiket";
    }

    const paidTickets = event.tickets.filter(ticket => !ticket.isFree && ticket.price > 0);
    if (paidTickets.length === 0) return "Gratis";

    const prices = paidTickets.map(t => t.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max
      ? `Rp ${min.toLocaleString("id-ID")}`
      : `Rp ${min.toLocaleString("id-ID")} - Rp ${max.toLocaleString("id-ID")}`;
  };

  const handleTicketQuantityChange = (ticketId, quantity) => {
    setSelectedTickets(prev => ({
      ...prev,
      [ticketId]: parseInt(quantity, 10) || 0,
    }));
  };

  const handleBuyTickets = async () => {
    if (!isLoggedin) return alert("Anda harus login untuk membeli tiket.");

    const ticketsToPurchase = Object.keys(selectedTickets)
      .filter(id => selectedTickets[id] > 0)
      .map(id => {
        const ticket = event.tickets.find(t => t._id === id);
        return {
          ticketTypeId: ticket._id,
          name: ticket.name,
          quantity: selectedTickets[id],
          price: ticket.price,
          isFree: ticket.isFree
        };
      });

    if (ticketsToPurchase.length === 0) {
      alert("Pilih setidaknya satu tiket untuk dibeli.");
      return;
    }

    try {
      const res = await axios.post(
        `${backendUrl}/api/payment/create-transaction`,
        { eventId: event._id, tickets: ticketsToPurchase },
        { withCredentials: true }
      );

      if (res.data.success && res.data.token) {
        window.snap.pay(res.data.token, {
          onSuccess: () => alert("Pembayaran berhasil! Silakan cek tiket Anda."),
          onPending: () => alert("Pembayaran tertunda. Harap selesaikan pembayaran."),
          onError: () => alert("Pembayaran gagal. Silakan coba lagi."),
          onClose: () => alert("Pembayaran dibatalkan."),
        });
      } else {
        alert("Gagal membuat transaksi: " + res.data.message);
      }
    } catch (error) {
      console.error("Kesalahan saat membeli tiket:", error.response?.data || error.message);
      alert("Terjadi kesalahan saat memproses pembelian.");
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", import.meta.env.VITE_MIDTRANS_CLIENT_KEY);
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <div className="max-w-6xl mx-auto mt-10 p-4 font-inter">
        {/* Tombol Kembali */}
        <div className="mb-4">
          {loading ? (
            <Skeleton width={150} height={32} borderRadius={8} />
          ) : (
            <button
              onClick={() => navigate("/")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium shadow transition duration-200"
            >
              ← Kembali ke Beranda
            </button>
          )}
        </div>

        {/* Banner */}
        {loading ? (
          <Skeleton height={288} borderRadius={16} className="mb-6" />
        ) : (
          <img
            src={event.bannerUrl}
            alt={event.name}
            className="w-full h-72 object-cover rounded-xl shadow mb-6"
          />
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left */}
          <div className="flex-1 bg-white p-6 rounded-xl shadow">
            {/* Tabs */}
            <div className="flex gap-3 mb-4 border-b pb-2">
              {["deskripsi", "tiket", "peta"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${
                    activeTab === tab
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {tab === "deskripsi" ? "Deskripsi" : tab === "tiket" ? "Pilih Tiket" : "Lihat Peta"}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="space-y-4">
                <Skeleton height={24} width={150} />
                <Skeleton count={4} />
              </div>
            ) : activeTab === "deskripsi" ? (
              <div className="space-y-3">
                <p className="text-blue-600 font-medium">Event Detail</p>
                <h2 className="text-2xl font-bold text-gray-800">Deskripsi Event</h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {event.description}
                </p>
                <h3 className="font-semibold text-lg mt-6">Kebijakan Pengembalian</h3>
                <p className="text-gray-700">
                  Semua pembelian tiket adalah final dan tidak dapat dikembalikan (NO REFUND), kecuali jika event dibatalkan oleh penyelenggara.
                </p>
              </div>
            ) : activeTab === "tiket" ? (
              <div className="text-gray-700 space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Pilih Tiket</h2>
                {event.tickets.map(ticket => (
                  <div
                    key={ticket._id}
                    className="border border-gray-200 p-4 rounded-lg shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">{ticket.name}</h3>
                      <p className="text-sm text-gray-600">Kuantitas Tersedia: {ticket.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-blue-700">
                        {ticket.isFree ? "Gratis" : `Rp ${ticket.price.toLocaleString("id-ID")}`}
                      </p>
                      <input
                        type="number"
                        min="0"
                        max={ticket.quantity}
                        value={selectedTickets[ticket._id] || 0}
                        onChange={(e) =>
                          handleTicketQuantityChange(ticket._id, e.target.value)
                        }
                        className="w-20 p-1 mt-2 border rounded-md text-center text-sm"
                        disabled={ticket.quantity === 0}
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleBuyTickets}
                  className="mt-6 w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-lg active:scale-95"
                >
                  Beli Tiket Sekarang
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Lihat Peta</h2>
                <p>Fitur peta akan tersedia di versi mendatang.</p>
                <p className="font-semibold mt-2">Lokasi Event: {event.location || "Belum ditentukan"}</p>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="w-full lg:w-80 p-6 bg-blue-50 border border-blue-200 rounded-xl shadow-md flex flex-col justify-between">
            {loading ? (
              <div className="space-y-3">
                <Skeleton width={120} height={18} />
                <Skeleton width={180} height={24} />
                <Skeleton height={24} />
                <Skeleton count={3} />
              </div>
            ) : (
              <div className="text-sm text-gray-700 space-y-3">
                <p className="text-sm text-blue-700 font-medium mb-1">Diselenggarakan oleh</p>
                <p className="text-blue-800 font-semibold text-lg mb-4">
                  {event.creator?.name || "Unknown Creator"}
                </p>
                <h3 className="text-2xl font-bold text-blue-900 mb-4 capitalize">
                  {event.name}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="text-blue-600 text-lg" />
                    <span>
                      {new Date(event.date).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {event.type === "online" ? (
                      <>
                        <FaLink className="text-purple-600 text-lg" />
                        <span>Online Event (Link diberikan setelah pembelian)</span>
                      </>
                    ) : (
                      <>
                        <FaMapMarkerAlt className="text-red-600 text-lg" />
                        <span>{event.location || "Lokasi belum ditentukan"}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-600 text-lg">💰</span>
                    <span className="font-semibold text-base text-green-800">
                      {getEventPriceRange()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default EventDetails;

    </div>
  );
};

export default EventDetails;
