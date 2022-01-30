import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { Post } from './posts.model';
import { PostsService } from './posts.service';

@Resolver((of) => Post)
export class PostsResolver {
  constructor(private postsService: PostsService) {}

  // @Query((returns) => Post)
  // async post(@Args('id', { type: () => Int }) id: number) {
  //   return this.postsService.findOne({ id });
  // }

  // @ResolveField()
  // async posts(@Parent() post: Post) {
  //   const { content, title } = post;

  //   return this.postsService.findFiltered({ content, title });
  // }
}
