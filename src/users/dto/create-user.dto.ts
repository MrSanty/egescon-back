import { ApiProperty } from '@nestjs/swagger';
import { DocType } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario (debe ser único)',
    example: 'juan.perez@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 8 caracteres)',
    example: 'Password123!',
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @ApiProperty({
    description: 'Tipo de documento del usuario',
    enum: DocType,
    example: DocType.CC,
  })
  @IsEnum(DocType)
  docType: DocType;

  @ApiProperty({
    description: 'Número de documento del usuario (debe ser único)',
    example: '123456789',
  })
  @IsString()
  @IsNotEmpty()
  docNum: string;

  @ApiProperty({
    description: 'ID del rol asignado al usuario',
    example: 'c1f2b3a4-5d6e-7f8g-9h0i-jk1l2m3n4o5p',
  })
  @IsUUID()
  roleId: string;

  @ApiProperty({
    description: 'ID de la empresa a la que pertenece el usuario',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  @IsUUID()
  companyId: string;
}
