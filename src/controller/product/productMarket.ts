import Elysia from "elysia"
import { AuthMiddleware } from "../../middleware/AuthMiddleware"
import { ProductMarketService } from "../../service/product/product.market"

export const ProductMarketController = new Elysia({
  name: "Controller.product.comment",
  prefix: "/market",
})
  .use(AuthMiddleware)
  .decorate({ serviceMarket: new ProductMarketService() })
  .get("/", async ({ serviceMarket }) => {
    return serviceMarket.find()
  })
