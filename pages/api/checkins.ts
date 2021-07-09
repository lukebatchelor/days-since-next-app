import { NextApiHandler } from 'next';
import { prisma, PrismaClient } from '@prisma/client';
import { DeleteCheckinsReq, PostCheckinsReq } from 'typings/api';
import { getSession } from 'next-auth/client';

const prismaClient = new PrismaClient();

const createCheckin: NextApiHandler = async (req, res) => {
  try {
    const session = await getSession({ req });
    const { date, trackerId }: PostCheckinsReq = JSON.parse(req.body);
    const checkin = await prismaClient.checkin.create({
      data: { checkin_date: date, tracker_id: trackerId, userId: session.user.id },
    });
    return res.status(200).send({ checkin });
  } catch (err) {
    console.error(err);
    return res.status(500).end('Internal server error');
  }
};

const getCheckins: NextApiHandler = async (req, res) => {
  try {
    const checkins = await prismaClient.checkin.findMany({ orderBy: { checkin_date: 'desc' } });
    return res.status(200).json({ checkins });
  } catch (err) {
    return res.status(500).end('Internal server error');
  }
};

const editCheckin: NextApiHandler = async (req, res) => {
  try {
    return res.status(200).json({});
  } catch (err) {
    return res.status(500).end('Internal server error');
  }
};

const removeCheckin: NextApiHandler = async (req, res) => {
  try {
    const { checkinId }: DeleteCheckinsReq = JSON.parse(req.body);
    await prismaClient.checkin.delete({ where: { id: checkinId } });
    return res.status(200).json({});
  } catch (error) {
    return res.status(500).end('Internal server error');
  }
};

const handler: NextApiHandler = (req, res) => {
  switch (req.method) {
    case 'POST':
      return createCheckin(req, res);
    case 'GET':
      return getCheckins(req, res);
    case 'PUT':
      return editCheckin(req, res);
    case 'DELETE':
      return removeCheckin(req, res);
    default:
      return res.status(404).json({
        statusCode: 404,
        message: 'Not Found',
      });
  }
};

export default handler;
