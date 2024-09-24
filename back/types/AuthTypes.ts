export interface SignUpBody {
  name: string;
  lastName?: string;
  email: string;
  password: string;
  passwordConfirm: string;
}
