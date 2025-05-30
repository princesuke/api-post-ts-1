import prisma from "@/database/prisma";

interface IPostService {
  createPost: (data: any) => Promise<any>;
  getPost: (id: string) => Promise<any>;
  updatePost: (id: string, data: any) => Promise<any>;
  deletePost: (id: string) => Promise<any>;
}

const postService: IPostService = {
  createPost: (data: any) => {
    return prisma.post.create({ data });
  },
  getPost: (id: string) => {
    return prisma.post.findMany({ where: { userId: id } });
  },
  updatePost: (id: string, data: any) => {
    return prisma.post.update({ where: { id }, data });
  },
  deletePost: (id: string) => {
    return prisma.post.delete({ where: { id } });
  },
};

export default postService;
