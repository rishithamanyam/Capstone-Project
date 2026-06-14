export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'REPRESENTATIVE' | 'CUSTOMER';
  phone?: string;
  location?: string;
  managerId?: number;
  firstLogin?: boolean;
  createdAt?: string;
  token?: string;
}
