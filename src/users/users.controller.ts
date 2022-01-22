import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findFiltered(@Query() query: { email?: string }): Promise<User[]> {
    return this.usersService.findFiltered({
      where: {
        email: { contains: query.email },
      },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne({ id: parseInt(id, 10) });
  }

  @Post()
  create(@Body() data: { email: string; password: string }): Promise<User> {
    return this.usersService.create(data);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: { email?: string; password: string },
  ): Promise<User> {
    return this.usersService.update({
      data,
      where: { id: parseInt(id, 10) },
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove({ id: parseInt(id, 10) });
  }
}
