import { LoginUserEntity } from '../entities/login-user.entity';

export class MenuDto {
  id: string;
  name: string;
  icon: string;
  parent: string | null;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends LoginUserEntity {
  tokens: Tokens;
}

export class PayloadUser {
  id: string;
  email: string;
  name: string;
  companyId: string;
  permissions: string[];
  menus: MenuDto[];
}

export interface UserPermissions {
  actions: string[];
  menus: MenuDto[];
}
