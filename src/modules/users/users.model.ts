import 'reflect-metadata';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

import { Post } from '../posts/posts.model';

@ObjectType()
export class User {
  @Field((type) => Int)
  id: number;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  password: string;

  @Field((type) => String, { nullable: true })
  resetPasswordToken?: string | null;

  @Field((type) => Date, { nullable: true })
  resetPasswordExpiresAt?: Date | null;

  @Field((type) => Date)
  createdAt: Date;

  @Field((type) => Date)
  updatedAt: Date;

  @Field((type) => [Post], { nullable: true })
  posts?: Post[] | null;
}
