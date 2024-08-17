import { Prisma, Product } from "@prisma/client"
import { prisma } from "../config/db"
import { CreateEden } from "elysia"

export class ProductService {
  async find() {
    return prisma.product.findMany({ take: 100 })
  }
  async findId(id: number) {
    return prisma.product.findUnique({ where: { id } })
  }
  async create(data: ProductPrisma<"create">) {
    const { id } = data
    return prisma.product.create({
      data: {
        exp: data.exp,
        name: data.name,
        price: data.price,
        qty: data.qty,
        ...(id ? { id } : {}),
      },
    })
  }
  async update(id: number, data: ProductPrisma<"update">) {
    return prisma.product.update({
      where: { id },
      data: {
        exp: data.exp,
        name: data.name,
        price: data.price,
        qty: data.qty,
      },
    })
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
