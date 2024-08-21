import Elysia from "elysia";
import { authModel } from "../../model/auth";
import { jwtToken, } from "../../plugin/jetToken";

export const JwtToken = new Elysia()
	.use(authModel)
	.use(jwtToken)
