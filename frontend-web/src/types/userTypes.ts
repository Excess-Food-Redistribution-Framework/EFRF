export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export type UserRole = 'Provider' | 'Distributor' | null;

export interface LoginRequest {
  email: string;
  password: string;
}
