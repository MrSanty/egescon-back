import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsArray,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Nombre del rol (debe ser único por empresa)',
    example: 'Supervisor de Contratos',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descripción detallada del rol',
    example: 'Encargado de supervisar la ejecución de los contratos.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'ID de la empresa a la que pertenece el rol',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  @IsUUID()
  companyId: string;

  @ApiProperty({
    description: 'Lista de IDs de los permisos asignados a este rol',
    example: [
      'c1f2b3a4-5d6e-7f8g-9h0i-jk1l2m3n4o5p',
      'd1e2f3a4-b5c6-d7e8-f9g0-h1i2j3k4l5m6',
    ],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  permissionIds?: string[];
}
