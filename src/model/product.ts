import Elysia, { Static, t, } from "elysia";
import { Value, } from "@sinclair/typebox/value";

const productBase = t.Object({
	id: t.Optional(t.Number()),
	userId: t.Optional(t.Number()),
	name: t.String(),
	price: t.Number(),
	qty: t.Number(),
	exp: t.Date(),
});

export const modelProduct = new Elysia({ name: "Model.Product" })
	.model({
		"product.id": t.Object({ id: t.Number() }),
	})
	.model({
		"product.base": productBase,
	});

export type TProductBase = Static<typeof productBase>
const test = Value.Create(productBase,)