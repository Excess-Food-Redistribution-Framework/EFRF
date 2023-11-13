export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export type UserRole = null |'Provider' | 'Distributer';

export interface UserDetail extends User {
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}
