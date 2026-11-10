
import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
      throw error;
    }
  }

  useEffect(() => {
    async function checkAuthentication() {
      const token = localStorage.getItem('pegadazero_token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await refreshUser();
      } catch (error) {
        console.error('Erro ao validar autenticação:', error);
        localStorage.removeItem('pegadazero_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkAuthentication();
  }, []);

  async function login(email, password) {
    const response = await api.post('/auth/login', {
      email,
      password
    });

    localStorage.setItem('pegadazero_token', response.data.token);
    setUser(response.data.user);
  }

  async function register(name, email, password) {
    const response = await api.post('/auth/register', {
      name,
      email,
      password
    });

    localStorage.setItem('pegadazero_token', response.data.token);
    setUser(response.data.user);
  }

  function logout() {
    localStorage.removeItem('pegadazero_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}