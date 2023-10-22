import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import axios from 'axios';
import { isTokenExpired } from './utils/jwt';

interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
  isLogged: () => boolean;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

function AuthProvider({ children }: React.PropsWithChildren) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );

  const isLogged = () => {
    if (isTokenExpired(token)) {
      setToken(null);
    }

    return !!token;
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common.Authorization;
      localStorage.removeItem('token');
    }
  }, [token]);

  const contextValue: AuthContextProps = useMemo(
    () => ({
      token,
      setToken,
      isLogged,
    }),
    [token]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
