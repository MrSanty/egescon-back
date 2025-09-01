import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleEntity } from './entities/role.entity';
import { PayloadUser } from 'src/auth/types/types';

@Injectable()
export class RolesService {
  private readonly includePermissions = {
    permissions: {
      select: {
        permission: {
          select: { id: true, action: true, description: true },
        },
      },
    },
  };

  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const { permissionIds, ...roleData } = createRoleDto;

    const existingRole = await this.prisma.role.findUnique({
      where: {
        name_companyId: { name: roleData.name, companyId: roleData.companyId },
      },
    });
    if (existingRole) {
      throw new ConflictException(
        'Ya existe un rol con este nombre en la empresa.',
      );
    }

    const role = await this.prisma.role.create({ data: roleData });

    if (permissionIds && permissionIds.length > 0) {
      await this.prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId: role.id,
          permissionId,
        })),
      });
    }

    return this.findOne(role.id);
  }

  async findAll(user: PayloadUser): Promise<RoleEntity[]> {
    const roles = await this.prisma.role.findMany({
      include: this.includePermissions,
      where: { companyId: user.companyId },
    });
    return roles.map(
      (role) =>
        new RoleEntity({
          ...role,
          permissions: role.permissions.map((p) => p.permission),
        }),
    );
  }

  async findOne(id: string): Promise<RoleEntity> {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: this.includePermissions,
    });

    if (!role) {
      throw new NotFoundException(`Rol con ID "${id}" no encontrado.`);
    }

    return new RoleEntity({
      ...role,
      permissions: role.permissions.map((p) => p.permission),
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleEntity> {
    const { permissionIds, ...roleData } = updateRoleDto;

    return this.prisma.$transaction(async (tx) => {
      const role = await tx.role.update({
        where: { id },
        data: roleData,
      });

      if (permissionIds !== undefined) {
        await tx.rolePermission.deleteMany({ where: { roleId: id } });
        if (permissionIds.length > 0) {
          await tx.rolePermission.createMany({
            data: permissionIds.map((permissionId) => ({
              roleId: id,
              permissionId,
            })),
          });
        }
      }

      const updatedRole = await this.findOne(id);
      return updatedRole;
    });
  }

  async remove(id: string): Promise<RoleEntity> {
    const role = await this.findOne(id);
    await this.prisma.role.delete({ where: { id } });
    return role;
  }
}
