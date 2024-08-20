import { Elysia } from "elysia";
import { accessToken } from "./plugin/jetToken";
import { prisma } from "../config/db";

export const AuthMiddleware = (app: Elysia) => app
	.use(accessToken)
	.derive(
		async function handler({ accessToken, cookie, set, request: { headers }, }) {
			
			// console.log(headers)
			// console.log(cookie);
			
			const authorization = headers.get("Authorization");
			if (!authorization) {
				set.status = 401
				throw new Error('Unauthorized header is empty');
			}
			
			const token = authorization.split(" ")[1];
			if (token.length < 10) {
				set.status = 401
				throw new Error('Unauthorized Wrong replacement token')
			}
			
			const payload = await accessToken.verify(token)
			if (!payload) {
				set.status = 401
				throw new Error('Unauthorized access token is invalid')
			}
			
			const userDB = await prisma.userDB.findUnique({ where: { id: payload.id } })
			
			if (!userDB) {
				set.status = 401
				throw new Error('Unauthorized User is not found')
			}
			
			return { userToken: userDB }
		}
	)
