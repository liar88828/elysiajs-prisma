import { Prisma, ProductDB } from "@prisma/client";
import { prisma } from "../config/db";

export type ProductPrisma<T extends "create" | "update"> = Prisma.Args<
	typeof prisma.productDB, T
>["data"]


export type TProduct = Omit<ProductDB, 'id'> & {
	id?: number | undefined;
}