import { Elysia } from "elysia"
import { userController } from "./controller/user"
import { transactionController } from "./controller/transaction.controller"
import { productController } from "./controller/product"

export const app = new Elysia()
  .get("/hello", () => "Hello Elysia")
  .group("/api", app =>
    app
      .use(userController)
      .use(productController)
      .use(transactionController)
  )
  .listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)

// export const api = treaty(app)
export type App = typeof app
