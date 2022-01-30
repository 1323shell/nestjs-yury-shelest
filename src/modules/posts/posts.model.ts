import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';

import { User } from '../users/users.model';

@ObjectType()
export class Post {
  @Field((type) => Int)
  id: number;

  @Field()
  title: string;

  @Field((type) => String, { nullable: true })
  content?: string;

  @Field((type) => Date)
  createdAt: Date;

  @Field((type) => Date)
  updatedAt: Date;

  @Field((type) => User, { nullable: true })
  author?: User | null;
}
