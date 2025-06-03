import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Global/Loading";
import AlertBox from "../../components/Global/AlertBox";

export default function SiCreatorDashboard() {
  const { backendUrl, userData, isLoggedin } = useContext(AppContent);
  const [activeTab, setActiveTab] = useState("view");
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: "", // This will be the event's overall price, if applicable
    date: "",
    location: "",
    description: "",
    isFree: false,
    banner: null,
  });

  // --- NEW STATE FOR TICKETS ---
  const [ticketData, setTicketData] = useState([
    { name: "", quantity: "", price: "", isFree: false },
  ]);
  // --- END NEW STATE ---

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 4000);
  };

  const fetchMyEvents = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/event/myevents`, {
        withCredentials: true,
      });
      setEvents(res.data.events || []);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedin && userData?.isSiCreator) {
      fetchMyEvents();
    }
  }, [isLoggedin, userData]);

  // --- NEW HANDLERS FOR TICKETS ---
  const handleAddTicket = () => {
    setTicketData([...ticketData, { name: "", quantity: "", price: "", isFree: false }]);
  };

  const handleRemoveTicket = (index) => {
    const newTicketData = [...ticketData];
    newTicketData.splice(index, 1);
    setTicketData(newTicketData);
  };

  const handleTicketChange = (index, field, value) => {
    const newTicketData = [...ticketData];
    newTicketData[index][field] = value;
    if (field === "isFree") {
      newTicketData[index].price = value ? "" : newTicketData[index].price;
    }
    setTicketData(newTicketData);
  };
  // --- END NEW HANDLERS ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation for ticket data
    for (const ticket of ticketData) {
      if (!ticket.name || !ticket.quantity) {
        showAlert("error", "❌ Nama tiket dan kuantitas harus diisi.");
        setIsSubmitting(false);
        return;
      }
      if (!ticket.isFree && (!ticket.price || isNaN(ticket.price))) {
        showAlert("error", `❌ Harga tiket "${ticket.name}" tidak valid.`);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "banner" && !value) return; // Don't append if banner is null on edit
        if (key === "price" && formData.isFree) return; // Don't send price if event is free
        payload.append(key, value);
      });
      payload.set("isFree", formData.isFree ? "true" : "false");

      // --- ADD TICKETS TO PAYLOAD ---
      // Stringify the ticketData array and append it
      payload.append("tickets", JSON.stringify(ticketData));
      // --- END ADD TICKETS ---

      if (editingId) {
        await axios.patch(`${backendUrl}/api/event/updateevent/${editingId}`, payload, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }, // Ensure correct header for FormData
        });
        showAlert("success", " Event berhasil diperbarui!");
        setEditingId(null);
      } else {
        await axios.post(`${backendUrl}/api/event/create`, payload, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }, // Ensure correct header for FormData
        });
        showAlert("success", " Event berhasil dibuat!");
      }

      // Reset forms
      setFormData({
        name: "",
        type: "",
        price: "",
        date: "",
        location: "",
        description: "",
        isFree: false,
        banner: null,
      });
      setTicketData([{ name: "", quantity: "", price: "", isFree: false }]); // Reset tickets
      fetchMyEvents();
      setActiveTab("view");
    } catch (err) {
      console.error("Event submission failed:", err.response?.data || err.message);
      showAlert("error", `❌ Gagal membuat atau memperbarui event: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (event) => {
    setFormData({
      name: event.name || "",
      type: event.type || "",
      price: event.price?.toString() || "",
      date: event.date?.split("T")[0] || "",
      location: event.location || "",
      description: event.description || "",
      isFree: event.isFree || false,
      banner: null, // Banner needs to be re-uploaded if changed
    });
    // --- SET TICKET DATA FOR EDITING ---
    // Make sure event.tickets exists and is an array before setting
    setTicketData(event.tickets && event.tickets.length > 0 ? event.tickets.map(ticket => ({
      name: ticket.name || "",
      quantity: ticket.quantity || "",
      price: ticket.price?.toString() || "",
      isFree: ticket.isFree || false,
    })) : [{ name: "", quantity: "", price: "", isFree: false }]);
    // --- END SET TICKET DATA ---
    setEditingId(event._id);
    setActiveTab("create");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus event ini?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`${backendUrl}/api/event/deleteevent/${id}`, {
        withCredentials: true,
      });
      showAlert("success", "🗑️ Event berhasil dihapus!");
      fetchMyEvents();
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      showAlert("error", `❌ Gagal menghapus event: ${err.response?.data?.message || err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isLoggedin || !userData) return <Loading />;
  if (!userData.isSiCreator) {
    return (
      <div className="p-6 text-center text-lg text-red-600">
        ❌ Anda bukan SiCreator. Silakan daftar sebagai SiCreator untuk mengakses dashboard ini.
      </div>
    );
  }

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {alert.message && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          <AlertBox
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ type: "", message: "" })}
          />
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white shadow-md px-4 py-4 flex flex-col gap-4 md:gap-6">
        <h2 className="text-xl font-bold">SiCreator</h2>
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => setActiveTab("create")}
            className={`text-left w-full px-4 py-2 rounded-md text-sm font-medium transition duration-300 ${
              activeTab === "create"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            ➕ Buat Event
          </button>
          <button
            onClick={() => setActiveTab("view")}
            className={`text-left w-full px-4 py-2 rounded-md text-sm font-medium transition duration-300 ${
              activeTab === "view"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            📅 Lihat Event Saya
          </button>
        </div>
        <div className="mt-4 md:mt-auto">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-[#00ADB5] text-white text-sm px-4 py-2 rounded-md hover:bg-blue-500 transition duration-300 active:scale-90"
          >
            Kembali ke Beranda
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        {activeTab === "create" && (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-md shadow space-y-4">
            <h2 className="text-xl font-semibold">
              {editingId ? "Edit Event" : "Buat Event Baru"}
            </h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
              {/* Event Details */}
              <h3 className="text-lg font-medium border-b pb-2">Detail Event</h3>
              <input
                type="text"
                placeholder="Nama Event"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />

              <label className="block">
                <span className="block mb-1">Tipe Event</span>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="" disabled>
                    Pilih tipe event
                  </option>
                  <option value="offline">Offline</option>
                  <option value="online">Online</option>
                </select>
              </label>

              <label className="block">
                <span className="block mb-1">Deskripsi Event</span>
                <textarea
                  rows={4}
                  placeholder="Tuliskan deskripsi event"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </label>

              {/* Removed original event price input and isFree checkbox.
                  Now price will be handled by tickets.
                  If you still want an overall event price, you can keep it and
                  adjust logic, but it's redundant if tickets dictate pricing.
              */}

              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />

              <input
                type="text"
                placeholder="Lokasi Event"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, banner: e.target.files[0] })}
                className="w-full p-2 border rounded"
                required={!editingId}
              />

              {/* --- TICKET MANAGEMENT SECTION --- */}
              <h3 className="text-lg font-medium border-b pb-2 mt-6">Tiket Event</h3>
              {ticketData.map((ticket, index) => (
                <div key={index} className="border p-4 rounded-md space-y-3 relative">
                  <h4 className="font-semibold text-md">Tiket #{index + 1}</h4>
                  <input
                    type="text"
                    placeholder="Nama Tiket (e.g., Early Bird, Reguler)"
                    value={ticket.name}
                    onChange={(e) => handleTicketChange(index, "name", e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Kuantitas Tiket"
                    value={ticket.quantity}
                    onChange={(e) => handleTicketChange(index, "quantity", e.target.value)}
                    className="w-full p-2 border rounded"
                    min={1}
                    required
                  />
                  <label className="block">
                    <span className="block mb-1">Harga Tiket (per tiket)</span>
                    <input
                      type="number"
                      placeholder="Harga"
                      value={ticket.price}
                      disabled={ticket.isFree}
                      min={0}
                      onChange={(e) => handleTicketChange(index, "price", e.target.value)}
                      className="w-full p-2 border rounded"
                      required={!ticket.isFree}
                    />
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={ticket.isFree}
                      onChange={(e) => handleTicketChange(index, "isFree", e.target.checked)}
                      className="mr-2"
                    />
                    Tiket Gratis
                  </label>
                  {ticketData.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTicket(index)}
                      className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                      title="Hapus Tiket"
                    >
                      ✖️
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddTicket}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition duration-300"
              >
                ➕ Tambah Jenis Tiket
              </button>
              {/* --- END TICKET MANAGEMENT SECTION --- */}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-[#00ADB5] text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 ${
                  isSubmitting ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting
                  ? "⏳ Memproses..."
                  : editingId
                  ? "Update Event"
                  : "Buat Event"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "view" && (
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-xl font-semibold mb-2">Daftar Event Saya</h2>
            {events.length === 0 ? (
              <p className="text-gray-600 text-sm">Belum ada event.</p>
            ) : (
              events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white p-4 rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center"
                >
                  <div className="mb-2 md:mb-0">
                    <h3 className="font-bold text-lg">{event.name}</h3>
                    <p className="text-sm text-gray-600">{event.date?.split("T")[0]}</p>
                    {/* Display ticket info */}
                    {event.tickets && event.tickets.length > 0 ? (
                      <div className="text-xs mt-1">
                        {event.tickets.map((ticket, idx) => (
                          <p key={idx}>
                            {ticket.name}: {ticket.isFree ? "Gratis" : `Rp ${ticket.price.toLocaleString("id-ID")}`} (Jumlah: {ticket.quantity})
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm mt-1">Belum ada tiket terdaftar.</p>
                    )}
                  </div>
                  <div className="space-x-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(event)}
                      className="px-3 py-1 bg-yellow-400 rounded text-sm transition duration-300 hover:bg-yellow-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      disabled={deletingId === event._id}
                      className={`px-3 py-1 bg-red-500 text-white rounded text-sm transition duration-300 ${
                        deletingId === event._id ? "opacity-60 cursor-not-allowed" : "hover:bg-red-400"
                      }`}
                    >
                      {deletingId === event._id ? "⏳ Menghapus..." : "Hapus"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}