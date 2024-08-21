import { prisma } from "../../config/db"
import { NotFoundError } from "elysia"
import { PostUser } from "./PostUser"

export class PostService extends PostUser {
  async findAll() {
    return prisma.postDB.findMany({ take: 100 })
  }

  async findId(id: number) {
    const res = await prisma.postDB.findUnique({ where: { id } })
    if (!res) {
      throw new NotFoundError("Post does not exist")
    }
    return res
  }
}
