import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Nombre de la compañía (debe ser único)',
    example: 'Constructora XYZ S.A.S.',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'NIT de la compañía (debe ser único)',
    example: '900.987.654-1',
  })
  @IsString()
  @IsNotEmpty()
  nit: string;
}
