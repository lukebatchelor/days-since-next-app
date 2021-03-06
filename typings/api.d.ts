import { User } from '@prisma/client';

declare type GetUsersResponse = {
  users: Array<User>;
};
declare type PostUsersRequest = {
  name: string;
  expiryDays: number;
};
declare type PostCheckinsReq = {
  date: Date;
  trackerId: number;
};
declare type DeleteCheckinsReq = {
  checkinId: number;
};

// Trackers
declare type DeleteTrackerReq = {
  trackerId: number;
};
