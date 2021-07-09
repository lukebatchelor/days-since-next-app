import { DeleteTrackerReq, PostUsersRequest } from 'typings/api';
import { NextApiHandler } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/client';

const prismaClient = new PrismaClient();

const createTracker: NextApiHandler = async (req, res) => {
  try {
    const session = await getSession({ req });
    const { name, expiryDays }: PostUsersRequest = JSON.parse(req.body);
    const tracker = await prismaClient.tracker.create({
      data: { name, expiry_days: Number(expiryDays), userId: session.user.id },
    });
    return res.status(200).send({ tracker });
  } catch (err) {
    console.error(err);
    return res.status(500).end('Internal server error');
  }
};

const getTrackers: NextApiHandler = async (req, res) => {
  try {
    const trackers = await prismaClient.tracker.findMany();
    return res.status(200).json({ trackers });
  } catch (err) {
    return res.status(500).end('Internal server error');
  }
};

const editTracker: NextApiHandler = async (req, res) => {
  try {
    return res.status(200).json({});
  } catch (err) {
    return res.status(500).end('Internal server error');
  }
};

const removeTracker: NextApiHandler = async (req, res) => {
  try {
    const { trackerId }: DeleteTrackerReq = JSON.parse(req.body);
    await prismaClient.tracker.delete({ where: { id: trackerId } });
    return res.status(200).json({});
  } catch (error) {
    console.error(error);
    return res.status(500).end('Internal server error');
  }
};

const handler: NextApiHandler = (req, res) => {
  switch (req.method) {
    case 'POST':
      return createTracker(req, res);
    case 'GET':
      return getTrackers(req, res);
    case 'PUT':
      return editTracker(req, res);
    case 'DELETE':
      return removeTracker(req, res);
    default:
      return res.status(404).json({
        statusCode: 404,
        message: 'Not Found',
      });
  }
};

export default handler;
