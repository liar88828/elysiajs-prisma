// test/index.test.ts
import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import type { App } from "../src";
import { treaty } from "@elysiajs/eden";
import { prisma } from "../src/config/db";
import { UserDB } from "@prisma/client";

const app = treaty<App>("localhost:3000").api;
const id = 1;
describe.skip("test user controller get method", () => {
  beforeAll(async () => {
    console.log("running test.");
    await prisma.userDB.create({
      data: {
        address: "user1",
        age: 110,
        name: "user test",
        id: 1,
        otp: 1234,
        email: "",
        password: "",
        refreshTokens: "",
      },
    });
  });

  afterAll(async () => {
    console.log("done with test.");
    await prisma.userDB.deleteMany({});
  });

  describe("can test user POST controller", async () => {
    it("user can create params ", async () => {
      const sendData: UserDB = {
        id: 123,
        address: "user1",
        age: 110,
        name: "user test",
        email: "",
        password: "",
        refreshTokens: "",
        otp: 1234,
        active: false,
        valid: false,
      };
      const { data } = await app.user.index.post(sendData);

      const expectData: UserDB = {
        id: expect.any(Number),
        address: "user1",
        age: 110,
        name: "user test",
        email: "",
        password: "",
        refreshTokens: "",
        otp: 1234,
        active: false,
        valid: false,
      };
      expect(data).toEqual(expectData);
      expect(data).not.toBeArray();
      expect(data).toBeObject();
    });
  });

  describe("can test user GET controller", async () => {
    it("user can get params all ", async () => {
      const { data } = await app.user.index.get();
      expect(data).toBeArray();
      expect(data).toBeObject();
    });

    it("user can get id params", async () => {
      const { data } = await app.user({ id }).get();

      const expectData: UserDB = {
        address: "user1",
        age: 110,
        name: "user test",
        id: expect.any(Number),
        otp: 1234,
        active: false,
        valid: false,
        email: "",
        password: "",
        refreshTokens: "",
      };
      expect(data).toEqual(expectData);

      expect(data).not.toEqual({
        address: "not user1 ",
        age: 123,
        name: "not user test",
        id: expect.any(Number),
      });

      expect(data).toBeObject();
      expect(data).not.toBeArray();
    });

    it("error user can't get id params", async () => {
      const { data } = await app.user({ id: 12 }).get();
      expect(data).not.toEqual({
        address: "user1",
        age: 110,
        name: "user test",
        id: expect.any(Number),
      });

      expect(data).not.toBeObject();
      expect(data).not.toBeArray();
    });
  });

  describe("can update user PUT controller", async () => {
    it("user can update params all ", async () => {
      const sendData: UserDB = {
        address: "user1 updated",
        age: 700,
        name: "user updated",
        id: 1,
        email: "",
        password: "",
        refreshTokens: "",
        otp: 1234,
        active: false,
        valid: false,
      };

      const { data } = await app.user({ id }).put(sendData);

      expect(data).toEqual({
        address: "user1 updated",
        age: 700,
        name: "user updated",
        id: expect.any(Number),
        active: false,
        valid: false,
        email: "",
        password: "",
        refreshTokens: "",
        otp: 1234,
      });
      expect(data).not.toBeArray();
      expect(data).toBeObject();

      const testError: UserDB = {
        address: "user1 updated",
        age: 700,
        name: "user updated",
        id: 1,
        active: true,
        valid: true,
        email: "",
        password: "",
        refreshTokens: "",
        otp: 1234,
      };
      const { data: data2 } = await app.user({ id: 123 }).put(testError);
      expect(data2).not.toBeArray();
      expect(data2).not.toBeObject();
    });

    it("user can find get id as new data", async () => {
      const { data } = await app.user({ id }).get();
      expect(data).toEqual({
        address: "user1 updated",
        age: 700,
        name: "user updated",
        id: expect.any(Number),
        active: false,
        valid: false,
        email: "",
        password: "",
        refreshTokens: "",
        otp: 1234,
      });

      expect(data).not.toEqual({
        address: "test",
        age: 1,
        name: "test",
        id: expect.any(Number),
      });

      expect(data).toBeObject();
      expect(data).not.toBeArray();
    });
  });

  describe("can DELETE user  controller", async () => {
    // Delete data
    it("user can delete params all ", async () => {
      const { data } = await app.user({ id }).delete();
      const test: UserDB = {
        address: "user1 updated",
        age: 700,
        name: "user updated",
        id: expect.any(Number),
        otp: 1234,
        active: false,
        valid: false,
        email: "",
        password: "",
        refreshTokens: "",
      };
      expect(data).toEqual(test);
      expect(data).not.toBeArray();
      expect(data).toBeObject();
    });

    // find again data
    it("user cant find again because data has deleted", async () => {
      const { data } = await app.user({ id }).get();

      expect(data).not.toEqual({
        address: "user1 updated",
        age: 700,
        name: "user updated",
        id: expect.any(Number),
      });
      expect(data).not.toBeObject();
      expect(data).not.toBeArray();
    });
  });
});
