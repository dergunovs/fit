import { IPaginatedReply } from 'fitness-tracker-contracts';
import { Model } from 'mongoose';
import nodemailer from 'nodemailer';

import { IWeekDays } from './types.js';

export function getDatesByDayGap(gap: number) {
  const day = 86400000;

  const dateTo = new Date();
  const dateFrom = new Date(dateTo.getTime() - gap * day);

  const dateToPrev = new Date(dateFrom.getTime() - 1);
  const dateFromPrev = new Date(dateToPrev.getTime() - gap * day);

  return { dateFrom, dateTo, dateFromPrev, dateToPrev };
}

export function getFirstAndLastWeekDays(weeksCount: number) {
  const days: IWeekDays[] = [];

  for (let i = 0; i < weeksCount; i++) {
    const today = new Date();

    const firstDay = new Date(
      today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1) - i * 7)
    );

    const lastDay = new Date(today.setDate(today.getDate() - today.getDay() + 7));

    firstDay.setHours(0, 0, 0, 0);
    lastDay.setHours(23, 59, 59);

    days.push({
      dateFrom: firstDay,
      dateTo: lastDay,
      label: `${firstDay.toLocaleDateString('ru').slice(0, -5)} - ${lastDay.toLocaleDateString('ru').slice(0, -5)}`,
    });
  }

  return days.reverse();
}

export async function paginate<T>(
  Entity: Model<T>,
  pageQuery?: number,
  sort?: string,
  populate?: { path: string; select?: string[]; populate?: { path: string; select: string[] } }[]
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

export function getDynamics(cur: number, prev: number) {
  return Math.round(((cur - prev) / cur) * 100) || 0;
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
