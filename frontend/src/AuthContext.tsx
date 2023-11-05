import React, { useState, createContext, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

// Define the shape of your context state
type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
};

// Create the default context with a stub for setIsLoggedIn
const defaultAuthContext: AuthContextType = {
  isLoggedIn: false,
  setIsLoggedIn: () => {
    throw new Error('setIsLoggedIn was called without being within the AuthProvider');
  },
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode; // ReactNode was replaced with React.ReactNode
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('token'));

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
