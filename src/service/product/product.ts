import type { PostDB } from "@prisma/client"
import { prisma } from "../../config/db"
import type { UserToken } from "../../interface/token.type"
import type { ProductBase, ProductId } from "../../model/product"
import { NotFoundError } from "elysia"

export class ProductService {
  async find() {
    return prisma.productDB.findMany({ take: 100 })
  }

  async findId({ idProduct }: ProductId) {
    const res = await prisma.productDB.findUnique({ where: { id: idProduct } })
    if (!res) {
      throw new Error(`product ${idProduct} not found`)
    }
    return res
  }

  async create({ id, ...data }: ProductBase, token: UserToken) {
    return prisma.productDB.create({
      data: {
        exp: data.exp,
        name: data.name,
        price: data.price,
        qty: data.qty,
        userId: token.id,
        ...(id ? { id } : {}),
      },
    })
  }

  async update({ idProduct }: ProductId, data: ProductBase) {
    const res = await prisma.productDB.update({
      where: { id: idProduct },
      data: {
        exp: data.exp,
        name: data.name,
        price: data.price,
        qty: data.qty,
      },
    })
    if (!res) {
      throw new Error(`product ${idProduct} not found`)
    }
    return res
  }

  async delete({ idProduct }: ProductId) {
    const res = await prisma.productDB.delete({
      where: { id: idProduct },
    })
    if (!res) {
      throw new NotFoundError("product ${ id } not found")
    }
    return res
  }
}
