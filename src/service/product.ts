import { prisma } from "../config/db";
import { UserToken } from "../interface/token.type";
import { TProductBase } from "../model/product";
import { NotFoundError } from "elysia";

export class ProductService {
  async find() {
    return prisma.productDB.findMany({ take: 100 });
  }

  async findId(id: number) {
    const res = await prisma.productDB.findUnique({ where: { id } });
    if (!res) {
      throw new Error(`product ${id} not found`);
    }
    return res;
  }

  async create({ id, ...data }: TProductBase, token: UserToken) {
    return prisma.productDB.create({
      data: {
        exp: data.exp,
        name: data.name,
        price: data.price,
        qty: data.qty,
        userId: token.id,
        ...(id ? { id } : {}),
      },
    });
  }

  async update(id: number, data: TProductBase) {
    const res = await prisma.productDB.update({
      where: { id },
      data: {
        exp: data.exp,
        name: data.name,
        price: data.price,
        qty: data.qty,
      },
    });
    if (!res) {
      throw new Error(`product ${id} not found`);
    }
    return res;
  }

  async delete(id: number) {
    const res = await prisma.productDB.delete({
      where: { id },
    });
    if (!res) {
      throw new NotFoundError("product ${ id } not found");
    }
    return res;
  }
}
