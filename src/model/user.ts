import { Elysia, t } from "elysia"

export const userModel = new Elysia({ name: "Model.User" })
	.model({
		"user.base": t.Object({
			name: t.String(),
			age: t.Number(),
			address: t.String(),
			id: t.Number(),
		}),
	})
	.model("user.id", t.Object({ id: t.Number() }))
