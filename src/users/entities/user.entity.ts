import { Exclude } from 'class-transformer';
import { $Enums, User as PrismaUser } from '@prisma/client';

export class UserEntity implements PrismaUser {
  id: string;
  docType: $Enums.DocType;
  docNum: string;
  name: string;
  email: string;

  @Exclude()
  password: string;

  @Exclude()
  hashedRefreshToken: string | null;

  @Exclude()
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
  roleId: number;
  companyId: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
