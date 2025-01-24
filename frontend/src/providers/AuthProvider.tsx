"use client";

import { ReactNode, createContext, useContext } from "react";
import { useAuth } from "@/hooks/useAuth";
import { IAuthResponse } from "@/types/auth";
import { IUser } from "@/types/user";
interface AuthContextData {
  user: IUser | null;
  signIn: (email: string, password: string) => Promise<IAuthResponse | Error>;
  signOut: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
