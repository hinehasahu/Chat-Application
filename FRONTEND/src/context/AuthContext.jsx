import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false)

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (jwt) {
      const payload = JSON.parse(atob(jwt.split(".")[1]));
      setUser({
        _id: payload.userId,
        name: payload.name,
        email: payload.email,
      });
    }
  }, []);

  
  return (
    <AuthContext.Provider value={{user, setUser, token, login, logout, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);