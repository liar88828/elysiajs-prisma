import { Elysia, t } from "elysia"

export const userModel = new Elysia({ name: "Model.User" })
  .model({
    "user.full": t.Object({
      id: t.Number(),
      name: t.String(),
      age: t.Number(),
      address: t.String(),
    }),
  })
  .model({
    "user.base": t.Object({
      name: t.String(),
      age: t.Number(),
      address: t.String(),
    }),
  })
  .model("user.id", t.Object({ id: t.Number() }))
