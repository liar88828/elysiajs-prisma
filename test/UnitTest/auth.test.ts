// test/index.test.ts
import { afterAll, beforeAll, describe, expect, it } from "bun:test"
import type { LoginModel, RegisterModel } from "../../src/model/auth"
import { prisma } from "../../src/config/db"
import API from "../utils/myApi"
import { app } from "../../src"
import { SKIP } from "../utils/idProduct"

let token: string = ""
const api = new API("auth")

describe.skipIf(SKIP)("can test auth controller", async () => {
  beforeAll(async () => {
    console.log("------------------- Start test auth -------------------")

    // const response = await registerSetup();
    // token = response.accessToken;
  })

  afterAll(async () => {
    console.log("done with test.")
    await prisma.userDB.deleteMany()
  })

  describe("can test register", () => {
    it(" because can create register ", async () => {
      const dataRegister: RegisterModel = {
        name: "test",
        address: "test",
        email: "user1@gmail.com",
        age: 110,
        confPass: "12345678",
        password: "12345678",
      }

      const response = await app
        .handle(api.POST(dataRegister, "", "/register"))
        .then((res) => res.json())
      expect(response).toBeObject()
      expect(response).toContainKey("accessToken")
      const test = {
        accessToken: expect.any(String),
      }
      expect(response).toEqual(test)
    })

    it(" Error because can't create again ", async () => {
      const dataRegister: RegisterModel = {
        name: "test",
        address: "test",
        email: "user1@gmail.com",
        age: 110,
        confPass: "12345678",
        password: "12345678",
      }

      const response = await app
        .handle(api.POST(dataRegister, "", "/register"))
        .then((res) => res.json())

      expect(response).toBeObject
      expect(response).not.toContainKey("accessToken")
      expect(response).toContainKey("name")
      expect(response).toContainKey("message")
    })

    it("Error because can't create register because password not complete ", async () => {
      const dataRegister: RegisterModel = {
        name: "test",
        address: "test",
        email: "user1@gmail.com",
        age: 110,
        confPass: "1234567",
        password: "12345678",
      }

      const response = await app
        .handle(api.POST(dataRegister, "", "/register"))
        .then((res) => res.json())

      expect(response).toBeObject
      expect(response).not.toContainKey("accessToken")
      expect(response).toContainKey("name")
      expect(response).toContainKey("message")
    })

    it("Error because can't create register because password not complete again ", async () => {
      const dataRegister: RegisterModel = {
        name: "test",
        address: "test",
        email: "user1@gmail.com",
        age: 110,
        confPass: "1234567",
        password: "12345",
      }

      const response = await app
        .handle(api.POST(dataRegister, "", "/register"))
        .then((res) => res.json())

      expect(response).toBeObject
      expect(response).not.toContainKey("accessToken")
    })

    it("Error because can't create register because password not complete again ", async () => {
      const dataRegister: RegisterModel = {
        name: "test",
        address: "test",
        email: "user1@gmail.com",
        age: 110,
        confPass: "1234567",
        password: "12345",
      }

      const response = await app
        .handle(api.POST(dataRegister, "", "/register"))
        .then((res) => res.json())

      expect(response).toBeObject
      // expect(response).not.toContainKey("accessToken");
      // expect(response).toContainKey("name");
      // expect(response).toContainKey("message");
    })

    it("ERROR because wrong can create register ", async () => {
      const dataRegister: RegisterModel = {
        address: "test",
        age: 1,
        confPass: "test",
        email: "test",
        name: "test",
        password: "test",
      }

      const response = await app
        .handle(api.POST(dataRegister, "", "/register"))
        .then((res) => res.json())
      const test = {
        accessToken: expect.any(String),
      }
      expect(response).toBeObject()
      expect(response).not.toContainKey("accessToken")
      expect(response).not.toEqual(test)
    })
  })

  describe("can test login", () => {
    it("can  login", async () => {
      const data: LoginModel = {
        email: "user1@gmail.com",
        password: "12345678",
      }
      const response = await app
        .handle(api.POST(data, "", "/login"))
        .then((res) => res.json())
      const test = {
        accessToken: expect.any(String),
      }
      expect(response).toBeObject()
      expect(response).toContainKey("accessToken")
      expect(response).toEqual(test)
    })

    it("Error can create login because wrong password", async () => {
      const data: LoginModel = {
        email: "user1@gmail.com",
        password: "1234567",
      }
      const response = await app
        .handle(api.POST(data, "", "/login"))
        .then((res) => res.json())
      const test = {
        accessToken: expect.any(String),
      }
      expect(response).toBeObject()
      expect(response).not.toContainKey("accessToken")
      expect(response).not.toEqual(test)
    })

    it("Error can create login because wrong email", async () => {
      const data: LoginModel = {
        email: "user1",
        password: "12345678",
      }
      const response = await app
        .handle(api.POST(data, "", "/login"))
        .then((res) => res.json())
      const test = {
        accessToken: expect.any(String),
      }
      expect(response).toBeObject()
      expect(response).not.toContainKey("accessToken")
      expect(response).not.toEqual(test)
    })
  })
})
