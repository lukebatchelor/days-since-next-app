import { Tracker, Checkin } from '@prisma/client';

export function getDaysLeft(tracker: Tracker, checkins: Array<Checkin>) {
  const lastCheckin = checkins.filter((c) => c.tracker_id === tracker.id)[0];
  const lastCheckinDate = lastCheckin ? new Date(lastCheckin.checkin_date) : new Date();
  const daysBetween = getDaysBetween(lastCheckinDate, new Date());
  const daysLeft = tracker.expiry_days - daysBetween;
  return daysLeft;
}

export function getDaysBetween(d1: Date, d2: Date) {
  console.log({ d1, d2 });
  const d1Start = new Date(d1.toISOString().split('T')[0]);
  const d2Start = new Date(d2.toISOString().split('T')[0]);
  // @ts-ignore
  return Math.round(Math.abs(d1Start - d2Start) / (1000 * 60 * 60 * 24));
}
