import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { PayloadUser } from 'src/auth/types/types';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: createUserDto.email }, { docNum: createUserDto.docNum }],
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'Ya existe un usuario con este email o número de documento.',
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    return new UserEntity(newUser);
  }

  async findAll(user: PayloadUser): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      where: { companyId: user.companyId },
    });
    return users.map((user) => new UserEntity(user));
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }
    return new UserEntity(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return new UserEntity(updatedUser);
  }

  async remove(id: string): Promise<UserEntity> {
    await this.findOne(id);
    const deletedUser = await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
    return new UserEntity(deletedUser);
  }
}
