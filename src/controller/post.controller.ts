import { Elysia } from "elysia";
import { PostService } from "../service/post.service";
import { postModel } from "../model/post.model";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

export const postController = new Elysia({
	name: "Controller.Post",
	prefix: '/post'
})
	
	.use(postModel)
	.use(AuthMiddleware)
	.decorate({
		'postService': new PostService()
	})
	
	.get('/', async ({ postService }) => {
			return postService.findAll();
		}
	)
	.get('/user', async ({ postService, userToken }) => {
		return postService.findMy(userToken.id);
		}
	)
	.get('/:id', async ({ postService, params, userToken }) => {
		return postService.findId(params.id,);
		}, { params: 'post.id' }
	)
	.get('/user/:id', async ({ postService, params, userToken }) => {
			return postService.findIdByUser(params.id, userToken.id);
		}, { params: 'post.id' }
	)
	
	.post("/", async ({ postService, body, userToken }) => {
			console.time()
			body.userId = userToken.id
			const res = await postService.create(body, userToken.id);
			console.timeEnd()
			return res
			
		},
		{ body: "post.create" })
