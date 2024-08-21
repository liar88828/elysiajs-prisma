// test/index.test.ts
import { afterAll, beforeAll, describe, expect, it } from "bun:test"
import { app } from "../../../src"
import API from "../../utils/myApi"
import { registerSetup } from "../../utils/registerSetup"
import { prisma } from "../../../src/config/db"
import type { PostProduct } from "../../../src/model/post.model"
import { idProduct, SKIP } from "../../utils/idProduct"

let token: string = ""
const api = new API("product/user/comment")

describe.skipIf(SKIP)("can test product User Comment controller", async () => {
  beforeAll(async () => {
    const response = await registerSetup()
    console.log(response)
    token = response.accessToken
    await prisma.$transaction(async (tx) => {
      const user = await tx.userDB.findFirst()
      const product = await tx.productDB.create({
        data: {
          name: "test product",
          price: 10,
          qty: 10,
          exp: new Date(),
          userId: user?.id,
          id: 10,
        },
      })
    })

    // const post = await prisma.postDB.create({
    //   data: {
    //     msg: "test comment",
    //     title: "test title",
    //     userId: user?.id,
    //     productDBId: product.id,
    //     rating: 5,
    //   },
    // })
  })

  afterAll(async () => {
    // const post = await prisma.postDB.findFirst()
    // const product = await prisma.productDB.findFirst()
    // if (!post || !product) {
    //   return "error bos "
    // }
    // const res = await prisma.postDB.findUnique({
    //   where: { id: post.id, productDBId: product.id },
    // })
    // console.log(`success : if found ${res}}`)
    // console.log("done with test. test")
    await prisma.productDB.deleteMany()
    await prisma.userDB.deleteMany()
    await prisma.postDB.deleteMany()
  })

  it("can test product GET Comment ", async () => {
    const response = await app
      .handle(api.GET("", token))
      .then((res) => res.text())

    console.log("test-----------")
    // console.log(token)
    console.log(response)
  })

  describe("can test product POST Comment ", async () => {
    it("can test product POST Comment ", async () => {
      const product = await prisma.productDB.findFirst()
      const dataTest: PostProduct = {
        msg: "test comment",
        rating: 5,
        title: "test title",
      }
      const dataExpect = {
        id: expect.any(Number),
        title: "test title",
        msg: "test comment",
        rating: 5,
        userId: expect.any(Number),
        productDBId: product?.id,
      }

      const response = await app
        .handle(api.POST(dataTest, token, "", "/10"))
        .then((res) => res.json())
      console.log(response)
      expect(response).toBeObject()
      expect(response).toContainKey("msg")
      expect(response).toEqual(dataExpect)
    })

    it("ERROR can't test product POST Comment because body is wrong ", async () => {
      const product = await prisma.productDB.findFirst()

      const dataTest: PostProduct = {
        msg: "",
        rating: 5,
        title: "",
      }
      const dataExpect = {
        id: expect.any(Number),
        title: "test title",
        msg: "test comment",
        rating: 5,
        userId: expect.any(Number),
        productDBId: product?.id,
      }
      const response = await app
        .handle(api.POST(dataTest, token, "", `/${product?.id}}`))
        .then((res) => res.json())
      console.log(response)
      expect(response).toBeObject()
      expect(response).not.toContainKey("msg")
      expect(response).not.toEqual(dataExpect)
    })
  })

  describe("can test product GET Comment ", async () => {
    it("can test product GET Comment ", async () => {
      const response = await app
        .handle(api.GET("", token))
        .then((res) => res.json())
      expect(response).toBeObject()
      expect(response).toContainKey("data")
    })

    it("can test product GET PRODUCT Comment ", async () => {
      const response = await app
        .handle(api.GET(10, token))
        .then((res) => res.json())
      expect(response).toBeArray()
    })

    it("can test product GET PRODUCT Comment ", async () => {
      const dataExpect = {
        id: expect.any(Number),
        title: "test title",
        msg: "test comment",
        rating: 5,
        userId: expect.any(Number),
        productDBId: 10,
      }
      const post = await prisma.postDB.findFirst()
      const id = idProduct(10, post?.id)
      const response = await app
        .handle(api.GET(id, token))
        .then((res) => res.json())
      expect(response).toBeObject()
      expect(response).toEqual(dataExpect)
    })
  })

  describe("can test product PUT Comment ", async () => {
    it("can test product PUT Comment ", async () => {
      const dataTest: PostProduct = {
        msg: "test comment update",
        rating: 5,
        title: "test title update",
      }

      const dataExpect = {
        id: expect.any(Number),
        title: "test title update",
        msg: "test comment update",
        rating: 5,
        userId: expect.any(Number),
        productDBId: 10,
      }

      const post = await prisma.postDB.findFirst()
      const id = idProduct(10, post?.id)
      const response = await app
        .handle(api.PUT(id, dataTest, token))
        .then((res) => res.json())
      expect(response).toBeObject()
      expect(response).toEqual(dataExpect)
    })

    it("Error can test product PUT Comment Wrong Input ", async () => {
      const dataTest = {
        msg: 3423,
        rating: "5",
        title: 5234,
      }

      const dataExpect = {
        id: expect.any(Number),
        title: "test title update",
        msg: "test comment update",
        rating: 5,
        userId: expect.any(Number),
        productDBId: 10,
      }

      const post = await prisma.postDB.findFirst()
      const id = idProduct(10, post?.id)
      const response = await app
        .handle(api.PUT(id, dataTest, token))
        .then((res) => res.json())
      expect(response).toBeObject()
      expect(response).not.toEqual(dataExpect)
    })

    it("Error can test product PUT Comment not complete ", async () => {
      const dataTest = {
        msg: "",
        rating: 5,
        title: "",
      }

      const dataExpect = {
        id: expect.any(Number),
        title: "test title update",
        msg: "test comment update",
        rating: 5,
        userId: expect.any(Number),
        productDBId: 10,
      }

      const post = await prisma.postDB.findFirst()
      const id = idProduct(10, post?.id)
      const response = await app
        .handle(api.PUT(id, dataTest, token))
        .then((res) => res.json())
      expect(response).toBeObject()
      expect(response).not.toEqual(dataExpect)
    })

    it("Error can test product PUT Comment id not found ", async () => {
      const dataTest = {
        msg: "",
        rating: 5,
        title: "",
      }

      const dataExpect = {
        id: expect.any(Number),
        title: "test title update",
        msg: "test comment update",
        rating: 5,
        userId: expect.any(Number),
        productDBId: 10,
      }

      const post = await prisma.postDB.findFirst()
      const id = idProduct("error", "error")
      const response = await app
        .handle(api.PUT(id, dataTest, token))
        .then((res) => res.json())
      expect(response).toBeObject()
      expect(response).not.toEqual(dataExpect)
    })
  })

  describe("can test product DELETE Comment ", async () => {
    it("can test product DELETE Comment ", async () => {
      const post = await prisma.postDB.findFirst()
      const id = idProduct(10, post?.id)
      const response = await app
        .handle(api.DELETE(id, token))
        .then((res) => res.json())

      const dataExpect = {
        id: expect.any(Number),
        title: "test title update",
        msg: "test comment update",
        rating: 5,
        userId: expect.any(Number),
        productDBId: 10,
      }

      expect(response).toBeObject()
      expect(response).toEqual(dataExpect)
    })

    it("Error can test product DELETE Comment id not found ", async () => {
      const post = await prisma.postDB.findFirst()
      const id = idProduct(10, post?.id)
      const response = await app
        .handle(api.DELETE(id, token))
        .then((res) => res.json())

      const dataExpect = {
        id: expect.any(Number),
        title: "test title update",
        msg: "test comment update",
        rating: 5,
        userId: expect.any(Number),
        productDBId: 10,
      }

      expect(response).toBeObject()
      expect(response).not.toEqual(dataExpect)
    })
  })
})
