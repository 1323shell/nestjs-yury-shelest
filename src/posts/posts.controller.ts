import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Post as PostModel } from '@prisma/client';

import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(':searchString')
  async getFilteredPosts(
    @Param('searchString') searchString: string,
  ): Promise<PostModel[]> {
    return this.postsService.getFilteredPosts({
      where: {
        OR: [
          {
            title: { contains: searchString },
          },
        ],
      },
    });
  }

  @Get(':id')
  async getPostById(@Param('id') id: string): Promise<PostModel> {
    return this.postsService.getPost({ id: Number(id) });
  }

  @Post()
  async createDraft(
    @Body() postData: { title: string; authorEmail: string },
  ): Promise<PostModel> {
    const { title, authorEmail } = postData;

    return this.postsService.createPost({
      title,
      author: {
        connect: { email: authorEmail },
      },
    });
  }

  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() data: { title: string },
  ): Promise<PostModel> {
    return this.postsService.updatePost({
      where: { id: Number(id) },
      data,
    });
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<PostModel> {
    return this.postsService.deletePost({ id: Number(id) });
  }
}
