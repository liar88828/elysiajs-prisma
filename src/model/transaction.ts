import { Elysia, t } from "elysia";

export const modelTransaction = new Elysia({ name: "Model.Transaction" })
  .model({
    "transaction.base": t.Object({
      qty: t.Number(),
      total: t.Number(),
      userId: t.Number(),
      productId: t.Number(),
    })
  })
  .model({
    "transaction.id": t.Object({
      id: t.Number()
    })
  })