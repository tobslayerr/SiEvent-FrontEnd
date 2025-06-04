import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContent } from "../../context/AppContext";
import axios from "axios";
import { FaCalendarAlt, FaMapMarkerAlt, FaLink } from "react-icons/fa";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AlertBox from "../../components/Global/AlertBox";
import RatingEvent from "./RatingEvent";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl, userData, isLoggedin } = useContext(AppContent);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("deskripsi");
  const [selectedTickets, setSelectedTickets] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

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
          setAlertMessage("Gagal mengambil data event.");
          setShowAlert(true);
        }
      } catch (err) {
        console.error("Gagal memuat detail event:", err.message);
        setAlertMessage("Terjadi kesalahan saat mengambil data event.");
        setShowAlert(true);
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
    if (!isLoggedin) {
      setAlertMessage("Anda harus login untuk membeli tiket.");
      setShowAlert(true);
      return;
    }

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
      setAlertMessage("Pilih setidaknya satu tiket untuk dibeli.");
      setShowAlert(true);
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
          onSuccess: () => {
            setAlertMessage("Pembayaran berhasil! Silakan cek tiket Anda.");
            setShowAlert(true);
          },
          onPending: () => {
            setAlertMessage("Pembayaran tertunda. Harap selesaikan pembayaran.");
            setShowAlert(true);
          },
          onError: () => {
            setAlertMessage("Pembayaran gagal. Silakan coba lagi.");
            setShowAlert(true);
          },
          onClose: () => {
            setAlertMessage("Pembayaran dibatalkan.");
            setShowAlert(true);
          },
        });
      } else {
        setAlertMessage("Gagal membuat transaksi: " + res.data.message);
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Kesalahan saat membeli tiket:", error.response?.data || error.message);
      setAlertMessage("Terjadi kesalahan saat memproses pembelian.");
      setShowAlert(true);
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
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <AlertBox
              type="warning"
              message={alertMessage}
              onClose={() => setShowAlert(false)}
            />
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto mt-10 p-4 font-inter">
        <div className="mb-4">
          {loading ? (
            <Skeleton width={150} height={32} borderRadius={8} />
          ) : (
            <button
              onClick={() => navigate("/")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium shadow transition duration-200"
            >
              Kembali ke Beranda
            </button>
          )}
        </div>

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
          <div className="flex-1 bg-white p-6 rounded-xl shadow">
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
              <>
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
              <RatingEvent eventId={event._id} />
              </>
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
                      <p className="text-sm">
                        {ticket.isFree
                          ? "Gratis"
                          : `Rp ${ticket.price.toLocaleString("id-ID")} / tiket`}
                      </p>
                      <p className="text-sm text-gray-500">Tersisa: {ticket.quantity}</p>
                    </div>
                    <div>
                      <input
                        type="number"
                        min={0}
                        max={ticket.quantity}
                        value={selectedTickets[ticket._id] || 0}
                        onChange={e =>
                          handleTicketQuantityChange(ticket._id, e.target.value)
                        }
                        className="w-20 border px-2 py-1 rounded-md text-center"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleBuyTickets}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition"
                >
                  Beli Tiket
                </button>
              </div>
            ) : (
              <div>
                <p>Integrasi peta bisa ditambahkan di sini.</p>
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/3 space-y-4">
            <div className="bg-white p-4 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-2">Detail Event</h2>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <FaCalendarAlt className="text-blue-500" />
                <span>{new Date(event?.date).toLocaleString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <FaMapMarkerAlt className="text-blue-500" />
                <span>{event?.location}</span>
              </div>
              <p className="mt-4 text-sm text-gray-500">Harga: {getEventPriceRange()}</p>
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default EventDetails;
