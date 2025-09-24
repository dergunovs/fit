import { RateLimitOptions } from '@fastify/rate-limit';
import { IPaginatedReply } from 'fitness-tracker-contracts';
import { LRUCache } from 'lru-cache';
import mongoose, { Model } from 'mongoose';
import nodemailer from 'nodemailer';

import { IPopulate } from './types.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lruCache = new LRUCache<string, any>({ max: 1000, ttl: 604800000, allowStale: false, updateAgeOnGet: false });

export const defaultColor = '#484195';
export const goalColor = '#bbb';

export const cache = {
  get<T>(key: string): T | undefined {
    return lruCache.get(key) as T | undefined;
  },

  set<T>(key: string, value: T) {
    lruCache.set(key, value);
  },

  delete(key: string) {
    lruCache.delete(key);
  },
};

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

export const rateLimit: RateLimitOptions = {
  max: Number(process.env.RATE_LIMIT_MAX) || 5,
  timeWindow: Number(process.env.RATE_LIMIT_TIME_WINDOW) || 10000,
  errorResponseBuilder: (_req, context) => ({
    message: 'Too many attempts. Try again later.',
    code: 429,
    retryAfter: context.after,
  }),
};
