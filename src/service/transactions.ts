import { prisma } from "../config/db";
import { NotFoundError } from "elysia";
import { Status } from "../interface/Status";
import { TYCheckout } from "../interface/transaction.type";

export class TransactionService {
	async find() {
		return prisma.transactionDB.findMany();
	}
	
	async findOne(id: number) {
		const res = await prisma.transactionDB.findUnique({ where: { id: id } });
		if (!res) {
			throw new NotFoundError(`Transaction not found ${ id }`)
		}
		return res
	}
	
	async checkout({ id, ...data }: TYCheckout) {
		return prisma.transactionDB.create({
			data: {
				qty: data.qty,
				total: data.total,
				userId: data.userId,
				productId: data.productId,
				statusId: data.status ?? Status.PENDING,
				...(id ? { id } : {}),
				
			}
		})
	}
}

