// test/index.test.ts
import { afterAll, beforeAll, describe, expect, it } from "bun:test"
import type { RegisterModel } from "../../src/model/auth"
import { prisma } from "../../src/config/db"
import API from "../utils/myApi"
import { treaty } from "@elysiajs/eden"
import type { App } from "../../src"
import { SKIP } from "../utils/idProduct"

const app = treaty<App>("localhost:3000")

describe.skipIf(SKIP)("Elysia", () => {
  it("return a response", async () => {
    const { data } = await app.hello.get()

    expect(data).toBe("Hello Elysia")
    expect(data).not.toBe("hi Elysia")
  })
})
