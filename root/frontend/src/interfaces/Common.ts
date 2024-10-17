import { AxiosResponse } from "axios";

interface Response<T> {
  status: "success" | "fail" | "error";
  data: T | null;
}

export type AxiosResponseType<T> = Promise<AxiosResponse<Response<T>>>;

export type HexColor = `#${string}`;
