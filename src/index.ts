import { Elysia } from "elysia"
import { userController } from "./controller/user"
import { transactionController } from "./controller/transaction.controller"
import { productController } from "./controller/product/product"
import { authController } from "./controller/auth.controller"
import { postController } from "./controller/post.controller"
import { myError } from "./plugin/myError"

export const app = new Elysia()
  .use(myError)
  .get("/hello", () => "Hello Elysia", {})
  .group("/api", (app) =>
    app
      .use(authController)
      .use(userController)
      .use(productController)
      .use(transactionController)
      .use(postController)
  )
  .listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)

// export const api = treaty(app)
export type App = typeof app
