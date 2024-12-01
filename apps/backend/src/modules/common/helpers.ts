import { IPaginatedReply } from 'fitness-tracker-contracts';
import { Model } from 'mongoose';

export function getFirstAndLastWeekDays(weeksCount: number) {
  const days = [];

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

export async function paginate<T>(Entity: Model<T>, pageQuery?: number, sort?: string): Promise<IPaginatedReply<T>> {
  const page = Number(pageQuery) || 1;

  const limit = 24;

  const count = await Entity.find().countDocuments().exec();

  const total = Math.ceil(count / limit);

  const data = (await Entity.find()
    .find()
    .skip((page - 1) * limit)
    .limit(limit)
    .select('-password')
    .sort(sort || '-dateCreated')
    .lean()
    .exec()) as T[];

  return {
    data,
    total,
  };
}
