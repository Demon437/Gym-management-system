import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Default credentials stored in localStorage on first load
const DEFAULT_CREDENTIALS = [
  {
    id: 1,
    email: 'admin@fitcore.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'Admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
  },
  {
    id: 2,
    email: 'manager@fitcore.com',
    password: 'manager123',
    name: 'Sarah Manager',
    role: 'Manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  }
];

const AUTH_STORAGE_KEY  = 'fitcore_auth_session';
const USERS_STORAGE_KEY = 'fitcore_users';

// Seed default users into localStorage if not already there
const seedUsers = () => {
  const existing = localStorage.getItem(USERS_STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_CREDENTIALS));
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: seed users + restore any active session
  useEffect(() => {
    seedUsers();
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Login: validate credentials against localStorage users
  const login = (email, password) => {
    const usersRaw = localStorage.getItem(USERS_STORAGE_KEY);
    const users    = usersRaw ? JSON.parse(usersRaw) : DEFAULT_CREDENTIALS;

    const matched = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (matched) {
      const sessionUser = {
        id:     matched.id,
        name:   matched.name,
        email:  matched.email,
        role:   matched.role,
        avatar: matched.avatar
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);
      return { success: true, user: sessionUser };
    }

    return { success: false, error: 'Invalid email or password. Please try again.' };
  };

  // Logout: clear session from localStorage
  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
