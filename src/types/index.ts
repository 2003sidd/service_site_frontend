export interface User {
  _id?: string;
  name: string;
  email: string;
  isActive: boolean;
  password: string;
  number: string;
  createdAt?: string;
}

export interface Employee {
  _id: string | null;
  name: string;
  email: string;
  password: '';
  address: string
  isActive: boolean;
  number: string
  role: string
}

export interface Service {
  _id: string;
  name: string;
  description: string;
  services: SubService[],
  category: string;
  status: 'active' | 'inactive';
}
export interface SubService {
  price: string, name: string
}
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}