import React, { useContext, useEffect, useState, useCallback } from "react"; // Tambahkan useCallback
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Global/Loading";
import AlertBox from "../../components/Global/AlertBox";
import MapLocationPicker from "../../components/MapLocationPicker"; // Pastikan path ini benar!

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
    price: "",
    date: "",
    location: "", // Ini akan menyimpan alamat string
    description: "",
    isFree: false,
    banner: null,
    latitude: null, // State baru untuk latitude
    longitude: null, // State baru untuk longitude
  });

  const [ticketData, setTicketData] = useState([
    { name: "", quantity: "", price: "", isFree: false },
  ]);

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

  // --- NEW HANDLER FOR LOCATION SELECTION FROM MAP ---
  const handleLocationSelect = useCallback(({ lat, lng, address }) => {
    setFormData((prev) => ({
      ...prev,
      location: address, // Set alamat yang diformat
      latitude: lat,
      longitude: lng,
    }));
  }, []);
  // --- END NEW HANDLER ---

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

    // --- NEW VALIDATION FOR LOCATION ---
    if (!formData.latitude || !formData.longitude || !formData.location) {
      showAlert("error", "❌ Silakan pilih lokasi event di peta dan pastikan alamat terisi.");
      setIsSubmitting(false);
      return;
    }
    // --- END NEW VALIDATION ---

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "banner" && !value) return; // Jangan tambahkan jika banner null saat edit
        if (key === "price" && formData.isFree) return; // Jangan kirim harga jika event gratis

        // Pastikan latitude dan longitude juga ditambahkan ke payload
        // Tapi hindari mengirim 'null' sebagai string jika belum ada
        if (key === "latitude" && value === null) return;
        if (key === "longitude" && value === null) return;
        
        payload.append(key, value);
      });
      payload.set("isFree", formData.isFree ? "true" : "false");

      // --- ADD TICKETS TO PAYLOAD ---
      payload.append("tickets", JSON.stringify(ticketData));
      // --- END ADD TICKETS ---

      if (editingId) {
        await axios.patch(`${backendUrl}/api/event/updateevent/${editingId}`, payload, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        showAlert("success", " Event berhasil diperbarui!");
        setEditingId(null);
      } else {
        await axios.post(`${backendUrl}/api/event/create`, payload, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        showAlert("success", " Event berhasil dibuat!");
      }

      // Reset forms, termasuk data lokasi
      setFormData({
        name: "",
        type: "",
        price: "",
        date: "",
        location: "",
        description: "",
        isFree: false,
        banner: null,
        latitude: null,
        longitude: null,
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
      latitude: event.latitude || null, // Muat latitude yang ada
      longitude: event.longitude || null, // Muat longitude yang ada
    });
    // --- SET TICKET DATA FOR EDITING ---
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
            onClick={() => {
              setActiveTab("create");
              // Reset form data saat beralih ke tab buat/edit jika tidak dalam mode edit yang aktif
              if (!editingId) {
                setFormData({
                  name: "",
                  type: "",
                  price: "",
                  date: "",
                  location: "",
                  description: "",
                  isFree: false,
                  banner: null,
                  latitude: null,
                  longitude: null,
                });
                setTicketData([{ name: "", quantity: "", price: "", isFree: false }]);
              }
            }}
            className={`text-left w-full px-4 py-2 rounded-md text-sm font-medium transition duration-300 ${
              activeTab === "create"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            ➕ Buat Event
          </button>
          <button
            onClick={() => {
              setActiveTab("view");
              setEditingId(null); // Kosongkan editing state saat beralih ke tab view
            }}
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

              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />

              {/* --- GANTI INPUT LOKASI DENGAN MAPLOCATIONPICKER --- */}
              <label className="block">
                <span className="block mb-1 font-medium text-gray-700">Pilih Lokasi Event di Peta</span>
                <MapLocationPicker
                  onSelectLocation={handleLocationSelect}
                  initialLocation={
                    formData.latitude && formData.longitude
                      ? { lat: formData.latitude, lng: formData.longitude }
                      : null
                  }
                />
                {/* Tampilkan alamat yang dipilih dari peta */}
                {formData.location && (
                  <p className="text-sm text-gray-700 mt-2 p-2 border rounded bg-gray-50">
                    Lokasi Terpilih: <strong>{formData.location}</strong>
                    {/* Opsional: Tampilkan koordinat juga */}
                    {formData.latitude && formData.longitude && (
                      <span> (Lat: {formData.latitude.toFixed(4)}, Lng: {formData.longitude.toFixed(4)})</span>
                    )}
                  </p>
                )}
              </label>
              {/* --- AKHIR GANTI INPUT LOKASI --- */}

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
                    {/* --- TAMPILKAN LOKASI DENGAN KOORDINAT --- */}
                    <p className="text-sm text-gray-600">
                      Lokasi: {event.location}
                      {event.latitude && event.longitude && (
                        <span> (Lat: {event.latitude.toFixed(4)}, Lng: {event.longitude.toFixed(4)})</span>
                      )}
                    </p>
                    {/* --- AKHIR TAMPILKAN LOKASI --- */}
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