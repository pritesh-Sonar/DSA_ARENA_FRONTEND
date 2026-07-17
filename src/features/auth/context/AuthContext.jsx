import { createContext, useState, useEffect } from "react";
import {
  login as loginService,
  sendOtp as sendOtpService,
  verifyOtp as verifyOtpService,
} from "../services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const persistSession = (data) => {
    const userInfo = { username: data.username, role: data.role };
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
    return userInfo;
  };

  const login = async (username, password) => {
    const data = await loginService(username, password);
    return persistSession(data);
  };

  // Step 1 of signup — no session created yet, just triggers OTP email
  const sendOtp = async (username, email, password) => {
    return sendOtpService(username, email, password);
  };

  // Step 2 of signup — this is what actually creates the account + session
  const verifyOtp = async (email, otpCode) => {
    const data = await verifyOtpService(email, otpCode);
    return persistSession(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const setUserFromOAuth = ({ token, username, role }) => {
    const userInfo = { username, role };
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        sendOtp,
        verifyOtp,
        setUserFromOAuth,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
