export interface Notification {
  id: number;
  userId: number;
  message: string;
  type: string;
  read: boolean;
  createdAt?: string;
}
