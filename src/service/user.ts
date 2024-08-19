import { User } from "@prisma/client"
import { prisma } from "../config/db"
import { NotFoundError } from "elysia"

export interface UserService {
}

export class UserServiceImpl implements UserService {

  async find() {
    return prisma.user.findMany({ take: 100 })
  }
  async findId(id: number) {
    const found = await prisma.user.findUnique({
      where: { id },
    })
    if (!found) {
      throw new NotFoundError(`user ${id} not found`,)
    }
    return found
  }

  async create(data: Omit<User, "id">) {
    return prisma.user.create({
      data: {
        address: data.address,
        age: data.age,
        name: data.name,
      },
    })
  }
  async update(id: number, data: Omit<User, "id">) {
    return prisma.user.update({
      where: { id },
      data: {
        address: data.address,
        age: data.age,
        name: data.name,
      },
    })
  }

  async delete(id: number) {
    return prisma.user.delete({
      where: { id },
    })
  }
}
