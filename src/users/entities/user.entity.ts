import { Exclude } from 'class-transformer';
import { User, DocType } from '@prisma/client';

export class UserEntity implements User {
  id: string;
  docType: DocType;
  docNum: string;
  name: string;
  email: string;
  isActive: boolean;

  @Exclude()
  password: string;

  @Exclude()
  hashedRefreshToken: string | null;

  createdAt: Date;
  updatedAt: Date;
  roleId: string;
  companyId: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
