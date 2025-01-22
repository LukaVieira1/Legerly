"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { IUser, IAuthResponse } from "@/types/auth";
import { login } from "@/services/auth";
import api from "@/lib/api";
import { toast } from "react-toastify";

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const storedUser = localStorage.getItem("@Legerly:user");
    const storedToken = localStorage.getItem("@Legerly:token");

    if (storedUser && storedToken) {
      api.defaults.headers.authorization = `Bearer ${storedToken}`;
      setUser(JSON.parse(storedUser));
    } else if (pathname !== "/login") {
      router.push("/login");
    }

    setIsLoading(false);
  }, [pathname, router]);

  async function signIn(
    email: string,
    password: string
  ): Promise<IAuthResponse | Error> {
    try {
      const response = await login(email, password);

      localStorage.setItem("@Legerly:token", response.token);
      localStorage.setItem("@Legerly:user", JSON.stringify(response.user));

      setUser(response.user);
      router.push("/");

      toast.success("Login realizado com sucesso!");
      return response;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Ocorreu um erro inesperado");
      }
      return error as Error;
    }
  }

  function signOut() {
    localStorage.removeItem("@Legerly:token");
    localStorage.removeItem("@Legerly:user");
    delete api.defaults.headers.authorization;
    setUser(null);
    router.push("/login");
    toast.success("Logout realizado com sucesso!");
  }

  return {
    user,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isLoading,
  };
}
