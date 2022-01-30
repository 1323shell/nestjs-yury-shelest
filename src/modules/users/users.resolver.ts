import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { User as UserPrisma } from '@prisma/client';

import { User } from './users.model';
import { UsersService } from './users.service';
import { PostsService } from '../posts/posts.service';
import { PrismaService } from 'src/db/prisma.service';
import { FindUsersInput } from './input-types';

@Resolver((of) => User)
export class UsersResolver {
  constructor(
    @Inject(PrismaService) private prismaService: PrismaService,
    private usersService: UsersService,
    // private postsService: PostsService,
  ) {}

  // @ResolveField()
  // async posts(@Parent() author: User) {
  //   const { id } = author;

  //   return this.postsService.findFiltered({ authorId: id });
  // }

  @Query(() => User)
  usersFindOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<UserPrisma> {
    return this.usersService.findOne({ id });
  }

  @Query(() => [User], { nullable: true })
  usersFindFiltered(@Args('data') data: FindUsersInput): Promise<User[]> {
    return this.usersService.findFiltered(data);
  }
}
