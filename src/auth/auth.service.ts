import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Menu, User } from '@prisma/client';
import { LoginUserEntity } from './entities/login-user.entity';
import { LoginResponse, MenuDto, PayloadUser, Tokens } from './types/types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async _updateRefreshTokenHash(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });
  }

  private async _generateTokens(payload: PayloadUser): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async login({ email, password }: LoginDto): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: {
          select: {
            permissions: {
              select: {
                permission: {
                  select: {
                    action: true,
                    menus: {
                      select: {
                        id: true,
                        name: true,
                        icon: true,
                        parent: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException(
        'El usuario no existe o la contraseña es incorrecta.',
      );
    }

    const permissionsSet = new Set<string>();
    const menuMap = new Map<string, MenuDto>();

    user.role.permissions.forEach((rolePermission) => {
      permissionsSet.add(rolePermission.permission.action);
      rolePermission.permission.menus.forEach((menuItem) => {
        menuMap.set(menuItem.name, menuItem);
      });
    });

    const dataUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      permissions: [...permissionsSet],
      menus: [...menuMap.values()],
    };

    const tokens = await this._generateTokens({
      sub: user?.id,
      email: user?.email,
      name: user?.name,
      permissions: [...permissionsSet],
      menus: [...menuMap.values()],
    });

    await this._updateRefreshTokenHash(user.id, tokens.refreshToken);
    return {
      tokens: tokens,
      ...dataUser,
    };
  }

  async logout(userId: string): Promise<boolean> {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRefreshToken: { not: null },
      },
      data: { hashedRefreshToken: null },
    });
    return true;
  }

  async refreshToken(userId: string, refreshToken: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.hashedRefreshToken) {
      throw new ForbiddenException(
        'Token de actualización no válido, por favor inicie sesión nuevamente.',
      );
    }

    const tokensMatch = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );
    if (!tokensMatch) {
      throw new ForbiddenException(
        'Token de actualización no válido, por favor inicie sesión nuevamente.',
      );
    }

    const newTokens = await this._generateTokens({
      sub: user.id,
      email: user.email,
      name: user.name,
      permissions: [...permissionsSet],
      menus: [...menuMap.values()],
    });
    await this._updateRefreshTokenHash(user.id, newTokens.refreshToken);
    return newTokens;
  }
}
