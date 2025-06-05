import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import Loading from "../../components/Global/Loading";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const MyTickets = () => {
    const { backendUrl, userData, isLoggedin, appLoading } = useContext(AppContent); // <--- Tambahkan appLoading dari konteks
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyTickets = async () => {
            // 1. Tunggu appLoading selesai sebelum mencoba mengambil tiket
            if (appLoading) {
                return; // Keluar dari useEffect jika aplikasi masih loading secara global
            }

            // 2. Periksa kembali status login dan ID pengguna
            if (!isLoggedin || !userData?._id) {
                setError("Anda harus login untuk melihat tiket Anda.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`${backendUrl}/api/user/tickets`, { withCredentials: true });

                if (res.data.success) {
                    setTickets(res.data.tickets);
                } else {
                    setError(res.data.message || "Gagal mengambil data tiket Anda.");
                }
            } catch (err) {
                console.error("Error fetching user tickets:", err);
                if (err.response && err.response.status === 401) {
                    setError("Sesi Anda berakhir. Mohon login kembali.");
                } else {
                    setError("Terjadi kesalahan saat memuat tiket Anda.");
                }
            } finally {
                setLoading(false);
            }
        };

        // 3. Jalankan fetchMyTickets hanya jika appLoading selesai
        if (!appLoading) {
            fetchMyTickets();
        }
    }, [backendUrl, userData, isLoggedin, appLoading]); // Tambahkan appLoading sebagai dependency

    // Tampilkan Loading dari AppContent jika aplikasi masih loading secara global
    if (appLoading) {
        return <Loading />;
    }

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton height={24} width="60%" />
                <Skeleton count={3} height={100} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-600 p-4 bg-red-50 rounded-md">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {tickets.length === 0 ? (
                <p className="text-gray-600 text-center p-4 bg-gray-50 rounded-md">
                    Anda belum memiliki tiket yang dibeli.
                </p>
            ) : (
                tickets.map((ticket) => (
                    <div key={ticket._id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                        <h4 className="text-lg font-semibold text-blue-700">
                            {ticket.event?.name || "Nama Event Tidak Diketahui"}
                        </h4>
                        <p className="text-gray-700">Jenis Tiket: {ticket.ticketTypeName || ticket.eventTicketType?.name || "N/A"}</p>
                        <p className="text-gray-700">Jumlah: {ticket.quantity}</p>
                        <p className="text-gray-700">Harga per tiket: Rp {ticket.price.toLocaleString("id-ID")}</p>
                        <p className="text-gray-700">Total Pembelian: Rp {ticket.total.toLocaleString("id-ID")}</p>
                        <p className="text-gray-700">Tanggal Event: {new Date(ticket.eventDate).toLocaleDateString("id-ID", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className={`font-bold mt-2 ${
                            ticket.status === 'paid' ? 'text-green-600' :
                                ticket.status === 'pending' ? 'text-yellow-600' :
                                    ticket.status === 'cancelled' ? 'text-red-600' :
                                        'text-gray-600'
                        }`}>
                            Status: {ticket.status.toUpperCase()}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
};

export default MyTickets;