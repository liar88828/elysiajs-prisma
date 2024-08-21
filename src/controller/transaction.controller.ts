import Elysia from "elysia";
import { modelTransaction } from "../model/transaction";
import { TransactionService } from "../service/transactions";

export const transactionController = new Elysia({
	name: "transactionController",
	prefix: "/transaction"
})
	.use(modelTransaction)
	.decorate(
		{ "serviceTransaction": new TransactionService() }
	).get("/", async ({ serviceTransaction }) => {
		return serviceTransaction.find();
	})
	.get("/:id", async ({ serviceTransaction, params: { id } }) => {
			return serviceTransaction.findOne(id);
		},
		{ params: "transaction.id" })
	.post(
		'/checkout', async ({ serviceTransaction, body }) => {
			return serviceTransaction.checkout(body)
		}, {
			body: "transaction.base"
		}
	)