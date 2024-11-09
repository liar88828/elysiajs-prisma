import { ProductDB } from "@prisma/client";
import { ProductBase } from "../model/product";

export type TProduct = Omit<ProductDB, 'id'> & {
	id?: number;
}

// const test: TProduct = {
// 	id: 1 ? undefined : 0,
// 	userId: 1 ? null : 0,
// 	name: "Product Test",
// 	qty: 123,
// 	price: 1234,
// 	exp: new Date()
// }

const test2: ProductBase = {
	id: 1 ? undefined : 0,
	userId: 1 ? undefined : 0,
	name: "Product Test",
	qty: 123,
	price: 1234,
	exp: new Date()
}