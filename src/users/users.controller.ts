import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequiredPermissions } from 'src/auth/decorators/permissions.decorator';
import {
  ApiTags,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import type { Request } from 'express';
import { PayloadUser } from 'src/auth/types/types';

@ApiCookieAuth() // Indica que todos los endpoints aquí requieren autenticación
@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequiredPermissions('user:create')
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'El usuario ha sido creado exitosamente.',
    type: UserEntity,
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido. Permisos insuficientes.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto. Email o documento ya existen.',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @RequiredPermissions('user:read')
  @ApiOperation({ summary: 'Obtener una lista de todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios recuperada exitosamente.',
    type: [UserEntity],
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido. Permisos insuficientes.',
  })
  findAll(@Req() req: Request) {
    const user = req.user as PayloadUser;
    return this.usersService.findAll(user);
  }

  @Get(':id')
  @RequiredPermissions('user:read')
  @ApiOperation({ summary: 'Obtener un usuario por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado.',
    type: UserEntity,
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido. Permisos insuficientes.',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @RequiredPermissions('user:update')
  @ApiOperation({ summary: 'Actualizar un usuario por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado.',
    type: UserEntity,
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido. Permisos insuficientes.',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @RequiredPermissions('user:delete')
  @ApiOperation({ summary: 'Eliminar un usuario por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado.',
    type: UserEntity,
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido. Permisos insuficientes.',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
