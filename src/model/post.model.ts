import { Elysia, Static, t } from "elysia";

const postCreate = t.Object({
	msg: t.String(),
	title: t.String(),
	// userId: t.Number(),
});

export type PostCreate = Static<typeof postCreate>
export const postModel = new Elysia({ name: "Model.Post" })
	.model({
		"post.create": postCreate,
	})
	.model({ 'post.id': t.Object({ id: t.Number() }) })
