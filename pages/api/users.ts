import { prisma, PrismaClient } from '@prisma/client';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import UserService from 'services/UserService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const users = await UserService.getAllUsers();
  res.send(JSON.stringify({ users }));
}
