import { IPaginatedReply } from 'fitness-tracker-contracts';
import { Model } from 'mongoose';
import nodemailer from 'nodemailer';

export async function paginate<T>(
  Entity: Model<T>,
  pageQuery?: number,
  sort?: string,
  populate?: { path: string; select?: string[]; populate?: { path: string; select: string[] }[] }[]
): Promise<IPaginatedReply<T>> {
  const page = Number(pageQuery) || 1;

  const limit = 24;

  const count = await Entity.find().countDocuments().exec();

  const total = Math.ceil(count / limit);

  const data = (await Entity.find()
    .find()
    .skip((page - 1) * limit)
    .limit(limit)
    .populate(populate || [])
    .select('-password')
    .sort(sort || '-dateCreated')
    .lean()
    .exec()) as T[];

  return {
    data,
    total,
  };
}

export async function sendMail(text: string, to: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP,
    port: 465,
    secure: true,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
  });

  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject: 'Сообщение от app-fit.ru', text });
}
