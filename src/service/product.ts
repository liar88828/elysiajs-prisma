import { prisma } from "../config/db"
import { ProductPrisma } from "../interface/product.type"

export class ProductService {
	async find() {
		return prisma.product.findMany({ take: 100 })
	}

	async findId(id: number) {
		const res = await prisma.product.findUnique({ where: { id } })
		if (!res) {
			throw new Error(`product ${id} not found`)
		}
		return res
	}

	async create({ id, ...data }: ProductPrisma<"create">) {
		return prisma.product.create({
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
		const res = await prisma.product.update({
			where: { id },
			data: {
				exp: data.exp,
				name: data.name,
				price: data.price,
				qty: data.qty,
			},
		})
		if (!res) {
			throw new Error(`product ${id} not found`)
		}
		return res
	}

	async delete(id: number) {
		return prisma.product.delete({
			where: { id },
		})
	}
}

