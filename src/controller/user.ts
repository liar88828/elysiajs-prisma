import { Elysia, ParseError } from "elysia"
import { UserServiceImpl } from "../service/user"
import { userModel } from "../model/user"

export const userController = new Elysia({
	name: "userController",
	prefix: "/user",
})
	.use(userModel)
	.decorate({
		serviceUser: new UserServiceImpl(),
		valid: {
			checkId(id: number): number {
				if (id === 0) {
					throw new ParseError()
				} else {
					return id
				}
			},
		},
	})
	
	.get("/", async ({ serviceUser }) => {
		return serviceUser.find()
	})
	.get(
		"/:id",
		async ({ serviceUser, valid, params: { id } }) => {
			// valid.checkId(id)
			console.log(`test ${ id }`)
			return serviceUser.findId(id)
		},
		{ params: "user.id" }
	)
	.post(
		"/",
		async ({ serviceUser, body }) => {
			return serviceUser.create(body)
		},
		{ body: "user.base" }
	)
	.put(
		"/:id",
		({ serviceUser, params: { id }, body }) => {
			return serviceUser.update(id, body)
		},
		{
			params: "user.id",
			body: "user.base",
		}
	)
	.delete(
		"/:id",
		({ serviceUser, params: { id } }) => {
			return serviceUser.delete(id)
		},
		{ params: "user.id" }
	)
