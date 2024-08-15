import { Elysia, ParseError } from "elysia"
import { UserService, UserServiceImpl } from "../service/user"
import { userModel } from "../model/user"

export const userController = new Elysia({
  name: "userController",
  prefix: "/user",
})
  .use(userModel)
  .decorate({
    service: new UserServiceImpl(),
    valid: {
      checkId(id: number): number {
        if (id === 0) {
          throw new ParseError()
        } else {
          return id
        }
      },
    },
  })
  .get("/test", async ({ service }: { service: UserService }) => {
    return service.test()
  })
  .get("/", async ({ service }) => {
    return service.find()
  })
  .get(
    "/:id",
    async ({ service, valid, params: { id } }) => {
      // valid.checkId(id)
      console.log(`test ${id}`)
      return service.findId(id)
    },
    { params: "user.id" }
  )
  .post(
    "/",
    async ({ service, body }) => {
      return service.create(body)
    },
    { body: "user.base" }
  )
  .put(
    "/:id",
    ({ service, params: { id }, body }) => {
      return service.update(id, body)
    },
    {
      params: "user.id",
      body: "user.base",
    }
  )
  .delete(
    "/:id",
    ({ service, params: { id } }) => {
      return service.delete(id)
    },
    { params: "user.id" }
  )
