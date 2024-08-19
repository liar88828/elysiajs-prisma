import { prisma } from "../config/db"
import { NotFoundError } from "elysia"
import { UserDB } from "@prisma/client";

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
	
	async create(data: Omit<UserDB, "id">) {
		return prisma.userDB.create({
			data: {
				address: data.address,
				age: data.age,
				name: data.name,
			},
		})
	}
	
	async update(id: number, data: Omit<UserDB, "id">) {
		return prisma.userDB.update({
			where: { id },
			data: {
				address: data.address,
				age: data.age,
				name: data.name,
			},
		})
	}
	
	async delete(id: number) {
		return prisma.userDB.delete({
			where: { id },
		})
	}
}
