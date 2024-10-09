import axios from "../../config/axios";
import { AxiosResponseType } from "../interfaces/Common";
import { LoginPayload, LoginResponse } from "../interfaces/Login";

class LoginService {
  static login = function (
    params: LoginPayload
  ): AxiosResponseType<LoginResponse> {
    return axios.post("/users/login", params);
  };

  static getUser = function () {
    return axios.get("/users/me");
  };
}

export default LoginService;
