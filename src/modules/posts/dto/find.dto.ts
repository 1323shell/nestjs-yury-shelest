import { IsNumber, IsString } from 'class-validator';

export class FindOnePostDto {
  @IsNumber()
  id?: number;

  @IsString()
  title?: string;
}
