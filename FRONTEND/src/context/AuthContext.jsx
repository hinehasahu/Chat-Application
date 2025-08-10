import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

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
    <AuthContext.Provider value={{user, setUser, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);