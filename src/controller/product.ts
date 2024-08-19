import Elysia from "elysia";
import { ProductService } from "../service/product";
import { modelProduct } from "../model/product";

export const productController = new Elysia({
	name: "productController",
	prefix: "/product",
})
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
		async ({ serviceProduct, body }) => {
			return serviceProduct.create(body);
		},
		{
			body: "product.base",
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
		{
			params: "product.id",
		}
	)
// )
