import Elysia, { t } from "elysia";
import jwt from "@elysiajs/jwt";

export const accessToken = new Elysia({ name: 'Plugin.accessToken' })
	.use(
		jwt({
			name: "accessToken",
			secret: Bun.env.ACCESS_TOKEN || "access_token",
			exp: '5m',
			schema: t.Object({
				id: t.Number(),
				email: t.String(),
				name: t.String(),
			})
		})
	)
	.model({
		'auth.refreshToken': t.Cookie({
			refresh_token: t.Optional(t.String())
		})
	})
export const refreshToken = new Elysia({ name: 'Plugin.refreshToken' })
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
		'auth.accessToken': t.Cookie({
			access_token: t.Optional(t.String())
		})
	})