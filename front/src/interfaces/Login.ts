export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  name: string;
  lastName: string;
  email: string;
  accessToken: string;
}

export interface RegisterPayload {
  name: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}
