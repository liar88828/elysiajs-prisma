// test/index.test.ts
import { describe, expect, it } from "bun:test"
import type { App } from "../src"
import { treaty } from "@elysiajs/eden"

const app = treaty<App>("localhost:3000")

describe("Elysia", () => {
  it("return a response", async () => {
    const { data } = await app.index.get()

    expect(data).toBe("Hello Elysia")
    expect(data).not.toBe("hi Elysia")
  })
})
