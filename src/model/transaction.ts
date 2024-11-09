import { Elysia, t, Static } from "elysia"
import { Status } from "../interface/Status"
import { main } from "bun"

const statusModule = t.Object({
  status: t.Enum(Status),
  description: t.String(),
})

const transactionCreate = t.Object({
  qty: t.Number({ minimum: 1 }),
  total: t.Number({ minimum: 1 }),
  userId: t.Number({ minimum: 1 }),
  productId: t.Number({ minimum: 1 }),
  status: t.Enum(Status),
  description: t.String({ minLength: 1 }),
  id: t.Optional(t.Number({ minimum: 1 })),
})
const TransactionId = t.Object({ idTransaction: t.Number() })

export type StatusModel = Static<typeof statusModule>
export type TransactionCreate = Static<typeof transactionCreate>
export type TransactionId = Static<typeof TransactionId>

export const modelTransaction = new Elysia({ name: "Model.Transaction" })
  .model({ "transaction.base": transactionCreate })
  .model({ "transaction.id": TransactionId })
  .model({ "transaction.status": statusModule })
