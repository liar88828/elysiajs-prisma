import Elysia from "elysia";
import { ProductService } from "../service/product";
import { modelProduct } from "../model/product";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

export const productController = new Elysia({
  name: "productController",
  prefix: "/product",
})
  .use(AuthMiddleware)
  .decorate({
    serviceProduct: new ProductService(),
  })
  .use(modelProduct)
  .get("/", async ({ serviceProduct }) => {
    return serviceProduct.find();
  })
  .get(
    "/:id",
    async ({ serviceProduct, params: { id } }) => {
      return serviceProduct.findId(id);
    },
    {
      params: "product.id",
    }
  )
  .post(
    "/",
    async ({ serviceProduct, body, userToken }) => {
      return serviceProduct.create(body, userToken);
    },
    {
      body: "product.base",
      cookie: "auth.jwt_token",
    }
  )
  .put(
    "/:id",
    async ({ serviceProduct, params: { id }, body }) => {
      return serviceProduct.update(id, body);
    },
    {
      params: "product.id",
      body: "product.base",
    }
  )
  .delete(
    "/:id",
    async ({ serviceProduct, params: { id } }) => {
      return serviceProduct.delete(id);
    },
    { params: "product.id" }
  );


