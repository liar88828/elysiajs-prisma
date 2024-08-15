import { Elysia } from "elysia"
import { userController } from "./controller/user"

const app = new Elysia()
  .use(userController)
  .get("/", () => "Hello Elysia")
  .listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)

// export const api = treaty(app)
export type App = typeof app
