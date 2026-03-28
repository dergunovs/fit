import { RateLimitOptions } from '@fastify/rate-limit';
import { IPaginatedReply } from 'fitness-tracker-contracts';
import mongoose, { Model } from 'mongoose';
import nodemailer from 'nodemailer';

import { error } from './errorHandler.js';
import { IPopulate } from './types.js';
import { EMAIL_PORT, EMAIL_SUBJECT, PAGINATION_LIMIT, RATE_LIMIT_MAX, RATE_LIMIT_TIME_WINDOW } from './constants.js';

let emailTransporter: nodemailer.Transporter | null = null;

function getEmailTransporter(): nodemailer.Transporter | null {
  if (!emailTransporter && process.env.EMAIL_SMTP) {
    emailTransporter = nodemailer.createTransport({
      host: process.env.EMAIL_SMTP,
      port: EMAIL_PORT,
      secure: true,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
    });
  }

  return emailTransporter;
}

export function checkInvalidId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw error.badRequest();
  }
}

export async function paginate<T>(
  Entity: Model<T>,
  pageQuery?: number,
  sort?: string,
  populate?: IPopulate[]
): Promise<IPaginatedReply<T>> {
  const page = Number(pageQuery) || 1;

  const [count, data] = await Promise.all([
    Entity.countDocuments(),
    Entity.find()
      .skip((page - 1) * PAGINATION_LIMIT)
      .limit(PAGINATION_LIMIT)
      .populate(populate || [])
      .select('-password')
      .sort(sort || '-dateCreated')
      .lean() as Promise<T[]>,
  ]);

  const total = Math.ceil(count / PAGINATION_LIMIT);

  return { data, total };
}

export async function sendMail(text: string, to: string) {
  const transporter = getEmailTransporter();

  if (!transporter) throw error.internal();

  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject: EMAIL_SUBJECT, text });
}

export const rateLimit: RateLimitOptions = {
  max: Number(process.env.RATE_LIMIT_MAX) || RATE_LIMIT_MAX,
  timeWindow: Number(process.env.RATE_LIMIT_TIME_WINDOW) || RATE_LIMIT_TIME_WINDOW,
  errorResponseBuilder: (_req, context) => ({
    message: 'Too many attempts. Try again later.',
    code: 429,
    retryAfter: context.after,
  }),
};
