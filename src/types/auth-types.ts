export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}
export interface LoginDto {
  email: string;
  password: string;
}
export interface RegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
