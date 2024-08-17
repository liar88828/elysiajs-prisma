import { Elysia } from "elysia"
import { userController } from "./controller/user"
import { productController } from "./controller/product"

const app = new Elysia()
  .get("/hello", () => "Hello Elysia")
  .group("/api", app =>
    app
      .use(userController)
      .use(productController)
  )
  .listen(3000)
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)

// export const api = treaty(app)
export type App = typeof app
