import type { JWTPayloadSpec } from "@elysiajs/jwt"

export type TokenPayload = {
  name: string
  id: string
  email: string
}
export type UserToken = {
  id: number
  name: string
  email: string
} & JWTPayloadSpec
