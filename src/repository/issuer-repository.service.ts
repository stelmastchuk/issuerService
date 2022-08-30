import { Injectable } from '@nestjs/common';
import { Issuer, Prisma } from '@prisma/client';
import { PrismaService } from '../database/connection/connectionPrisma.service';

@Injectable()
export class IssuerRepositoryService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.IssuerWhereUniqueInput,
  ): Promise<Issuer | null> {
    return this.prisma.issuer.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(): Promise<Issuer[]> {
    return this.prisma.issuer.findMany();
  }

  async createUser(data: Prisma.IssuerCreateInput): Promise<Issuer> {
    return this.prisma.issuer.create({
      data,
    });
  }

  async updateUser(params: {
    where: Prisma.IssuerWhereUniqueInput;
    data: Prisma.IssuerUpdateInput;
  }): Promise<Issuer> {
    const { where, data } = params;
    return this.prisma.issuer.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.IssuerWhereUniqueInput): Promise<Issuer> {
    return this.prisma.issuer.delete({
      where,
    });
  }
}
