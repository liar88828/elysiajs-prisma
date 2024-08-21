import { NotFoundError } from "elysia";
import { prisma } from "../../config/db";
import type { PostCreate } from "../../model/post.model";


export class PostUser {
  async findUser(idUser: number) {
    return prisma.postDB.findMany({
      where: { userId: idUser },
      take: 100,
    });
  }

  async findIdUser(id: number, userId: number) {
    const res = await prisma.postDB.findUnique({ where: { id, userId } });
    if (!res) {
      throw new NotFoundError("Post does not exist");
    }
    return res;
  }

  async createUser(data: PostCreate, idUser: number) {
    return prisma.postDB.create({
      data: {
        msg: data.msg,
        title: data.title,
        userId: idUser,
      },
    });
  }
  async updateUser(data: PostCreate, id: number, userId: number) {
    return prisma.postDB.update({
      where: { id },
      data: {
        msg: data.msg,
        title: data.title,
        userId,
      },
    });
  }
  async deleteUser(id: number, userId: number) {
    return prisma.postDB.delete({
      where: { id, userId },
    });
  }
}
