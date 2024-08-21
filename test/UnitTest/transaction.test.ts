import { afterAll, beforeAll, describe, expect, it } from "bun:test"
import { app } from "../../src"
import { prisma } from "../../src/config/db"
import type { TransactionDB, UserDB } from "@prisma/client"
import { Status } from "../../src/interface/Status"
import API from "../utils/myApi"
import type { TCheckout } from "../../src/interface/transaction.type"
import type { TransactionCreate } from "../../src/model/transaction"
import { SKIP } from "../utils/idProduct"
import { registerSetup } from "../utils/registerSetup"

let token: string = ""
const api = new API("product/user/comment")
let productId: number
let userId: number
let transactionId: number
describe.skipIf(SKIP)("can test transaction controller", async () => {
  beforeAll(async () => {
    const response = await registerSetup()
    await prisma.$transaction(async (tx) => {
      const user = (await tx.userDB.findFirst()) as UserDB
      const product = await tx.productDB.create({
        data: {
          name: "test product",
          price: 10,
          qty: 10,
          exp: new Date(),
          userId: user?.id,
        },
      })
      token = response.accessToken
      productId = product.id
      userId = user.id
      const status = await tx.statusDB.createMany({
        data: [
          { id: Status.CONFIRM },
          { id: Status.FAILED },
          { id: Status.PENDING },
          { id: Status.SUCCESS },
        ],
      })

      const transaction = await tx.transactionDB.create({
        data: {
          id: 99,
          qty: 10,
          statusId: Status.PENDING,
          userId,
          total: 200,
          productId,
          description: "test",
        },
      })
      console.log("before finish")
    })
  })

  afterAll(async () => {
    await prisma.productDB.deleteMany()
    await prisma.userDB.deleteMany()
    await prisma.transactionDB.deleteMany()
    await prisma.statusDB.deleteMany()
  })

  describe("can Create POST Transaction", async () => {
    it("POST can create Transaction success ", async () => {
      const dataTest: TransactionCreate = {
        productId,
        userId,
        qty: 10,
        total: 200_000,
        status: Status.CONFIRM,
        description: "test",
      }
      const dataExpect: TransactionDB = {
        userId: expect.any(Number),
        productId: expect.any(Number),
        id: expect.any(Number),
        statusId: Status.CONFIRM,
        create: expect.any(String),
        qty: 10,
        total: 200_000,
        description: "test",
      }

      const response = await app
        // @ts-expect-error
        .handle(new API("transaction/checkout").POST(dataTest))
        .then((res) => res.json())
      // console.log("----------")
      // console.log(response)
      // console.log("----------")
      transactionId = response.id
      expect(response).toBeObject()
      expect(response).toContainKey("productId")
      expect(response).toContainKey("userId")
      expect(response).toContainKey("qty")
      expect(response).toContainKey("id")
      expect(response).toEqual(dataExpect)
    })

    it("Error POST can't wrong  data create Transaction ", async () => {
      const dataTest: TransactionCreate = {
        productId: 32,
        userId: userId,
        qty: 0,
        total: 200_000,
        status: Status.CONFIRM,
        description: "test",
      }
      const dataExpect: TransactionDB = {
        userId: expect.any(Number),
        productId: expect.any(Number),
        id: expect.any(Number),
        statusId: Status.CONFIRM,
        create: expect.any(String),
        qty: 10,
        total: 200_000,
        description: "test",
      }

      const response = await app
        // @ts-expect-error
        .handle(new API("transaction/checkout").POST(dataTest))
        .then((res) => res.json())
      // console.log(response)
      expect(response).toBeObject()
      expect(response).not.toContainKey("productId")
      expect(response).not.toContainKey("userId")
      expect(response).not.toContainKey("qty")
      expect(response).not.toContainKey("id")
      expect(response).not.toEqual(dataExpect)
    })
  })

  describe("can get all data transaction", async () => {
    it("SUCCESS Get All From transaction ", async () => {
      const response = await app
        //@ts-expect-error
        .handle(new API("transaction").GET())
        .then((res) => res.json())
      expect(response).toBeArray()
      expect(response[0]).toContainKey("qty")
      expect(response[0]).toContainKey("id")
      expect(response[0]).toContainKey("userId")
      expect(response[0]).toContainKey("productId")
      expect(response[0]).toContainKey("total")
    })

    it("GET id From transaction", async () => {
      const response = await app
        //@ts-expect-error

        .handle(new API(`transaction/${transactionId}`).GET())
        .then((res) => res.json())

      const expectData: TransactionDB = {
        qty: 10,
        id: expect.any(Number),
        userId: expect.any(Number),
        productId: expect.any(Number),
        total: 200_000,
        statusId: Status.CONFIRM,
        create: expect.any(String),
        description: "test",
      }

      expect(response).toBeObject()
      expect(response).toContainKey("qty")
      expect(response).toContainKey("id")
      expect(response).toContainKey("userId")
      expect(response).toContainKey("productId")
      expect(response).toContainKey("total")
      expect(response).toEqual(expectData)
    })

    it("Error wrong id GET id From transaction", async () => {
      const response = await app
        //@ts-expect-error

        .handle(new API("transaction/error").GET())
        .then((res) => res.json())
      expect(response).toBeObject()
      expect(response).not.toBeArray()
      expect(response).not.toEqual({
        qty: 10,
        id: 33,
        userId: 31,
        productId: 32,
        total: 200_000,
        statusId: Status.CONFIRM,
        create: expect.any(String),
      })
    })
  })

  // not have create controller
  describe("can UPDATE Transaction", async () => {
    it(" PUT can't wrong  data create Transaction ", async () => {
      const data: TransactionCreate = {
        qty: 10,
        id: 33,
        userId,
        productId,
        total: 200_000,
        status: Status.CONFIRM,
        description: "test",
      }
      const expectData: TransactionDB = {
        qty: 10,
        id: expect.any(Number),
        userId: expect.any(Number),
        productId: expect.any(Number),
        total: 200_000,
        statusId: Status.CONFIRM,
        create: expect.any(String),
        description: "test",
      }

      const response = await app
        //@ts-expect-error
        .handle(new API("transaction/checkout").POST(data))
        .then((res) => res.json())
      // console.log(response)
      expect(response).toBeObject()
      expect(response).toContainKey("productId")
      expect(response).toContainKey("userId")
      expect(response).toContainKey("qty")
      expect(response).toContainKey("id")
      expect(response).toEqual(expectData)
    })
    it("ERROR PUT can create Transaction ", async () => {
      const data = {
        qty: "error",
        id: "Error",
        userId: "error",
        productId: "error",
        total: "error",
        status: "error",
      }
      const dataExpect = {
        qty: 10,
        id: 33,
        userId: 31,
        productId: 32,
        total: 200000,
        statusId: Status.CONFIRM,
        create: expect.any(String),
      }

      const response = await app
        //@ts-expect-error
        .handle(new API("transaction/checkout").POST(data))
        .then((res) => res.json())
      // console.log(response)
      expect(response).toBeObject()
      expect(response).not.toContainKey("productId")
      expect(response).not.toContainKey("userId")
      expect(response).not.toContainKey("qty")
      expect(response).not.toContainKey("id")
      expect(response).not.toEqual(dataExpect)
    })
  })
})
