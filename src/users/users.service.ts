import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {

  constructor(
    private prisma: PrismaService
  ) {}


  async getUserById(id: string) {
    try {
      return await this.prisma.user.findUnique({
        where: { id }
      });
    } catch (error) {
      throw new Error('Usuario no encontrado');
    }
  }

  async filterUsersByEmail(email: string) {
    try {
      return await this.prisma.user.findMany({
        where: { email }
      });
    } catch (error) {
      throw new Error('Error al obtener usuarios');
    }
  }

  async createUser(data: any) {
    try {
      return await this.prisma.user.create({
        data
      });
    } catch (error) {
      throw new Error('Error al crear usuario');
    }
  }

  async updateUser(id: string, data: any) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data
      });
    } catch (error) {
      throw new Error('Error al actualizar usuario');
    }
  }

  async deleteUser(id: string) {
    try {
      return await this.prisma.user.delete({
        where: { id }
      });
    } catch (error) {
      throw new Error('Error al eliminar usuario');
    }
  }
}
