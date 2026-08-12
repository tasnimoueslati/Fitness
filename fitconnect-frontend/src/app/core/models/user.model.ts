export type Role = 'ADMIN' | 'CLIENT' | 'COACH' | 'NUTRITIONNISTE';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}
