import { Elysia } from "elysia";

export const myError = (app: Elysia) => app
	.onError(({ code, }) => {
			//@ts-expect-error
			if ("P2025" === code) {
				return "Data is Not Found"
			}
		}
	)