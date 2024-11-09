export type MethodHandler = "GET" | "POST" | "PUT" | "DELETE"

type Product =
  | "product"
  | "product/user/comment"
  | "product/user/like"
  | "product/market"
export type ApiPath =
  | "user"
  | Product
  | "post"
  | "comment"
  | "auth"
  | "transaction"
export type HandlerType = {
  method?: MethodHandler
  id?: Number | String
  to: String
  data?: Object
  token?: string
}
