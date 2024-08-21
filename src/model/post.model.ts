import { Elysia, Static, t } from "elysia"

const postCreate = t.Object({
  msg: t.String(),
  title: t.String(),
  // userId: t.Number(),
})

//  id: number;
//     title: string;
//     msg: string;
//     rating: number;
//     userId: number | null;
//     productDBId: number | null;

const postProduct = t.Object({
  msg: t.String({ minLength: 5 }),
  title: t.String({ minLength: 5 }),
  rating: t.Number({ minLength: 5 }),
  // userId: t.Number(),
  // productDBId: t.Number(),
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
