import { IPaginatedReply, IGoals } from 'fitness-tracker-contracts';
import { Model } from 'mongoose';
import nodemailer from 'nodemailer';

function getMonthGoal(goal: number) {
  return Math.floor(goal * 4.5);
}

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

  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject: 'App-fit.ru', text });
}

export const defaultColor = '#464181';
export const goalColor = '#bcbcbc';

export function getGoals(isMonth: boolean, isAverage: boolean, goals: IGoals) {
  if (isMonth) {
    return {
      activitiesGoal: getMonthGoal(goals.activities),
      setsGoal: isAverage ? goals.sets : goals.sets * getMonthGoal(goals.activities),
      repeatsGoal: isAverage ? goals.repeats * goals.sets : goals.repeats * goals.sets * getMonthGoal(goals.activities),
      durationGoal: isAverage ? goals.duration : goals.duration * getMonthGoal(goals.activities),
    };
  } else {
    return {
      activitiesGoal: goals.activities,
      setsGoal: isAverage ? goals.sets : goals.sets * goals.activities,
      repeatsGoal: isAverage ? goals.repeats * goals.sets : goals.repeats * goals.sets * goals.activities,
      durationGoal: isAverage ? goals.duration : goals.duration * goals.activities,
    };
  }
}
