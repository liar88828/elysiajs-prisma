import { User } from "@prisma/client"
import { prisma } from "../config/db"

export interface UserService {
  test(): string
}

export class UserServiceImpl implements UserService {
  test() {
    return "hello form service user"
  }

  async find() {
    return prisma.user.findMany({ take: 100 })
  }
  async findId(id: number) {
    return prisma.user.findUnique({
      where: { id },
    })
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
