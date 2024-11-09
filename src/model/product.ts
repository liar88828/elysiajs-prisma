import Elysia, { Static, t } from "elysia"
import { Value } from "@sinclair/typebox/value"

const productBase = t.Object({
  id: t.Optional(t.Number()),
  userId: t.Optional(t.Number()),
  name: t.String(),
  price: t.Number(),
  qty: t.Number(),
  exp: t.Date(),
})

const idProduct = t.Object({
  idProduct: t.Number(),
})
export const productModel = new Elysia({ name: "Model.Product" })
  .model({ "product.id": idProduct })
  .model({ "product.body": productBase })

export type ProductBase = Static<typeof productBase>
export type ProductId = Static<typeof idProduct>
