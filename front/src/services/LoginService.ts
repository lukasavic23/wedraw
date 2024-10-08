import axios from "../../config/axios";
import { LoginPayload } from "../interfaces/Login";

class LoginService {
  static login = function (params: LoginPayload) {
    return axios.post("/users/login", params);
  };
}

export default LoginService;
