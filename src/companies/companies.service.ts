import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompanyEntity } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<CompanyEntity> {
    const existingCompany = await this.prisma.company.findFirst({
      where: {
        OR: [{ name: createCompanyDto.name }, { nit: createCompanyDto.nit }],
      },
    });

    if (existingCompany) {
      throw new ConflictException(
        'Ya existe una compañía con este nombre o NIT.',
      );
    }

    const company = await this.prisma.company.create({
      data: createCompanyDto,
    });
    return new CompanyEntity(company);
  }

  async findAll(): Promise<CompanyEntity[]> {
    const companies = await this.prisma.company.findMany();
    return companies.map((company) => new CompanyEntity(company));
  }

  async findOne(id: string): Promise<CompanyEntity> {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Compañía con ID "${id}" no encontrada.`);
    }
    return new CompanyEntity(company);
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<CompanyEntity> {
    await this.findOne(id);

    if (updateCompanyDto.name || updateCompanyDto.nit) {
      const existingCompany = await this.prisma.company.findFirst({
        where: {
          OR: [{ name: updateCompanyDto.name }, { nit: updateCompanyDto.nit }],
          NOT: { id: id },
        },
      });

      if (existingCompany) {
        throw new ConflictException(
          'Ya existe otra compañía con este nombre o NIT.',
        );
      }
    }

    const updatedCompany = await this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
    });
    return new CompanyEntity(updatedCompany);
  }

  async remove(id: string): Promise<CompanyEntity> {
    const company = await this.findOne(id);

    await this.prisma.company.delete({ where: { id } });

    return company;
  }
}
