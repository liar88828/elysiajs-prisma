import Elysia from "elysia";
import { authModel } from "../../model/auth";
import { accessToken, refreshToken } from "../plugin/jetToken";

export const JwtToken = new Elysia()
	.use(authModel)
	.use(accessToken)
	.use(refreshToken)
 