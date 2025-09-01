import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { PermissionEntity } from './permission.entity';

export class RoleEntity implements Role {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  companyId: string;
  createdAt: Date;
  updatedAt: Date;

  @ApiProperty({ type: () => [PermissionEntity] }) // Documentamos la relación
  permissions?: PermissionEntity[];

  constructor({ permissions, ...data }: Partial<RoleEntity>) {
    Object.assign(this, data);

    if (permissions) {
      this.permissions = permissions;
    }
  }
}
