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
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create.dto';
import { FindPostsDto } from './dto/find-filtered.dto';
import { UpdatePostDto } from './dto/update.dto';

@ApiTags('Posts')
@ApiBearerAuth()
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PostModel> {
    return this.postsService.findOne({ id });
  }

  @ApiQuery({
    name: 'orderBy',
    description:
      'Array with any of these values: id | email | createdAt | updatedAt',
  })
  @ApiQuery({ name: 'title', description: 'Title of the post' })
  @ApiQuery({ name: 'content', description: 'Content of the post' })
  @Get()
  findFiltered(@Query() query: FindPostsDto): Promise<PostModel[]> {
    return this.postsService.findFiltered(query);
  }

  @ApiBody({ type: CreatePostDto })
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

  @ApiBody({ type: UpdatePostDto })
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
