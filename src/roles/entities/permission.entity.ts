import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '@prisma/client';

export class PermissionEntity implements Permission {
  @ApiProperty()
  id: string;

  @ApiProperty()
  action: string;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  constructor(partial: Partial<PermissionEntity>) {
    Object.assign(this, partial);
  }
}
