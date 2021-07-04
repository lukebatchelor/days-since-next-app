import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

export default class UserService {
  static async getAllUsers() {
    const users =  await prismaClient.user.findMany();
    return users;
  }
}