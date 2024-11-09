import { Elysia, Static, t, } from "elysia"

export const createUser = t.Object({
	name: t.String(),
	age: t.Number(),
	address: t.String(),
	id: t.Number(),
	email: t.String(),
	password: t.String(),
	refreshTokens: t.String(),
});
const updateUser = t.Object({
	name: t.String(),
	age: t.Number(),
	address: t.String(),
	id: t.Number(),
	email: t.String(),
	password: t.String(),
	refreshTokens: t.Optional(t.String()),
});
export const userModel = new Elysia({ name: "Model.User" })
	.model({
		"user.create": createUser,
		"user.update": updateUser,
	})
	.model("user.id", t.Object({ id: t.Number() }))

export type TUserCreate = Static<typeof createUser>
export type TUserUpdate = Static<typeof updateUser>