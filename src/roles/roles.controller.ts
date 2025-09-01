import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequiredPermissions } from 'src/auth/decorators/permissions.decorator';
import { RoleEntity } from './entities/role.entity';
import { PayloadUser } from 'src/auth/types/types';
import type { Request } from 'express';

@ApiCookieAuth()
@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @RequiredPermissions('role:create')
  @ApiOperation({ summary: 'Crear un nuevo rol' })
  @ApiResponse({ status: 201, description: 'Rol creado.', type: RoleEntity })
  @ApiResponse({
    status: 403,
    description: 'Prohibido. Permisos insuficientes.',
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @RequiredPermissions('role:read')
  @ApiOperation({ summary: 'Obtener una lista de todos los roles' })
  @ApiResponse({
    status: 200,
    description: 'Lista de roles.',
    type: [RoleEntity],
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido. Permisos insuficientes.',
  })
  findAll(@Req() req: Request) {
    const user = req.user as PayloadUser;
    return this.rolesService.findAll(user);
  }

  @Get(':id')
  @RequiredPermissions('role:read')
  @ApiOperation({ summary: 'Obtener un rol por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Rol encontrado.',
    type: RoleEntity,
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido. Permisos insuficientes.',
  })
  @ApiResponse({ status: 404, description: 'Rol no encontrado.' })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @RequiredPermissions('role:update')
  @ApiOperation({ summary: 'Actualizar un rol por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Rol actualizado.',
    type: RoleEntity,
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido. Permisos insuficientes.',
  })
  @ApiResponse({ status: 404, description: 'Rol no encontrado.' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @RequiredPermissions('role:delete')
  @ApiOperation({ summary: 'Eliminar un rol por su ID' })
  @ApiResponse({ status: 200, description: 'Rol eliminado.', type: RoleEntity })
  @ApiResponse({
    status: 403,
    description: 'Prohibido. Permisos insuficientes.',
  })
  @ApiResponse({ status: 404, description: 'Rol no encontrado.' })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
