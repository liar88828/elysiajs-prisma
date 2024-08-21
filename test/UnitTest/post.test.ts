// test/index.test.ts
import { afterAll, beforeAll, describe, expect, it } from "bun:test"
import { prisma } from "../../src/config/db"
import API from "../utils/myApi"
import { treaty } from "@elysiajs/eden"
import { app, type App } from "../../src"
import { registerSetup } from "../utils/registerSetup"
import type { PostDB } from "@prisma/client"
import { SKIP } from "../utils/idProduct"

let token: string = ""
const api = new API("post")
describe.skipIf(SKIP)("can test post controller", async () => {
  beforeAll(async () => {
    const response = await registerSetup()
    token = response.accessToken
  })

  afterAll(async () => {
    console.log("done with test.")
    await prisma.userDB.deleteMany()
    await prisma.postDB.deleteMany()
  })

  describe("can post data to controller", () => {
    it("can create post Data  ", async () => {
      const data: Partial<PostDB> = {
        msg: "test post",
        title: "test post",
      }
      const response = await app
        .handle(api.POST(data, token))
        .then((res) => res.json())
      // console.log(token);
      // console.log(response);
      expect(response).toBeObject()
      expect(response).toContainKey("msg")
      expect(response).toContainKey("title")
      expect(response).toContainKey("userId")
      expect(response).toContainKey("rating")
      expect(response).toContainKey("productDBId")
      // const test = {
      //   msg: "test post",
      //   title: "test post",
      //   id: expect.any(Number),
      //   userId: expect.any(Number),
      //   rating: expect.any(Number),
      //   productDBId: expect.any(Number),
      // }
      // expect(response).toEqual(test)
    })
  })
})
