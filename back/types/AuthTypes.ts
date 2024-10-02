export interface SignUpBody {
  name: string;
  lastName?: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface LoginBody {
  email: string;
  password: string;
}
