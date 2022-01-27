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
import { User } from '@prisma/client';

import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update.dto';
import { CreateUserDto } from './dto/create.dto';
import { FindOneUserDto } from './dto/find.dto';
import { FindUsersDto } from './dto/find-filtered.dto';

@Controller('users')
@Serialize(FindOneUserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne({ id });
  }

  @Get()
  findFiltered(@Query() query: FindUsersDto): Promise<User[]> {
    return this.usersService.findFiltered(query);
  }

  @Post()
  create(@Body() data: CreateUserDto): Promise<User> {
    return this.usersService.create(data);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.remove(id);
  }
}
