import { Elysia, Static, t } from "elysia";

const registerUser = t.Object({
	name: t.String(),
	age: t.Number(),
	address: t.String(),
	email: t.String({ format: "email" }),
	password: t.String({ minLength: 8 }),
	confPass: t.String(),
});

const loginModel = t.Object({
	email: t.String(),
	password: t.String(),
});

export const authModel = new Elysia(
	{ name: 'Model.auth' })
	.model({ "auth.login": loginModel })
	.model({ "auth.register": registerUser })

export type LoginModel = Static<typeof loginModel>
export type RegisterModel = Static<typeof registerUser>
