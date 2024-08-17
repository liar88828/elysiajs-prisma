import { Prisma, Product } from "@prisma/client"
import { prisma } from "../config/db"
import { CreateEden } from "elysia"

export class ProductService {
  async find() {
    console.log('hello')
    return prisma.product.findMany({ take: 100 })
  }
  async findId(id: number) {
    const res = await prisma.product.findUnique({ where: { id } })
    if (!res) {
      throw new Error(`product ${id} not found`)
    }
    return res
  }
  async create(data: ProductPrisma<"create">) {
    const { id } = data
    const res = await prisma.product.create({
      data: {
        exp: data.exp,
        name: data.name,
        price: data.price,
        qty: data.qty,
        ...(id ? { id } : {}),
      },
    })
    console.log(res)
    return res
  }
  async update(id: number, data: ProductPrisma<"update">) {
    const res = await prisma.product.update({
      where: { id },
      data: {
        exp: data.exp,
        name: data.name,
        price: data.price,
        qty: data.qty,
      },
    })
    if (!res) {
      throw new Error(`product ${id} not found`)
    }
    return res
  }

  async delete(id: number) {
    return prisma.product.delete({
      where: { id },
    })
  }
}

type ProductPrisma<T extends "create" | "update"> = Prisma.Args<
  typeof prisma.product,
  T
>["data"]
