import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Post as PostModel } from '@prisma/client';

import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getFilteredPosts(
    @Query() query: { title?: string; content?: string },
  ): Promise<PostModel[]> {
    return this.postsService.getFilteredPosts({
      where: {
        AND: [
          {
            title: { contains: query.title },
          },
          {
            content: { contains: query.content },
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
    @Body() postData: { authorEmail: string; content?: string; title: string },
  ): Promise<PostModel> {
    const { authorEmail, content, title } = postData;

    return this.postsService.createPost({
      author: {
        connect: { email: authorEmail },
      },
      content,
      title,
    });
  }

  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() data: { content?: string; title: string },
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
