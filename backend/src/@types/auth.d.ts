export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: "OWNER" | "MANAGER" | "EMPLOYEE";
    store: {
      id: number;
      name: string;
      image?: string | null;
    };
  };
}

export interface MeResponse {
  user: Omit<AuthResponse["user"], "token">;
}
