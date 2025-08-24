import { IPaginatedReply } from 'fitness-tracker-contracts';
import mongoose, { Model } from 'mongoose';
import nodemailer from 'nodemailer';

import { IPopulate } from './types.js';

export function checkInvalidId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID', { cause: { code: 500 } });
  }
}

export async function paginate<T>(
  Entity: Model<T>,
  pageQuery?: number,
  sort?: string,
  populate?: IPopulate[]
): Promise<IPaginatedReply<T>> {
  const page = Number(pageQuery) || 1;

  const limit = 24;

  const count = await Entity.countDocuments();

  const total = Math.ceil(count / limit);

  const data = (await Entity.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .populate(populate || [])
    .select('-password')
    .sort(sort || '-dateCreated')
    .lean()) as T[];

  return { data, total };
}

export async function sendMail(text: string, to: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP,
    port: 465,
    secure: true,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
  });

  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject: 'App-fit.ru', text });
}

export const defaultColor = '#464181';
export const goalColor = '#bcbcbc';
