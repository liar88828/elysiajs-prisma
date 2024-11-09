// test/index.test.ts
import { afterAll, beforeAll, describe, expect, it } from "bun:test"
import { app } from "../../../src"
import API from "../../utils/myApi"
import { registerSetup } from "../../utils/registerSetup"
import { prisma } from "../../../src/config/db"
import { idProduct, SKIP } from "../../utils/idProduct"

let token: string = ""
const api = new API("product/user/like")
let idProduct: number
describe.skipIf(SKIP)("can test product Like controller", async () => {
  beforeAll(async () => {
    const response = await registerSetup()
    token = response.accessToken

    const user = await prisma.userDB.findFirst()
    const product = await prisma.productDB.create({
      data: {
        name: "test product",
        price: 10,
        qty: 10,
        exp: new Date(),
        userId: user?.id,
      },
    })
    idProduct = product.id
    console.log(product)
  })

  afterAll(async () => {
    console.log("done with test. test")
    await prisma.productDB.deleteMany()
    await prisma.userDB.deleteMany()
  })
  describe("can test product Like controller", async () => {
    it("can test product GET Like ", async () => {
      console.log(`get id : ${idProduct}`)

      const response = await app
        .handle(api.GET("", token))
        .then((res) => res.json())
      expect(response).toBeObject()
      expect(response).toContainKey("data")
    })

    it("can test product PUT Like ", async () => {
      const response = await app
        .handle(api.PUT(idProduct, {}, token))
        .then((res) => res.text()) // is text
      expect(response).toBeString()
      expect(response).toBe("Method not implemented. from elysia")
    })

    it("can test product DELETE Like ", async () => {
      const response = await app
        .handle(api.DELETE(idProduct, token))
        .then((res) => res.text()) // is text
      expect(response).toBeString()
      expect(response).toBe("Method not implemented. from elysia")
    })
  })
})
