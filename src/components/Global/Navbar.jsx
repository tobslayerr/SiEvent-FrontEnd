import { useContext, useEffect, useState } from "react";
import SearchBar from "../Navbar/SearchBar";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import { AppContent } from "../../context/AppContext";

const Navbar = () => {
  const { isLoggedin, setIsLoggedin, userData, setUserData, backendUrl } = useContext(AppContent);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      try {
        const authRes = await fetch(`${backendUrl}/api/auth/is-auth`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        const authData = await authRes.json();
        if (!authData.success) {
          setIsLoggedin(false);
          setUserData(null);
          return;
        }

        const userRes = await fetch(`${backendUrl}/api/user/data`, {
          method: "GET",
          credentials: "include",
        });

        const userDataJson = await userRes.json();
        if (userDataJson.success) {
          const user = userDataJson.userData;
          setIsLoggedin(true);
          setUserData({
            firstName: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            username: user.name?.split(" ")[0]?.toLowerCase() || "user",
            isSiCreator: user.isSiCreator,
            siCreatorRequest: user.siCreatorRequest,
          });
        } else {
          setIsLoggedin(false);
          setUserData(null);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsLoggedin(false);
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchUser();
  }, [backendUrl]);

  const logout = async () => {
  try {
    await fetch(`${backendUrl}/api/auth/logout`, {
      method: "POST",
      credentials: "include", // penting untuk cookie session
    });

    // Bersihkan semua state terkait user
    setIsLoggedin(false);
    setUserData(null);
    setUserMenuOpen(false);
    setMenuOpen(false);

    // Reload halaman untuk memastikan state benar-benar reset
    window.location.href = "/";
  } catch (error) {
    console.error("Logout failed:", error);
    alert("Gagal logout. Coba lagi.");
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

    const baseBtnClass =
      "w-full px-4 py-2 rounded-full text-white text-sm font-medium transition duration-300 ease-in-out active:scale-90";

    if (userData.isSiCreator) {
      return (
        <button
          onClick={() => navigate("/sicreator/dashboard")}
          className={`${baseBtnClass} bg-green-600 hover:bg-green-700`}
        >
          SiCreator Dashboard
        </button>
      );
    } else if (userData.siCreatorRequest) {
      return (
        <button className={`${baseBtnClass} bg-yellow-600 cursor-default`}>
          Menunggu Proses
        </button>
      );
    } else {
      return (
        <button
          onClick={handleSiCreatorRequest}
          className={`${baseBtnClass} bg-[#393E46] hover:bg-blue-600`}
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
          <img
            src="/images/NavLogo.png"
            alt="Logo"
            className="h-10 transition duration-300 ease-in-out active:scale-90"
          />
        </Link>

        {/* Search Bar (Desktop only) */}
        <div className="hidden lg:flex items-center flex-1 mx-6 text-gray-400">
          <SearchBar />
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-3 relative">
          {isLoading ? (
            <div className="w-48 h-10 bg-gray-500/40 animate-pulse rounded" />
          ) : isLoggedin && userData ? (
            <>
              {renderSiCreatorButton()}
              <Link to="/bantuan">
                <button className="bg-[#393E46] hover:bg-blue-600 px-4 py-2 rounded-full text-white text-sm font-medium active:scale-90 transition duration-300">
                  Bantuan
                </button>
              </Link>
              <div className="w-px h-7 bg-gray-400" />
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-10 h-10 rounded-full bg-[#00ADB5] text-white font-bold text-lg flex items-center justify-center active:scale-90 transition"
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
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="bg-[#393E46] hover:bg-blue-600 px-4 py-2 rounded-full text-white text-sm font-medium active:scale-90"
              >
                Jadi SiCreator
              </button>
              <Link to="/bantuan">
                <button className="bg-[#393E46] hover:bg-blue-600 px-4 py-2 rounded-full text-white text-sm font-medium active:scale-90">
                  Bantuan
                </button>
              </Link>
              <div className="w-px h-7 bg-gray-400" />
              <Link to="/login">
                <button className="bg-[#00ADB5] hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium active:scale-90">
                  Masuk
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
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
          menuOpen ? "max-h-screen px-6 py-4 space-y-4 opacity-100" : "max-h-0 opacity-0 px-6"
        )}
      >
        <SearchBar />
        <div className="flex flex-col space-y-3 mt-4">
          {isLoading ? (
            <div className="h-20 bg-gray-500/40 animate-pulse rounded" />
          ) : isLoggedin && userData ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#00ADB5] text-white font-bold flex items-center justify-center">
                  {userData.username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-white font-medium">Hi, {userData.firstName}</span>
              </div>
              <button
                className="w-full text-left text-white px-4 py-2 rounded hover:bg-[#393E46]"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/profile");
                }}
              >
                Dashboard
              </button>
              <button
                className="w-full text-left text-white px-4 py-2 rounded hover:bg-[#393E46]"
                onClick={logout}
              >
                Logout
              </button>
              {renderSiCreatorButton()}
              <Link to="/bantuan">
                <button className="w-full bg-[#393E46] hover:bg-blue-600 text-white px-4 py-2 rounded-full active:scale-90 transition duration-300 ease-in-out">
                  Bantuan
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="w-full bg-[#00ADB5] hover:bg-blue-600 text-white px-4 py-2 rounded-full active:scale-90 transition duration-300 ease-in-out">
                  Masuk
                </button>
              </Link>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-[#393E46] hover:bg-blue-600 text-white px-4 py-2 rounded-full active:scale-90 transition duration-300 ease-in-out"
              >
                Jadi SiCreator
              </button>
              <Link to="/bantuan">
                <button className="w-full bg-[#393E46] hover:bg-blue-600 text-white px-4 py-2 rounded-full active:scale-90 transition duration-300 ease-in-out">
                  Bantuan
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
