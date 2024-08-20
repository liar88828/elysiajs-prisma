import Elysia, { t } from "elysia";
import jwt from "@elysiajs/jwt";

export const jwtToken = new Elysia({ name: 'Plugin.JwtToken' })
	.use(
		jwt({
			name: "accessToken",
			secret: Bun.env.ACCESS_TOKEN || "access_token",
			exp: '20m',
			schema: t.Object({
				id: t.Number(),
				email: t.String(),
				name: t.String(),
			})
		})
	)
	.use(jwt({
		name: "refreshToken",
		secret: Bun.env.REFRESH_TOKEN || "refresh_token",
		exp: '7d',
		schema: t.Object({
			id: t.String(),
			email: t.String(),
			name: t.String(),
		})
	}
	))
	.model({
		'auth.jwt_token': t.Cookie({
			refresh_token: t.Optional(t.String()),
			access_token: t.Optional(t.String())

		})
	})

