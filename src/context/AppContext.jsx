import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true); 
        axios.defaults.withCredentials = true;

        const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);

        if (data.success) {
          setIsLoggedin(true);
          setUserData(data.user);
        } else {
          setIsLoggedin(false);
          setUserData(false);
        }
      } catch (err) {
        setIsLoggedin(false);
        setUserData(false);
      } finally {
        setLoading(false); 
      }
    };

    checkAuth();
  }, [backendUrl]);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    loading,
    setLoading, 
  };

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  );
};
