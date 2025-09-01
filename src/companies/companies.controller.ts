import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { RequiredPermissions } from 'src/auth/decorators/permissions.decorator';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CompanyEntity } from './entities/company.entity';

@ApiCookieAuth()
@ApiTags('Compañías')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @RequiredPermissions('company:create')
  @ApiOperation({ summary: 'Crear una nueva compañía' })
  @ApiResponse({
    status: 201,
    description: 'Compañía creada.',
    type: CompanyEntity,
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido. Permisos insuficientes.',
  })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @RequiredPermissions('company:read')
  @ApiOperation({ summary: 'Obtener una lista de todas las compañías' })
  @ApiResponse({
    status: 200,
    description: 'Lista de compañías.',
    type: [CompanyEntity],
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido. Permisos insuficientes.',
  })
  findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  @RequiredPermissions('company:read')
  @ApiOperation({ summary: 'Obtener una compañía por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Compañía encontrada.',
    type: CompanyEntity,
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido. Permisos insuficientes.',
  })
  @ApiResponse({ status: 404, description: 'Compañía no encontrada.' })
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @RequiredPermissions('company:update')
  @ApiOperation({ summary: 'Actualizar una compañía por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Compañía actualizada.',
    type: CompanyEntity,
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido. Permisos insuficientes.',
  })
  @ApiResponse({ status: 404, description: 'Compañía no encontrada.' })
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @RequiredPermissions('company:delete')
  @ApiOperation({ summary: 'Eliminar una compañía por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Compañía eliminada.',
    type: CompanyEntity,
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido. Permisos insuficientes.',
  })
  @ApiResponse({ status: 404, description: 'Compañía no encontrada.' })
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}
