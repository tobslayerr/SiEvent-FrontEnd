import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContent } from "../../context/AppContext";
import axios from "axios";
import AlertBox from "../../components/Global/AlertBox";
import Loading from "../../components/Global/Loading";

const Login = () => {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(false);
  const { backendUrl, setIsLoggedin, setUserData } = useContext(AppContent);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [alert, setAlert] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => setAlert({ message: "", type: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      axios.defaults.withCredentials = true;

      if (!isLoginMode) {
        const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);
          // Bisa juga fetch user data setelah register kalau perlu
          navigate("/");
        } else {
          setAlert({ message: data.message, type: "error" });
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedin(true);

          try {
            const userRes = await axios.get(`${backendUrl}/api/user/data`, {
              withCredentials: true,
            });

            if (userRes.data.success) {
              setUserData({
                firstName: userRes.data.userData.name,
                email: userRes.data.userData.email,
                profilePicture: userRes.data.userData.profilePicture,
                username:
                  userRes.data.userData.name
                    ?.split(" ")[0]
                    ?.toLowerCase() || "user",
              });
            } else {
              setUserData(null);
            }
          } catch {
            setUserData(null);
          }

          navigate("/");
        } else {
          setAlert({ message: data.message, type: "error" });
        }
      }
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || error.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-t from-blue-200 via-white to-blue-20 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isLoginMode ? "Masuk ke akun anda" : "Buat akun anda"}
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

        <form className="space-y-4" onSubmit={onSubmitHandler}>
          {!isLoginMode && (
            <div>
              <label className="block text-gray-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                placeholder="Contoh: Budi Setiawan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {isLoginMode && (
            <div className="text-right">
              <Link
                to="/reset-password"
                className="text-sm text-blue-500 hover:underline"
              >
                Lupa password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#00ADB5] hover:bg-blue-600 text-white px-4 py-2 rounded-full font-medium transition active:scale-90"
          >
            {isLoginMode ? "Masuk" : "Daftar"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-700">
          {isLoginMode ? (
            <>
              Belum punya akun?{" "}
              <button
                onClick={() => setIsLoginMode(false)}
                className="text-blue-500 hover:underline"
              >
                Buat Akun
              </button>
            </>
          ) : (
            <>
              Sudah punya akun?{" "}
              <button
                onClick={() => setIsLoginMode(true)}
                className="text-blue-500 hover:underline"
              >
                Login
              </button>
            </>
          )}
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-gray-500 text-sm hover:text-blue-500 hover:underline"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
