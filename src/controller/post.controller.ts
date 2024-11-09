import { Elysia } from "elysia"
import { postModel } from "../model/post.model"
import { AuthMiddleware } from "../middleware/AuthMiddleware"
import { PostService } from "../service/post/post.service"

export const authMacro = new Elysia({ name: "plugin.admin" }).macro(
  ({ onBeforeHandle }) => ({
    isRole(role: "ADMIN" | "USER") {
      onBeforeHandle(({ error, cookie }) => {
        if (role === "ADMIN") {
          console.log("is admin")
        } else if (role === "USER") {
          console.log("is not admin")
        }
        // throw error("Unauthorized", " is Admin Only");
      })
    },
  })
)

export const postController = new Elysia({
  name: "Controller.Post",
  prefix: "/post",
})
  .use(AuthMiddleware)
  .use(authMacro)
  .use(postModel)
  .decorate({
    postService: new PostService(),
  })
  .guard({ body: "post.create" })
  .group("/all", (app) =>
    app
      .get("/", async ({ postService }) => {
        return postService.findAll()
      })
      .get(
        "/:id",
        async ({ postService, params }) => {
          return postService.findId(params.id)
        },
        { params: "post.id" }
      )
  )
  .group("/user", (app) =>
    app
      .get("/", async ({ postService, payload }) => {
        return postService.findUser(payload.id)
      })
      .get(
        "/:id",
        async ({ postService, params, payload }) => {
          return postService.findIdUser(params.id, payload.id)
        },
        { params: "post.id" }
      )
  )

  .post(
    "/",
    async ({ postService, body, payload }) => {
      const res = await postService.createUser(body, payload.id)
      return res
    },
    {
      body: "post.create",
      isRole: "ADMIN",
    }
  )
  .put(
    "/:id",
    async ({ postService, params, body, payload }) => {
      const res = await postService.updateUser(body, params.id, payload.id)
    },
    { params: "post.id" }
  )
  .delete(
    "/:id",
    async ({ postService, params: { id }, payload }) => {
      return postService.deleteUser(id, payload.id)
    },
    {
      params: "post.id",
    }
  )
