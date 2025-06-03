import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../../context/AppContext";
import AlertBox from "../../components/Global/AlertBox";
import Loading from "../../components/Global/Loading";

const ResetPasswordDashboard = () => {
  const { backendUrl } = useContext(AppContent);
  const [step, setStep] = useState(2); // Langsung ke OTP input
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(true); // true sampai email & OTP terkirim

  const navigate = useNavigate();

  useEffect(() => {
    // Ambil email user dari session
    const fetchUserAndSendOtp = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/user/data`, {
          withCredentials: true,
        });
        const userEmail = res.data.email;
        setEmail(userEmail);
        localStorage.setItem("resetEmail", userEmail);

        // Kirim OTP otomatis
        const otpRes = await axios.post(
          `${backendUrl}/api/auth/send-reset-otp`,
          { email: userEmail }
        );

        if (otpRes.data.success) {
          setAlert({ message: "OTP dikirim ke email Anda.", type: "success" });
        } else {
          setAlert({ message: otpRes.data.message, type: "error" });
        }
      } catch (err) {
        setAlert({
          message: err.response?.data?.message || "Gagal memuat data pengguna.",
          type: "error",
        });
      } finally {
        setLoading(false);
        localStorage.removeItem("resetEmail");
      }
    };

    fetchUserAndSendOtp();
  }, [backendUrl]);

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => setAlert({ message: "", type: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (!newPassword) {
      setAlert({ message: "Password baru harus diisi.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/auth/reset-password`, {
        email,
        otp: otpCode,
        newPassword,
      });

      if (res.data.success) {
        setAlert({ message: "Password berhasil direset!", type: "success" });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setAlert({ message: res.data.message || "OTP salah", type: "error" });
      }
    } catch (err) {
      setAlert({ message: err.response?.data?.message || "Reset gagal", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-t from-blue-200 via-white to-blue-20 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Reset Password
        </h2>

        {alert.message && (
          <div className="mb-4">
            <AlertBox
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert({ message: "", type: "" })}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((value, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  value={value}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  maxLength={1}
                  className="w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-xl"
                />
              ))}
            </div>
            <button
              onClick={() => {
                const otpCode = otp.join("");
                if (otpCode.length < 6) {
                  setAlert({ message: "Lengkapi semua kolom OTP", type: "error" });
                  return;
                }
                setStep(3);
              }}
              className="w-full bg-[#00ADB5] hover:bg-blue-600 text-white px-4 py-2 rounded-full font-medium transition active:scale-90"
            >
              Lanjut ke Reset Password
            </button>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-1">Password Baru</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#00ADB5] hover:bg-blue-600 text-white px-4 py-2 rounded-full font-medium transition active:scale-90 ease-in-out duration-300"
            >
              Reset Password
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-gray-500 text-sm hover:text-blue-500 hover:underline transition duration-300 ease-in-out active:scale-90"
          >
            ← Kembali ke Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordDashboard;
