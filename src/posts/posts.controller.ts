import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Post as PostModel } from '@prisma/client';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create.dto';
import { FindPostsDto } from './dto/find-filtered.dto';
import { UpdatePostDto } from './dto/update.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PostModel> {
    return this.postsService.findOne({ id });
  }

  @Get()
  findFiltered(@Query() query: FindPostsDto): Promise<PostModel[]> {
    return this.postsService.findFiltered(query);
  }

  @Post()
  create(@Body() data: CreatePostDto): Promise<PostModel> {
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
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePostDto,
  ): Promise<PostModel> {
    return this.postsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<PostModel> {
    return this.postsService.remove(id);
  }
}
