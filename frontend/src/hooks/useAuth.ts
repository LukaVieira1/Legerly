"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IAuthResponse } from "@/types/auth";
import { IUser } from "@/types/user";
import { login } from "@/services/auth";
import { toast } from "react-toastify";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const storedUser = document.cookie
      .split("; ")
      .find((row) => row.startsWith("@Legerly:user="))
      ?.split("=")[1];

    if (storedUser) {
      setUser(JSON.parse(decodeURIComponent(storedUser)));
    }

    setIsLoading(false);
  }, []);

  async function signIn(
    email: string,
    password: string
  ): Promise<IAuthResponse | Error> {
    try {
      const response = await login(email, password);

      document.cookie = `@Legerly:token=${response.token}; path=/`;
      document.cookie = `@Legerly:user=${encodeURIComponent(
        JSON.stringify(response.user)
      )}; path=/`;

      setUser(response.user);
      router.push("/dashboard");

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
    document.cookie =
      "@Legerly:token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "@Legerly:user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
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
