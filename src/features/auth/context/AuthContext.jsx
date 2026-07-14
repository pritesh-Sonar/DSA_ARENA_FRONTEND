import { createContext, useState, useEffect } from "react";
import { login as loginService, signup as signupService } from "../services/authService";

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

  const signup = async (username, password) => {
    const data = await signupService(username, password);
    return persistSession(data); // auto-login after signup, since your backend already returns a token
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};