import Elysia, { t } from "elysia";
import { JwtToken } from "../middleware/auth/JwtToken";
import { randomUUID } from "crypto";
import { cookie } from '@elysiajs/cookie';
import { AuthService } from "../service/auth.service";
import { TokenService } from "../service/token.service";

export const authController = new Elysia(
	{
		name: "Controller.Auth",
		prefix: "/auth"
	},
)
	.use(JwtToken)
	.use(cookie())
	.decorate({
		'authService': new AuthService(),
		'tokenService': new TokenService()
	})
	.get('/test', () => 'hello from auth')
	.post(
		'/register', async ({
			cookie: { access_token, refresh_token },
			refreshToken, accessToken, authService, body, tokenService }) => {
		authService.confPass(body)
		await authService.userNotExist(body)
		const hashPassword = await tokenService.hashPassword(body.password)

		const myRefreshToken = await refreshToken.sign({
			id: randomUUID(),
			email: body.email,
			name: body.name,
		})

		const hashedToken = await tokenService.hashToken(myRefreshToken)
		const newUser = await authService.registerUser(body, hashedToken, hashPassword)

		const myAccessToken = await accessToken.sign({
			id: newUser.id,
			email: body.email,
			name: body.name,
		})

		refresh_token.set({
			value: myRefreshToken,
			httpOnly: true,
			maxAge: 7 * 24 * 60 * 60 * 1000
		})
		
		access_token.set({
			value: myAccessToken,
			httpOnly: true,
			maxAge: 7 * 24 * 60 * 60 * 1000
		})
		body.password = ''
		return { accessToken: myAccessToken }
	},
		{
			body: "auth.register",
			cookie: 'auth.jwt_token'
		})

	.post('/login',
		async ({ tokenService, refreshToken, accessToken, authService, body, cookie: { refresh_token } }) => {
			const userDB = await authService.loginUser(body.email, body.password)
			await tokenService.comparePassword(body.password, userDB.password)

			// set refresh token
			const myRefreshToken = await refreshToken.sign(
				{
					id: randomUUID(),
					email: userDB.email,
					name: userDB.name,
				})
			const hashedToken = await tokenService.hashToken(myRefreshToken)
			await authService.createTokenDB(userDB.id, hashedToken,)
			refresh_token.set({
				value: myRefreshToken,
				httpOnly: true,
				maxAge: 7 * 24 * 60 * 60 * 1000
			})

			// set access token
			const myAccessToken = await accessToken.sign({
				id: userDB.id,
				email: userDB.email,
				name: userDB.name,
			})
			return { accessToken: myAccessToken }
		},
		{
			body: 'auth.login',
			cookie: 'auth.jwt_token'
		})

	.post('/refresh', async ({ tokenService, refreshToken, accessToken, authService, cookie: { refresh_token } }) => {
		console.log(`test refresh this token :  ${refresh_token.value}`)
		const oldRefreshToken = refresh_token.value
		if (!oldRefreshToken) {
			throw new Error('token is empty')

		}
		console.log(oldRefreshToken)
		const payload = await refreshToken.verify(oldRefreshToken)
		if (!payload) {
			throw new Error('token is not valid')
		}
		// find token from database fon compare form user must be same

		await authService.compareRefreshToken(payload.email, oldRefreshToken,)

		// set refresh token
		const newRefreshToken = await refreshToken.sign(
			{
				id: randomUUID(),
				email: payload.email,
				name: payload.name,
			})
		const hashedToken = await tokenService.hashToken(newRefreshToken)
		const userDb = await authService.updateRefreshToken(payload.email, hashedToken)
		refresh_token.set({
			value: newRefreshToken,
			httpOnly: true,
			maxAge: 7 * 24 * 60 * 60 * 1000
		})

		// set access token
		const newAccessToken = await accessToken.sign({
			id: userDb.id,
			email: userDb.email,
			name: userDb.name,
		})
		return { accessToken: newAccessToken }
	},
		{
			cookie: 'auth.jwt_token',
			beforeHandle({ cookie: { refresh_token }, set }) {
				if (!refresh_token) {
					set.status = 401
					return { message: "Unauthorized" }
				}
			},
		}
	)
	.delete('/logout', async ({ cookie }) => {
		cookie.refresh_token.remove()
		return "see you again"
	}, {
		cookie: 'auth.jwt_token'
	})

	.get('/otp/:id', async ({ authService, params: { id } }) => {
		const otp = await authService.sendOtp(id)
		return { data: otp }
	},
		{
			params: t.Object({ id: t.Number() }),
		}
	)
	.post('/otp/:id', async ({ body: { otp }, params: { id }, authService }) => {
		return authService.validOtp(id, otp)
	},
		{
			params: t.Object({ id: t.Number() }),
			body: t.Object({ otp: t.Number() })
		}
	)