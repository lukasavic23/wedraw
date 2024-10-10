import axios from "../../config/axios";
import { AxiosResponseType } from "../interfaces/Common";
import { LoginPayload, LoginResponse } from "../interfaces/Login";

class AuthenticationService {
  static login = function (
    params: LoginPayload
  ): AxiosResponseType<LoginResponse> {
    return axios.post("/users/login", params);
  };

  static refreshUser = function (): AxiosResponseType<LoginResponse> {
    return axios.get("/users/refresh");
  };

  static logout = function () {
    return axios.get("/users/logout");
  };
}

export default AuthenticationService;
