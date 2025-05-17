import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import Loading from "../../components/Global/Loading";

export default function Profile() {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading lokal
  const { backendUrl } = useContext(AppContent);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/user/data`, { withCredentials: true });
        if (res.data.success) {
          setUser(res.data.userData);
        } else {
          navigate("/login");
        }
      } catch (err) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [backendUrl, navigate]);

  const handlePasswordReset = () => {
    navigate("/reset-password");
  };

  const handleSendVerify = () => {
    navigate("/verify-email");
  };

  if (loading) return <Loading />;

  if (!user) return null; // Optional safety

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white shadow-md px-4 py-4 flex flex-col gap-4 md:gap-6">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <div className="flex flex-col space-y-2">
          {[
            { key: "dashboard", label: "Informasi Akun" },
            { key: "tickets", label: "Tiket Saya" },
            { key: "settings", label: "Reset Kata Sandi" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`text-left w-full px-4 py-2 rounded-md text-sm font-medium ${
                selectedTab === tab.key
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100 text-gray-700"
              } transition`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4 md:mt-auto">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-[#00ADB5] text-white text-sm px-4 py-2 rounded-md hover:bg-blue-500 transition active:scale-90"
          >
            Kembali ke Beranda
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        {selectedTab === "dashboard" && (
          <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow space-y-4">
            <h3 className="text-xl font-semibold">Informasi Akun</h3>
            <p><strong>Nama:</strong> {user.name || "-"}</p>
            <p><strong>Email:</strong> {user.email || "-"}</p>
            <div className="mt-4">
              <p className="text-sm mb-2">
                <strong>Status Akun:</strong>{" "}
                {user.isAccountVerified ? (
                  <span className="text-green-600 font-semibold">Terverifikasi</span>
                ) : (
                  <span className="text-red-600 font-semibold">Belum Terverifikasi</span>
                )}
              </p>
              {!user.isAccountVerified && (
                <button
                  onClick={handleSendVerify}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                >
                  Verifikasi Akun
                </button>
              )}
            </div>
          </div>
        )}

        {selectedTab === "tickets" && (
          <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow">
            <h3 className="text-xl font-semibold mb-4">Tiket Saya</h3>
            <p className="text-sm text-gray-600">(Daftar tiket akan ditampilkan di sini)</p>
          </div>
        )}

        {selectedTab === "settings" && (
          <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow">
            <h3 className="text-xl font-semibold mb-4">Reset Kata Sandi Saya</h3>
            <p className="text-sm mb-4 text-gray-700">
              Klik tombol di bawah ini untuk mereset kata sandi akun Anda.
            </p>
            <button
              onClick={handlePasswordReset}
              className="bg-[#00ADB5] text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Reset Kata Sandi
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
