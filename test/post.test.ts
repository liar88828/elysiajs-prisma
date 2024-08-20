// test/index.test.ts
import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import API from "./utils/myApi";
import { prisma } from "../src/config/db";
import { PostDB } from "@prisma/client";
import { registerSetup } from "./utils/registerSetup";
import { app } from "../src";
let token: string = "";
const api = new API("post");
describe("can test post controller", async () => {
  beforeAll(async () => {
    const response = await registerSetup();
    token = response.accessToken;
  });

  afterAll(async () => {
    console.log("done with test.");
    await prisma.userDB.deleteMany();
    await prisma.postDB.deleteMany();
  });

  describe("can post data", () => {
    it("can create post ", async () => {
      const data: Partial<PostDB> = {
        msg: "test post",
        title: "test post",
      };
      const response = await app
        .handle(api.POST(data, token))
        .then((res) => res.json());
      // console.log(token);
      // console.log(response);
      expect(response).toBeObject();
      expect(response).toContainKey("msg");
      expect(response).toContainKey("title");
      const test = {
        msg: "test post",
        title: "test post",
        id: expect.any(Number),
        userId: expect.any(Number),
      };
      expect(response).toEqual(test);
    });
  });
});
