import { Elysia } from "elysia";
import { jwtToken } from "../plugin/jetToken";

export const AuthMiddleware = (app: Elysia) =>
  app
    .use(jwtToken)
    .derive(async function handler({
      accessToken,
      error,
      request: { headers },
    }) {
      // console.log(headers)
      // console.log(cookie);

      const authorization = headers.get("Authorization")
      if (!authorization) {
        throw error("Unauthorized", "Unauthorized header is empty")
      }

      const token = authorization.split(" ")[1]
      if (token.length < 10) {
        throw error("Unauthorized", "Unauthorized Wrong replacement token")
      }

      const payload = await accessToken.verify(token)
      if (!payload) {
        throw error("Unauthorized", "Unauthorized access token is invalid")
      }

      // const userDB = await prisma.userDB.findUnique({ where: { id: payload.id } })

      // if (!userDB) {
      // 	set.status = 401
      // 	throw new Error('Unauthorized User is not found')
      // }

      return { payload }
    })
