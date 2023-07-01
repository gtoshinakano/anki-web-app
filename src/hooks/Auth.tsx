import React, { useEffect, useState } from "react";
import { auth } from "../service/firebase";
import { User } from "firebase/auth";
import LoginView from "../views/login";

interface props {
  children: JSX.Element;
}

export const AuthContext = React.createContext<User | null>(null);

export const AuthProvider: React.FC<props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged(setUser);
  }, []);

  if (user) {
    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
  } else {
    return <LoginView />;
  }
};
