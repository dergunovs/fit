import { RateLimitOptions } from '@fastify/rate-limit';
import { IPaginatedReply } from 'fitness-tracker-contracts';
import mongoose, { Model } from 'mongoose';
import nodemailer from 'nodemailer';

import { IPopulate } from './types.js';

let emailTransporter: nodemailer.Transporter | null = null;

function getEmailTransporter(): nodemailer.Transporter | null {
  if (!emailTransporter && process.env.EMAIL_SMTP) {
    emailTransporter = nodemailer.createTransport({
      host: process.env.EMAIL_SMTP,
      port: 465,
      secure: true,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
    });
  }

  return emailTransporter;
}

export const defaultColor = '#484195';
export const goalColor = '#bbb';

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
  const transporter = getEmailTransporter();

  if (!transporter) throw new Error('Email transporter not configured');

  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject: 'App-fit.ru', text });
}

export const rateLimit: RateLimitOptions = {
  max: Number(process.env.RATE_LIMIT_MAX) || 5,
  timeWindow: Number(process.env.RATE_LIMIT_TIME_WINDOW) || 10000,
  errorResponseBuilder: (_req, context) => ({
    message: 'Too many attempts. Try again later.',
    code: 429,
    retryAfter: context.after,
  }),
};
