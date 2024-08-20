export type MethodHandler = "GET" | "POST" | "PUT" | "DELETE";
export type ApiPath = "user" | "product" | "post" | "comment" | "auth"|'transaction';
export type HandlerType = {
  method?: MethodHandler;
  id?: Number | String;
  to: String;
  data?: Object;
  token?: string;
};
