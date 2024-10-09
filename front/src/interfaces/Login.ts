export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  name: string;
  lastName: string;
  email: string;
  accessToken: string;
}
