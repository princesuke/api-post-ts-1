import postController from "@/controllers/post.controller";
import authenBody from "@/middlewares/authenBody.middleware";
import express, { type Router } from "express";

const postRouter: Router = express.Router();

postRouter.get("/:userId", authenBody, postController.getPost);
postRouter.post("/:userId", authenBody, postController.createPost);
postRouter.put("/:userId", authenBody, postController.updatePost);
postRouter.delete("/:userId/:postId", authenBody, postController.deletePost);

export default postRouter;
