import { error } from "elysia"
import type { UserToken } from "../../interface/token.type"

import type { PostProductParam } from "../../model/post.model"
import type { ProductId } from "../../model/product"

export class ProductLikeService {
  async like(param: ProductId, payload: UserToken) {
    throw error("Not Implemented", "Method not implemented. from elysia")
  }
  async unlike(param: ProductId, payload: UserToken) {
    throw error("Not Implemented", "Method not implemented. from elysia")
  }
}
