import { Expose, Type } from 'class-transformer';
import { Menu } from '@prisma/client';
import { MenuDto } from '../types/types';

export class LoginUserEntity {
  id: string;
  email: string;
  name: string;
  permissions: string[];

  @Type(() => MenuDto)
  menus: MenuDto[];

  constructor(partial: Partial<LoginUserEntity>) {
    Object.assign(this, partial);
  }
}
