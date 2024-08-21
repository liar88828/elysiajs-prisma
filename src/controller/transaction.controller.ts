import Elysia from "elysia"
import { modelTransaction } from "../model/transaction"
import { TransactionService } from "../service/transactions"

export const transactionController = new Elysia({
  name: "transactionController",
  prefix: "/transaction",
})
  .use(modelTransaction)
  .decorate({ serviceTransaction: new TransactionService() })
  .get("/", async ({ serviceTransaction }) => {
    return serviceTransaction.find()
  })
  .get(
    "/:idTransaction",
    async ({ serviceTransaction, params }) => {
      return serviceTransaction.findOne(params)
    },
    { params: "transaction.id" }
  )
  .post(
    "/checkout",
    async ({ serviceTransaction, body }) => {
      return serviceTransaction.checkout(body)
    },
    {
      body: "transaction.base",
    }
  )
  .put(
    "/update/:idTransaction",
    async ({ serviceTransaction, params, body }) => {
      return serviceTransaction.updateStatus(params, body)
    },
    { body: "transaction.status", params: "transaction.id" }
  )
