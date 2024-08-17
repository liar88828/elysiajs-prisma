// test/index.test.ts
import { afterAll, beforeAll, describe, expect, it } from "bun:test"
import type { App } from "../src"
import { treaty } from "@elysiajs/eden"
import { prisma } from "../src/config/db"

const app = treaty<App>("localhost:3000").api
const id = 1
describe.skip("test user controller get method", () => {
  // beforeEach(async () => {
  //   await prisma.user.deleteMany({
  //     where: {
  //       NOT: { id },
  //     },
  //   })
  beforeAll(async () => {
    console.log("running test.")
    await prisma.user.create({
      data: { address: "user1", age: 110, name: "user test", id: 1 },
    })
  })

  afterAll(() => {
    console.log("done with test.")
  })

  it("user can create params ", async () => {
    const { data } = await app.user.index.post({
      address: "user1",
      age: 110,
      name: "user test",
    })

    expect(data).toEqual({
      address: "user1",
      age: 110,
      name: "user test",
      id: expect.any(Number),
    })
    expect(data).not.toBeArray()
    expect(data).toBeObject()
  })

  it("user can get params all ", async () => {
    const { data } = await app.user.index.get()
    expect(data).toBeArray()
    expect(data).toBeObject()
  })

  it("user can get id params", async () => {
    const { data} = await app.user({ id }).get()

    expect(data).toEqual({
      address: "user1",
      age: 110,
      name: "user test",
      id: expect.any(Number),
    
    })

    expect(data).not.toEqual({
      address: "not user1 ",
      age: 123,
      name: "not user test",
      id: expect.any(Number),
    })

    expect(data).toBeObject()
    expect(data).not.toBeArray()
  })

  it("user can get id params", async () => {
    const { data } = await app.user({ id: 12 }).get()
    expect(data).not.toEqual({
      address: "user1",
      age: 110,
      name: "user test",
      id: expect.any(Number),
    })

    expect(data).not.toBeObject()
    expect(data).not.toBeArray()
  })

  it("user can update params all ", async () => {
    const { data } = await app.user({ id }).put({
      address: "user1 updated",
      age: 700,
      name: "user updated",
    })

    expect(data).toEqual({
      address: "user1 updated",
      age: 700,
      name: "user updated",
      id: expect.any(Number),
    })
    expect(data).not.toBeArray()
    expect(data).toBeObject()

    const { data: data2 } = await app.user({ id: 123 }).put({
      address: "user1 updated",
      age: 700,
      name: "user updated",
    })
    expect(data2).not.toBeArray()
    expect(data2).not.toBeObject()
  })

  it("user can find get id as new data", async () => {
    const { data } = await app.user({ id }).get()
    expect(data).toEqual({
      address: "user1 updated",
      age: 700,
      name: "user updated",
      id: expect.any(Number),
    })

    expect(data).not.toEqual({
      address: "test",
      age: 1,
      name: "test",
      id: expect.any(Number),
    })

    expect(data).toBeObject()
    expect(data).not.toBeArray()
  })

  // Delete data
  it("user can delete params all ", async () => {
    const { data } = await app.user({ id }).delete()
    expect(data).toEqual({
      address: "user1 updated",
      age: 700,
      name: "user updated",
      id: expect.any(Number),
    })
    expect(data).not.toBeArray()
    expect(data).toBeObject()
  })

  // find agin data
  it("user cant find again because data has deleted", async () => {
    const { data } = await app.user({ id }).get()

    expect(data).not.toEqual({
      address: "user1 updated",
      age: 700,
      name: "user updated",
      id: expect.any(Number),
    })
    expect(data).not.toBeObject()
    expect(data).not.toBeArray()
  })
})
