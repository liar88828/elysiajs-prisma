import { prisma } from "../config/db"
import { NotFoundError } from "elysia"
import { TUserCreate, TUserUpdate } from "../model/user";

export interface UserService {
}

export class UserServiceImpl implements UserService {
	
	async find() {
		return prisma.userDB.findMany({ take: 100 })
	}
	
	async findId(id: number) {
		const found = await prisma.userDB.findUnique({
			where: { id },
		})
		if (!found) {
			throw new NotFoundError(`user ${ id } not found`,)
		}
		return found
	}
	
	async create(data: TUserCreate) {
		return prisma.userDB.create({
			data: {
				address: data.address,
				age: data.age,
				name: data.name,
				password: data.password,
				refreshTokens: data.refreshTokens,
				email: data.email
			},
		})
	}
	
	async update(id: number, { email, refreshTokens, password, age, name, address }: TUserUpdate) {
		return prisma.userDB.update({
			where: { id },
			data: {
				...(email ? { email } : {}),
				...(refreshTokens ? { refreshTokens } : {}),
				...(password ? { password } : {}),
				...(name ? { name } : {}),
				...(address ? { address } : {}),
				...(age ? { age } : {}),
			},
		})
	}
	
	async delete(id: number) {
		return prisma.userDB.delete({
			where: { id },
		})
	}
}
