// test/index.test.ts
import { afterAll, beforeAll, describe, expect, it } from "bun:test"
import type { ProductDB } from "@prisma/client"
import { app } from "../../../src"
import API from "../../utils/myApi"
import { prisma } from "../../../src/config/db"
import { registerSetup } from "../../utils/registerSetup"
import { idProduct } from "../../utils/idProduct"

let token: string = ""
const api = new API("product")

describe("can test product controller", async () => {
  beforeAll(async () => {
    const response = await registerSetup()
    token = response.accessToken
  })
  afterAll(async () => {
    console.log("done with test.")
    await prisma.productDB.deleteMany()
    await prisma.userDB.deleteMany()
  })

  it("can get TEST Product", async () => {
    const response = await app
      .handle(api.GET("user/test", token))
      .then((res) => res.text())
    // console.log(response)
    expect(response).toBe("user api success")
  })

  describe("can test product POST controller", async () => {
    it("can create Product ", async () => {
      const data: Partial<ProductDB> = {
        exp: new Date(),
        name: "test product",
        price: 10,
        qty: 10,
        id: 10,
      }

      const response = await app
        .handle(api.POST(data, token))
        .then((res) => res.json())
      const expectData: ProductDB = {
        exp: expect.any(String),
        userId: expect.any(Number),
        name: "test product",
        price: 10,
        qty: 10,
        id: 10,
        create: expect.any(String),
      }
      expect(response).toBeObject()
      expect(response).toContainKey("price")
      expect(response).toContainKey("name")
      expect(response).toEqual(expectData)
    })

    it("error can create Product ", async () => {
      const data = {
        exp: "12343",
        name: "error",
        price: "error",
        qty: "error",
        id: "error",
      }

      const response = await app
        .handle(api.POST(data, token))
        .then((res) => res.json())

      expect(response).toBeObject()
      expect(response).not.toContainKey("price")
      expect(response).not.toContainKey("name")
      expect(response).not.toEqual(data)
    })
  })

  describe("can test product GET controller", async () => {
    it("can get All Product", async () => {
      const response = await app
        .handle(api.GET("", token))
        .then((res) => res.json())
      // console.log(response)
      expect(response).toBeArray()
    })

    it("can get by id Product", async () => {
      const response = await app
        .handle(api.GET(10, token))
        .then((res) => res.json())
      expect(response).toBeObject()
      const expectData: ProductDB = {
        exp: expect.any(String),
        userId: expect.any(Number),
        name: "test product",
        price: 10,
        qty: 10,
        id: 10,
        create: expect.any(String),
      }

      expect(response).toEqual(expectData)
    })

    it("Error can't get id Product", async () => {
      const response = await app
        .handle(api.GET(123, token))
        .then((res) => res.json())
      expect(response).toBeObject()
      expect(response).toContainKey("name")
      expect(response).toContainKey("message")
      expect(response).not.toEqual({
        exp: expect.any(String),
        name: "test product",
        price: 10,
        qty: 10,
        id: 10,
      })
    })

    it("Error can't get id not found Product", async () => {
      const response = await app
        // .handle(new Request('http://localhost:3000/api/product/1', { }))
        .handle(api.GET("error", token))
        .then((res) => res.json())
      // console.log(response)
      expect(response).toBeObject()
      expect(response).toContainKey("type")
      expect(response).not.toEqual({
        exp: expect.any(String),
        name: "test product",
        price: 10,
        qty: 10,
        id: 10,
      })
    })
  })

  describe("can test product PUT controller", async () => {
    it("can update Product", async () => {
      const data: Partial<ProductDB> = {
        exp: new Date(),
        name: "test update",
        price: 10,
        qty: 10,
        id: 10,
      }

      const response = await app
        //@ts-ignore
        .handle(api.PUT(data.id, data, token))
        .then((res) => res.json())
      // console.log(response)
      expect(response).toBeObject()

      const expectData: ProductDB = {
        id: 10,
        name: "test update",
        price: 10,
        qty: 10,
        exp: expect.any(String), // the actually is date
        userId: expect.any(Number),
        create: expect.any(String), // the actually is date
      }
      expect(response).toEqual(expectData)

      it("ERROR  can update Product", async () => {
        const data = {
          exp: "new Date()",
          name: 1234,
          price: "10",
          qty: "10",
          id: "10",
        }

        const response = await app
          //@ts-ignore
          .handle(api.PUT(data.id, data, token))
          .then((res) => res.json())
        // console.log(response)
        expect(response).toBeObject()
        expect(response).toThrowError()
        expect(response).toBeFalse()
        expect(response).not.toEqual({
          id: 10,
          name: "test update",
          price: 10,
          qty: 10,
          exp: expect.any(String), // the actually is date
          userId: null, //expect.anything()
        })
      })
    })
  })

  describe("can test product DELETE controller", async () => {
    it("can delete Product", async () => {
      const post = await prisma.postDB.findFirst()
      const id = idProduct(10, post?.id)
      const expectData: ProductDB = {
        id: expect.any(Number),
        name: "test update",
        price: 10,
        qty: 10,
        exp: expect.any(String),
        create: expect.any(String),
        userId: expect.any(Number),
      }

      const response = await app
        .handle(api.DELETE(10, token))
        .then((res) => res.json())
      expect(response).toBeObject()
      expect(response).not.toContainKey("message")

      expect(response).toEqual(expectData)
    })

    it("can't get data because after delete data Product", async () => {
      const post = await prisma.postDB.findFirst()
      const id = idProduct(10, post?.id)
      const response = await app
        .handle(api.GET(id, token))
        .then((res) => res.text())
      console.log(response, "test--===")
      // expect(response).toBeObject();
      // expect(response).not.toContainKey("price")
      // expect(response).not.toContainKey("qty")
      // expect(response).not.toContainKey("exp")
      // expect(response).not.toContainKey("userId")
    })
  })
})
