import { Elysia, Static, t } from "elysia"

const postCreate = t.Object({
  msg: t.String(),
  title: t.String(),
})

const postProduct = t.Object({
  msg: t.String({ minLength: 5 }),
  title: t.String({ minLength: 5 }),
  rating: t.Number({ minLength: 5 }),
})
const postId = t.Object({ id: t.Number() })
const postProductParam = t.Object({
  idProduct: t.Number(),
  idPost: t.Optional(t.Number()),
})

export type PostCreate = Static<typeof postCreate>
export type PostProduct = Static<typeof postProduct>
export type PostId = Static<typeof postId>
export type PostProductParam = Static<typeof postProductParam>

export const postModel = new Elysia({ name: "Model.Post" })
  .model({ "post.create": postCreate })
  .model({ "post.id": postId })
  .model({ "post.product": postProduct })
  .model({ "post.product.param": postProductParam })
