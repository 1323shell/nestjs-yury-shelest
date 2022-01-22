import { Injectable } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';

import { PrismaService } from '../services/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    postWhereUniqueInput: Prisma.PostWhereUniqueInput,
  ): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: postWhereUniqueInput,
    });
  }

  async findFiltered(params: {
    orderBy?: Prisma.PostOrderByWithRelationInput;
    where?: Prisma.PostWhereInput;
  }): Promise<Post[]> {
    const { orderBy, where } = params;

    return this.prisma.post.findMany({
      orderBy,
      where,
    });
  }

  async create(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({
      data,
    });
  }

  async update(params: {
    data: Prisma.PostUpdateInput;
    where: Prisma.PostWhereUniqueInput;
  }): Promise<Post> {
    const { data, where } = params;

    return this.prisma.post.update({
      data,
      where,
    });
  }

  async remove(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    return this.prisma.post.delete({
      where,
    });
  }
}
