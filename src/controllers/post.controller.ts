import BadRequestException from "@/exceptions/bad-request.exception";
import authService from "@/services/auth.service";
import postService from "@/services/post.service";
import { HttpStatus } from "@/types/http.types";
import type { NextFunction, Request, Response } from "express";

interface IPostController {
  createPost: (req: Request, res: Response, next: NextFunction) => void;
  getPost: (req: Request, res: Response, next: NextFunction) => void;
  updatePost: (req: Request, res: Response, next: NextFunction) => void;
  deletePost: (req: Request, res: Response, next: NextFunction) => void;
}

const postController: IPostController = {
  createPost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const { title, content, imgUrl } = req.body;

      if (!userId) {
        throw new BadRequestException(
          "userId is required",
          HttpStatus.BAD_REQUEST
        );
      }

      const existUser = await authService.findUserById(userId);

      if (!existUser) {
        throw new BadRequestException(
          "userId is not exist",
          HttpStatus.BAD_REQUEST
        );
      }

      const data: {
        userId: string;
        title: string;
        content?: string;
        imgUrl?: string;
      } = {
        userId,
        title,
      };

      if (!title || !content) {
        throw new BadRequestException(
          "title, content are required",
          HttpStatus.BAD_REQUEST
        );
      }

      if (imgUrl) {
        data.imgUrl = imgUrl;
      }

      if (content) {
        data.content = content;
      }

      const post = await postService.createPost(data);
      res.status(201).json({ message: "create post success", post });
    } catch (error) {
      next(error);
    }
  },
  getPost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      const posts = await postService.getPost(userId);
      res.json({ message: "get post success", posts });
    } catch (error) {
      next(error);
    }
  },
  updatePost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      //   const { userId } = req.params;
      const { id, title, content } = req.body;

      if (!title || !content) {
        throw new BadRequestException(
          "title, content are required",
          HttpStatus.BAD_REQUEST
        );
      }

      const updatePost = await postService.updatePost(id, {
        title,
        content,
      });
      res.json({ message: "update post success", updatePost });
    } catch (error) {
      next(error);
    }
  },
  deletePost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { postId } = req.params;

      await postService.deletePost(postId);
      res.status(204).json({ message: "delete post success" });
    } catch (error) {
      next(error);
    }
  },
};

export default postController;
