export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export type UserRole = "Provider" | "Distributer" | null;

export interface UserDetail extends User {
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}