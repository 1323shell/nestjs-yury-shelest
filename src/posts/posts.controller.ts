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
  findFiltered(
    @Query() query: { title?: string; content?: string },
  ): Promise<PostModel[]> {
    return this.postsService.findFiltered({
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
  findOne(@Param('id') id: string): Promise<PostModel> {
    return this.postsService.findOne({ id: parseInt(id, 10) });
  }

  @Post()
  create(
    @Body() data: { authorEmail: string; content?: string; title: string },
  ): Promise<PostModel> {
    const { authorEmail, content, title } = data;

    return this.postsService.create({
      author: {
        connect: { email: authorEmail },
      },
      content,
      title,
    });
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: { content?: string; title: string },
  ): Promise<PostModel> {
    return this.postsService.update({
      data,
      where: { id: parseInt(id, 10) },
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<PostModel> {
    return this.postsService.remove({ id: parseInt(id, 10) });
  }
}
