import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindUsersInput {
  @Field({ nullable: true })
  email: string;
}
