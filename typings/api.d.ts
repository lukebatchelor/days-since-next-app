import { User } from '@prisma/client';

declare type GetUsersResponse = {
  users: Array<User>;
};
declare type PostUsersRequest = {
  name: string;
  expiryDays: number;
};
