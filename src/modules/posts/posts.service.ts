import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from '@prisma/client';

import { PrismaService } from 'src/db/prisma.service';
import { CreatePostDto } from './dto/create.dto';
import { FindPostsDto } from './dto/find-filtered.dto';
import { FindOnePostDto } from './dto/find.dto';
import { UpdatePostDto } from './dto/update.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async findOne(data: FindOnePostDto): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: data,
    });

    if (!post) {
      const message = `Post with id ${data.id} is not found`;

      throw new NotFoundException(message);
    }

    return post;
  }

  findFiltered(data: FindPostsDto): Promise<Post[]> {
    const { content, orderBy, title } = data;

    return this.prisma.post.findMany({
      orderBy,
      where: {
        AND: [
          {
            title: { contains: title },
          },
          {
            content: { contains: content },
          },
        ],
      },
    });
  }

  create(data: CreatePostDto): Promise<Post> {
    return this.prisma.post.create({
      data,
    });
  }

  update(id: number, data: UpdatePostDto): Promise<Post> {
    return this.prisma.post.update({
      data,
      where: { id },
    });
  }

  remove(id: number): Promise<Post> {
    return this.prisma.post.delete({
      where: { id },
    });
  }
}
