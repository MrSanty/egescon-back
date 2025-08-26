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

interface LoginResponse extends LoginUserEntity {
  tokens: Tokens;
}

export class PayloadUser {
  id: string;
  email: string;
  name: string;
  permissions: string[];
  menus: MenuDto[];
}

export interface UserPermissions {
  actions: string[];
  menus: MenuDto[];
}
