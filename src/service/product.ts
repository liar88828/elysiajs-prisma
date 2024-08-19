import { prisma } from "../config/db"
import { ProductPrisma } from "../interface/product.type"

export class ProductService {
	async find() {
		return prisma.productDB.findMany({ take: 100 })
	}
	
	async findId(id: number) {
		const res = await prisma.productDB.findUnique({ where: { id } })
		if (!res) {
			throw new Error(`product ${ id } not found`)
		}
		return res
	}
	
	async create({ id, ...data }: ProductPrisma<"create">) {
		return prisma.productDB.create({
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
		const res = await prisma.productDB.update({
			where: { id },
			data: {
				exp: data.exp,
				name: data.name,
				price: data.price,
				qty: data.qty,
			},
		})
		if (!res) {
			throw new Error(`product ${ id } not found`)
		}
		return res
	}
	
	async delete(id: number) {
		return prisma.productDB.delete({
			where: { id },
		})
	}
}

