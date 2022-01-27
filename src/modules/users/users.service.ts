import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from 'src/db/prisma.service';
import { CreateUserDto } from './dto/create.dto';
import { FindUsersDto } from './dto/find-filtered.dto';
import { FindOneUserDto } from './dto/find.dto';
import { UpdateUserDto } from './dto/update.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(data: FindOneUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: data,
    });

    if (!user) {
      const message = `User with ${data.id ? 'id' : 'email'} ${
        data.id || data.email
      } is not found`;

      throw new NotFoundException(message);
    }

    return user;
  }

  findFiltered(data: FindUsersDto): Promise<User[]> {
    const { email, orderBy } = data;

    return this.prisma.user.findMany({
      orderBy,
      where: {
        email: { contains: email, mode: 'insensitive' },
      },
    });
  }

  create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  update(id: number, data: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      data,
      where: { id },
    });
  }

  remove(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
