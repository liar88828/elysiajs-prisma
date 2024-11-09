import { error, NotFoundError } from "elysia"
import type { UserToken } from "../../interface/token.type"
import { prisma } from "../../config/db"
import type {
  PostId,
  PostProduct,
  PostProductParam,
} from "../../model/post.model"

export class ProductPostService {
  async find(param: PostProductParam) {
    return prisma.postDB.findMany({
      where: { productDBId: param.idProduct },
      take: 100,
    })
  }
  async findId(param: PostProductParam) {
    const res = await prisma.postDB.findUnique({
      where: { id: param.idPost, productDBId: param.idProduct },
    })
    if (!res) {
      throw new NotFoundError("Data Post does not exist")
    }
    return res
  }
  async comment(
    param: PostProductParam,
    payload: UserToken,
    data: PostProduct
  ) {
    return prisma.postDB.create({
      data: {
        userId: payload.id,
        productDBId: param.idProduct,
        msg: data.msg,
        title: data.title,
        rating: data.rating,
      },
    })
  }

  async commentUpdate(
    param: PostProductParam,
    payload: UserToken,
    data: PostProduct
  ) {
    return prisma.postDB.update({
      where: {
        id: param.idPost,
        productDBId: param.idProduct,
        userId: payload.id,
      },
      data: {
        msg: data.msg,
        title: data.title,
        rating: data.rating,
      },
    })
  }

  async commentDelete(param: PostProductParam, payload: UserToken) {
    const res = await prisma.postDB.delete({
      where: {
        id: param.idPost,
        productDBId: param.idProduct,
        userId: payload.id,
      },
    })
    if (!res) {
      throw error("Not Implemented", "Method not implemented : commentDelete")
    }
    return res
  }
}
