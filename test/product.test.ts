// test/index.test.ts
import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { app } from "../src";
import API from "./utils/myApi";
import { prisma } from "../src/config/db";
import { ProductDB } from "@prisma/client";
import { registerSetup } from "./utils/registerSetup";
let token: string = "";
const api = new API("product");

describe("can test product controller", async () => {
  it("can return a response", async () => {
    const response = await app
      .handle(new Request("http://localhost:3000/hello"))
      .then((res) => res.text());
    console.log("------------------------------");
    expect(response).toBeString();
    expect(response).not.toBeObject();
    expect(response).toBe("Hello Elysia");
    expect(response).not.toBe("hi Elysia");
  });

  beforeAll(async () => {
    beforeAll(async () => {
      const response = await registerSetup();
      token = response.accessToken;
    });
  });
  afterAll(async () => {
    console.log("done with test.");
    await prisma.productDB.deleteMany();
    await prisma.userDB.deleteMany();
  });

  describe("can test product POST controller", async () => {
    it("can create Product ", async () => {
      const data: Partial<ProductDB> = {
        exp: new Date(),
        name: "test product",
        price: 10,
        qty: 10,
        id: 10,
      };

      const response = await app
        .handle(api.POST(data, token))
        .then((res) => res.json());
      const expectData: ProductDB = {
        exp: expect.any(String),
        userId: expect.any(Number),
        name: "test product",
        price: 10,
        qty: 10,
        id: 10,
      };
      expect(response).toBeObject();
      expect(response).toContainKey("price");
      expect(response).toContainKey("name");
      expect(response).toEqual(expectData);
    });

    it("error can create Product ", async () => {
      const data = {
        exp: "12343",
        name: "error",
        price: "error",
        qty: "error",
        id: "error",
      };

      const response = await app
        .handle(api.POST(data, token))
        .then((res) => res.json());

      expect(response).toBeObject();
      expect(response).not.toContainKey("price");
      expect(response).not.toContainKey("name");
      expect(response).not.toEqual(data);
    });
  });

  describe("can test product GET controller", async () => {
    // const app = new Elysia().get('/hello', () => 'hi')

    it("can get All Product", async () => {
      const response = await app
        .handle(api.GET("", token))
        .then((res) => res.json());
      // console.log(response)
      expect(response).toBeArray();
    });

    it("can get by id Product", async () => {
      const response = await app
        .handle(api.GET(10, token))
        .then((res) => res.json());
      expect(response).toBeObject();
      expect(response).toEqual({
        exp: expect.any(String),
        userId: expect.any(Number),
        name: "test product",
        price: 10,
        qty: 10,
        id: 10,
      });
    });

    it("Error can't get id Product", async () => {
      const response = await app
        .handle(api.GET(123, token))
        .then((res) => res.json());
      expect(response).toBeObject();
      expect(response).toContainKey("name");
      expect(response).toContainKey("message");
      expect(response).not.toEqual({
        exp: expect.any(String),
        name: "test product",
        price: 10,
        qty: 10,
        id: 10,
      });
    });

    it("Error can't get id not found Product", async () => {
      const response = await app
        // .handle(new Request('http://localhost:3000/api/product/1', { }))
        .handle(api.GET("error", token))
        .then((res) => res.json());
      // console.log(response)
      expect(response).toBeObject();
      expect(response).toContainKey("type");
      expect(response).not.toEqual({
        exp: expect.any(String),
        name: "test product",
        price: 10,
        qty: 10,
        id: 10,
      });
    });
  });

  describe("can test product PUT controller", async () => {
    it("can update Product", async () => {
      const data: Partial<ProductDB> = {
        exp: new Date(),
        name: "test update",
        price: 10,
        qty: 10,
        id: 10,
      };

      const response = await app
        //@ts-ignore
        .handle(api.PUT(data.id, data, token))
        .then((res) => res.json());
      // console.log(response)
      expect(response).toBeObject();
      expect(response).toEqual({
        id: 10,
        name: "test update",
        price: 10,
        qty: 10,
        exp: expect.any(String), // the actually is date
        userId: expect.any(Number),
      });

      it("ERROR  can update Product", async () => {
        const data = {
          exp: "new Date()",
          name: 1234,
          price: "10",
          qty: "10",
          id: "10",
        };

        const response = await app
          //@ts-ignore
          .handle(api.PUT(data.id, data, token))
          .then((res) => res.json());
        // console.log(response)
        expect(response).toBeObject();
        expect(response).toThrowError();
        expect(response).toBeFalse();
        expect(response).not.toEqual({
          id: 10,
          name: "test update",
          price: 10,
          qty: 10,
          exp: expect.any(String), // the actually is date
          userId: null, //expect.anything()
        });
      });
    });
  });

  describe("can test product DELETE controller", async () => {
    it("can delete Product", async () => {
      const response = await app
        .handle(api.DELETE(10, token))
        .then((res) => res.json());
      expect(response).toBeObject();
      expect(response).not.toContainKey("message");
      expect(response).toEqual({
        id: expect.any(Number),
        name: "test update",
        price: 10,
        qty: 10,
        exp: expect.any(String),
        userId: expect.any(Number),
      });
    });
    

    it("can't get data because after delete data Product", async () => {
      const response = await app
        .handle(api.GET(10, token))
        .then((res) => res.json());
      // console.log(response)
      // expect(response).toBeObject();
      expect(response).not.toContainKey("price");
      expect(response).not.toContainKey("qty");
      expect(response).not.toContainKey("exp");
      expect(response).not.toContainKey("userId");
    });
  });
});
