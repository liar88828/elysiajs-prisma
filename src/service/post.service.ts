import { prisma } from "../config/db";
import { PostCreate } from "../model/post.model";
import { NotFoundError } from "elysia";

class PostUser {
	async findMy(idUser: number) {
		return prisma.postDB.findMany({
			where: { userId: idUser },
			take: 100
		})
	}
	
	async findIdByUser(id: number, userId: number) {
		const res = await prisma.postDB.findUnique({ where: { id, userId } })
		if (!res) {
			throw new NotFoundError('Post does not exist')
		}
		return res
	}
	
	async create(data: PostCreate, idUser: number) {
		return prisma.postDB.create({
			data: {
				msg: data.msg,
				title: data.title,
				userId: idUser
			}
		})
	}
}

export class PostService extends PostUser {
	
	async findAll() {
		return prisma.postDB.findMany({ take: 100 })
	}
	
	async findId(id: number,) {
		const res = await prisma.postDB.findUnique({ where: { id } })
		if (!res) {
			throw new NotFoundError('Post does not exist')
		}
		return res
	}
	
}