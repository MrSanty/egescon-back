import { Expose, Type } from 'class-transformer';
import { Menu, User } from '@prisma/client';
import { Tokens } from '../auth.service';

class UserData {
  @Expose() name: string;
  @Expose() email: string;
}

export class LoginUserEntity {
  @Type(() => UserData)
  user: UserData;

  tokens: Tokens;

  @Expose()
  get permissions(): string[] {
    const permissionsSet = new Set<string>();

    if (this.internalUser.roles) {
      for (const role of this.internalUser.roles) {
        if (role.permissions) {
          for (const rolePermission of role.permissions) {
            permissionsSet.add(rolePermission.permission.action);
          }
        }
      }
    }
    return Array.from(permissionsSet);
  }

  @Expose()
  get menu(): Menu[] {
    const menuMap = new Map<string, Menu>();
    if (this.internalUser?.roles) {
      for (const role of this.internalUser.roles) {
        if (role.permissions) {
          for (const rolePermission of role.permissions) {
            if (rolePermission.permission.menus) {
              for (const menuItem of rolePermission.permission.menus) {
                menuMap.set(menuItem.name, menuItem);
              }
            }
          }
        }
      }
    }
    return Array.from(menuMap.values());
  }

  @Type(() => Object)
  private internalUser: any;

  constructor(partial: { tokens: Tokens; user: User }) {
    this.tokens = partial.tokens;
    this.user = partial.user;
    this.internalUser = partial.user;
  }
}
