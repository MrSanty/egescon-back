import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { CompanyModule } from './company/company.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, CompanyModule, RolesModule],
  providers: [PrismaService],
})
export class AppModule {}
