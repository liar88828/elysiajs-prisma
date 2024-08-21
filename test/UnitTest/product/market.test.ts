// test/index.test.ts
import { afterAll, beforeAll, describe, expect, it } from "bun:test"
import { app } from "../../../src"
import API from "../../utils/myApi"
import { registerSetup } from "../../utils/registerSetup"
import { prisma } from "../../../src/config/db"
import { SKIP } from "../../utils/idProduct"

let token: string = ""
const api = new API("product/market")

describe.skipIf(SKIP)("can test product Market controller", async () => {
  beforeAll(async () => {
    const response = await registerSetup()
    token = response.accessToken

    const user = await prisma.userDB.findFirst()
    await prisma.productDB.create({
      data: {
        name: "test product",
        price: 10,
        qty: 10,
        exp: new Date(),
        userId: user?.id,
      },
    })
  })

  afterAll(async () => {
    console.log("done with test. test")
    await prisma.productDB.deleteMany()
    await prisma.userDB.deleteMany()
  })

  it("can test product Market GET Like ", async () => {
    const response = await app
      .handle(api.GET("/423", token))
      .then((res) => res.text())
    console.log(`test market : ${response}`)
    expect(response).toBeString()
  })
})
