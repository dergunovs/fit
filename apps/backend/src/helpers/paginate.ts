import { IPaginatedReply } from 'fitness-tracker-contracts';
import { Model } from 'mongoose';

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
