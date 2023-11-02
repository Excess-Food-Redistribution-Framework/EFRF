import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import axios from 'axios';
import { isTokenExpired } from './utils/jwt';

interface IUserDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: null | "Provider" | "Distributer";
}

interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
  user: IUserDetail | null;
  setUser: (user: IUserDetail | null) => void;
  isAuth: () => boolean;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

function AuthProvider({ children }: React.PropsWithChildren) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );

  const [user, setUser_] = useState<IUserDetail | null>(
    JSON.parse(localStorage.getItem('user') || '{}')
  );

  const setUser = (user: IUserDetail | null) => {
    setUser_(user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }

  const isAuth = () => {
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
      user,
      setUser,
      isAuth,
    } as AuthContextProps),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
