import axios from "../../config/axios";
import { AxiosResponseType } from "../interfaces/Common";
import {
  LoginPayload,
  AuthenticationResponse,
  RegisterPayload,
} from "../interfaces/Login";

class AuthenticationService {
  static login = function (
    params: LoginPayload
  ): AxiosResponseType<AuthenticationResponse> {
    return axios.post("/users/login", params);
  };

  static register = function (
    params: RegisterPayload
  ): AxiosResponseType<AuthenticationResponse> {
    return axios.post("/users/signup", params);
  };

  static refreshUser = function (): AxiosResponseType<AuthenticationResponse> {
    return axios.get("/users/refresh");
  };

  static logout = function () {
    return axios.get("/users/logout");
  };
}

export default AuthenticationService;
