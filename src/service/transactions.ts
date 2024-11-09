import { prisma } from "../config/db"
import { NotFoundError } from "elysia"
import { Status } from "../interface/Status"
import { TCheckout } from "../interface/transaction.type"
import type {
  StatusModel,
  TransactionCreate,
  TransactionId,
} from "../model/transaction"

export class TransactionService {
  async find() {
    return prisma.transactionDB.findMany()
  }

  async findOne({ idTransaction }: TransactionId) {
    const res = await prisma.transactionDB.findUnique({
      where: { id: idTransaction },
    })
    if (!res) {
      throw new NotFoundError(`Transaction not found ${idTransaction}`)
    }
    return res
  }

  async checkout({ id, ...data }: TransactionCreate) {
    return prisma.transactionDB.create({
      data: {
        qty: data.qty,
        total: data.total,
        userId: data.userId,
        productId: data.productId,
        description: data.description,
        statusId: data.status ?? Status.PENDING,
        ...(id ? { id } : {}),
      },
    })
  }

  async updateStatus(
    { idTransaction }: TransactionId,
    { status, description }: StatusModel
  ) {
    return prisma.$transaction(async (tx) => {
      const statusDB = await tx.statusDB.upsert({
        where: { id: status },
        create: { id: status },
        update: { id: status },
      })
      if (!statusDB) {
        throw new NotFoundError(`Server is busy ${status}`)
      }
      const res = await tx.transactionDB.update({
        where: { id: idTransaction },
        data: { statusId: status, description },
      })
      return res
    })
  }
}
