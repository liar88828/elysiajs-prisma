import Elysia from "elysia"
import { productModel } from "../../model/product"
import { AuthMiddleware } from "../../middleware/AuthMiddleware"
import { productUserController } from "./productUser"
import { ProductService } from "../../service/product/product"
import { ProductMarketController } from "./productMarket"

export const productController = new Elysia({
  name: "productController",
  prefix: "/product",
})
  .use(AuthMiddleware)
  .use(productModel)
  .use(ProductMarketController)
  .use(productUserController)
  .onBeforeHandle(() => {
    console.log("test onBeforeHandle")
  })
  .decorate({
    serviceProduct: new ProductService(),
  })
  .get("/", async ({ serviceProduct }) => {
    return serviceProduct.find()
  })
  .get(
    "/:idProduct",
    async ({ serviceProduct, params }) => {
      return serviceProduct.findId(params)
    },
    {
      params: "product.id",
    }
  )
  .post(
    "/",
    async ({ serviceProduct, body, payload }) => {
      return serviceProduct.create(body, payload)
    },
    {
      body: "product.body",
      cookie: "auth.jwt_token",
    }
  )
  .put(
    "/:idProduct",
    async ({ serviceProduct, params, body }) => {
      return serviceProduct.update(params, body)
    },
    {
      params: "product.id",
      body: "product.body",
    }
  )
  .delete(
    "/:idProduct",
    async ({ serviceProduct, params }) => {
      return serviceProduct.delete(params)
    },
    { params: "product.id" }
  )
