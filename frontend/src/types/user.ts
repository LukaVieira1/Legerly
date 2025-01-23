export interface IUser {
  id: number;
  name: string;
  email: string;
  role: "OWNER" | "MANAGER" | "EMPLOYEE";
  store: {
    id: number;
    name: string;
    image?: string;
  };
}

export interface IShortUser {
  id: number;
  name: string;
  email: string;
}
