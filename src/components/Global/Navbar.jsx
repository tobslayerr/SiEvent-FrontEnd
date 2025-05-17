import { useContext, useEffect, useState } from "react";
import SearchBar from "../Navbar/SearchBar";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import { AppContent } from "../../context/AppContext";

export default function Navbar() {
  const { isLoggedin, setIsLoggedin, userData, setUserData, backendUrl } = useContext(AppContent);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedin && !userData) {
      fetch(`${backendUrl}/api/user/data`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUserData({
              firstName: data.userData.name,
              email: data.userData.email,
              profilePicture: data.userData.profilePicture,
              username: data.userData.name?.split(" ")[0]?.toLowerCase() || "user",
              isSiCreator: data.userData.isSiCreator,
              siCreatorRequest: data.userData.siCreatorRequest,
            });
          } else {
            setIsLoggedin(false);
            setUserData(null);
          }
        })
        .catch(() => {
          setIsLoggedin(false);
          setUserData(null);
        });
    }
  }, [isLoggedin]);

  const logout = async () => {
    try {
      await fetch(`${backendUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggedin(false);
      setUserData(null);
      setUserMenuOpen(false);
      setMenuOpen(false);
      navigate("/");
    }
  };

  const handleSiCreatorRequest = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/user/requestsicreator`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        alert("Permintaan menjadi SiCreator berhasil dikirim. Menunggu persetujuan admin.");
        setUserData((prev) => ({
          ...prev,
          siCreatorRequest: true,
        }));
      } else {
        alert(data.message || "Gagal mengirim permintaan.");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat mengirim permintaan.");
    }
  };

  const renderSiCreatorButton = () => {
    if (!userData) return null;
    if (userData.isSiCreator) {
      return (
        <button className="bg-green-600 px-4 py-2 rounded-full text-white text-sm font-medium cursor-default">
          Sudah diterima
        </button>
      );
    } else if (userData.siCreatorRequest) {
      return (
        <button className="bg-yellow-600 px-4 py-2 rounded-full text-white text-sm font-medium cursor-default">
          Menunggu Proses
        </button>
      );
    } else {
      return (
        <button
          onClick={handleSiCreatorRequest}
          className="bg-[#393E46] hover:bg-blue-600 px-4 py-2 rounded-full text-white text-sm font-medium active:scale-90"
        >
          Jadi SiCreator
        </button>
      );
    }
  };

  return (
    <nav className="bg-[#222831] shadow text-sm text-white relative">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link to="/">
          <img src="/images/NavLogo.png" alt="Logo" className="h-10" />
        </Link>

        {/* SearchBar (Desktop Only) */}
        <div className="hidden lg:flex items-center space-x-4 text-gray-400">
          <div className="w-[400px] lg:w-[450px] xl:w-[500px]">
            <SearchBar />
          </div>
        </div>

        {/* Right Buttons (Desktop Only) */}
        <div className="hidden lg:flex items-center space-x-2 relative">
          {isLoggedin && userData ? renderSiCreatorButton() : (
            <button className="bg-[#393E46] hover:bg-blue-600 px-4 py-2 rounded-full text-white text-sm font-medium active:scale-90">
              Jadi SiCreator
            </button>
          )}
          <button className="bg-[#393E46] hover:bg-blue-600 px-4 py-2 rounded-full text-white text-sm font-medium active:scale-90">
            Bantuan
          </button>
          <div className="w-px h-7 bg-gray-400" />
          {isLoggedin && userData ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-10 h-10 rounded-full bg-[#00ADB5] text-white font-bold text-lg flex items-center justify-center"
              >
                {userData.username?.charAt(0).toUpperCase()}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-50">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/profile");
                    }}
                  >
                    Dashboard
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="bg-[#00ADB5] hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium active:scale-90">
                Masuk
              </button>
            </Link>
          )}
        </div>

        {/* Hamburger (Mobile Only) */}
        <div className="lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none active:scale-90"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={clsx(
          "lg:hidden bg-[#222831] transition-all duration-300 ease-in-out overflow-hidden",
          menuOpen ? "max-h-96 px-6 py-4 space-y-4 opacity-100" : "max-h-0 opacity-0 px-6"
        )}
      >
        <div className="text-gray-400">
          <SearchBar />
        </div>

        {isLoggedin && userData ? (
          <>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-8 h-8 rounded-full bg-[#00ADB5] text-white font-bold flex items-center justify-center">
                {userData.username?.charAt(0).toUpperCase()}
              </div>
              <span className="text-white font-medium">
                Hi, {userData.firstName}
              </span>
            </div>
            <button
              className="w-full text-left text-white px-4 py-2 rounded hover:bg-[#393E46] transition"
              onClick={() => {
                setMenuOpen(false);
                navigate("/profile");
              }}
            >
              Dashboard
            </button>
            <button
              className="w-full text-left text-white px-4 py-2 rounded hover:bg-[#393E46] transition"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="w-full bg-[#00ADB5] hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium active:scale-90 transition">
              Masuk
            </button>
          </Link>
        )}

        <div className="w-full h-px bg-gray-400" />

        {/* SiCreator Button */}
        {isLoggedin && userData ? renderSiCreatorButton() : (
          <button className="w-full bg-[#393E46] hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium active:scale-90 transition">
            Jadi SiCreator
          </button>
        )}
        <button className="w-full bg-[#393E46] hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium active:scale-90 transition">
          Bantuan
        </button>
      </div>
    </nav>
  );
}
