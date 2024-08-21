import Elysia from "elysia"
import { AuthMiddleware } from "../../middleware/AuthMiddleware"
import { postModel } from "../../model/post.model"
import { productModel } from "../../model/product"
import { ProductPostService } from "../../service/product/product.user"
import { ProductLikeService } from "../../service/product/ProductLikeService"

export const productUserController = new Elysia({
  name: "Controller.product.user",
  prefix: "/user",
})
  .use(AuthMiddleware)
  .use(productModel)
  .use(postModel)
  .decorate({
    serviceComment: new ProductPostService(),
    serviceLike: new ProductLikeService(),
  })
  .onBeforeHandle(() => {
    console.log(1)
  })
  .get("/test", () => {
    return "user api success"
  })
  // not implement
  .group("/like", (app) =>
    app
      .get("/", ({}) => {
        console.log("get like")
        return { data: "not implement" }
      })

      .put(
        "/:idProduct",
        async ({ params, serviceLike, payload }) => {
          await serviceLike.like(params, payload)
          return { data: "not implement" }
        },
        { params: "product.id" }
      )
      .delete(
        "/:idProduct",
        async ({ serviceLike, payload, params }) => {
          await serviceLike.unlike(params, payload)
          return { data: "not implement" }
        },
        { params: "product.id" }
      )
  )

  .group("/comment", (app) =>
    app
      .get("/", async ({}) => {
        return { data: "test" }
      })
      .get(
        "/:idProduct",
        async ({ serviceComment, params }) => {
          return serviceComment.find(params)
        },
        { params: "post.product.param" }
      )
      .get(
        "/:idProduct/:idPost",
        async ({ serviceComment, params }) => {
          return serviceComment.findId(params)
        },
        { params: "post.product.param" }
      )
      .post(
        "/:idProduct",
        async ({ params, serviceComment, body, payload }) => {
          return serviceComment.comment(params, payload, body)
        },
        {
          params: "post.product.param",
          body: "post.product",
        }
      )
      .put(
        "/:idProduct/:idPost",
        async ({ params, serviceComment, body, payload }) => {
          return serviceComment.commentUpdate(params, payload, body)
        },
        {
          params: "post.product.param",
          body: "post.product",
        }
      )
      .delete(
        "/:idProduct/:idPost",
        async ({ params, serviceComment, payload }) => {
          return serviceComment.commentDelete(params, payload)
        },
        { params: "post.product.param" }
      )
  )
