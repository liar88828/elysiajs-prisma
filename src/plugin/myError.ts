import { Elysia } from "elysia"

export const myError = (app: Elysia) =>
  app.onError(({ code }) => {
    //@ts-expect-error
    if ("P2025" === code) {
      return "Data is Not Found"
    }
    //@ts-expect-error
    if ("P2002" === code) {
      return "Unique constraint failed on the {constraint}"
    }
  })
