export type User = {
  _id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export interface AuthResponse {
  user: User;
  message?: string;
}
