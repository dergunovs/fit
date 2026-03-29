import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

import { PAGINATION_LIMIT, RATE_LIMIT_MAX, RATE_LIMIT_TIME_WINDOW } from './constants.ts';

vi.mock('nodemailer');

let checkInvalidId: typeof import('./helpers.ts').checkInvalidId;
let paginate: typeof import('./helpers.ts').paginate;
let sendMail: typeof import('./helpers.ts').sendMail;
let getRateLimit: () => Promise<typeof import('./helpers.ts').rateLimit>;

beforeEach(async () => {
  vi.resetModules();

  const helpers = await import('./helpers.ts');

  checkInvalidId = helpers.checkInvalidId;
  paginate = helpers.paginate;
  sendMail = helpers.sendMail;
  getRateLimit = async () => {
    const helpersModule = await import('./helpers.ts');

    return helpersModule.rateLimit;
  };
});

describe('checkInvalidId', () => {
  it('does not throw for valid MongoDB ObjectId', () => {
    const validId = new mongoose.Types.ObjectId().toString();

    expect(() => checkInvalidId(validId)).not.toThrow();
  });

  it('throws badRequest error for invalid ObjectId', () => {
    expect(() => checkInvalidId('invalid-id')).toThrow('Bad request');
  });

  it('throws badRequest error for empty string', () => {
    expect(() => checkInvalidId('')).toThrow('Bad request');
  });

  it('throws badRequest error for malformed ObjectId', () => {
    expect(() => checkInvalidId('123')).toThrow('Bad request');
  });

  it('throws badRequest error for ObjectId with wrong length', () => {
    expect(() => checkInvalidId('507f1f77bcf86cd79943901')).toThrow('Bad request');
  });
});

describe('paginate', () => {
  const mockData = [{ _id: '1', name: 'Test' }];

  const createMockEntity = (count: number, data: typeof mockData) => {
    const leanMock = vi.fn().mockResolvedValue(data);
    const sortMock = vi.fn().mockReturnValue({ lean: leanMock });
    const selectMock = vi.fn().mockReturnValue({ sort: sortMock });
    const populateMock = vi.fn().mockReturnValue({ select: selectMock });
    const limitMock = vi.fn().mockReturnValue({ populate: populateMock });
    const skipMock = vi.fn().mockReturnValue({ limit: limitMock });

    return {
      countDocuments: vi.fn().mockResolvedValue(count),
      find: vi.fn().mockReturnValue({ skip: skipMock }),
      mocks: { skipMock, limitMock, populateMock, selectMock, sortMock, leanMock },
    };
  };

  it('returns paginated data with default page 1', async () => {
    const mockEntity = createMockEntity(50, mockData);
    const result = await paginate(mockEntity as unknown as mongoose.Model<unknown>);

    expect(result.data).toEqual(mockData);
    expect(result.total).toBe(Math.ceil(50 / PAGINATION_LIMIT));
  });

  it('calculates correct skip for page 1', async () => {
    const mockEntity = createMockEntity(50, mockData);

    await paginate(mockEntity as unknown as mongoose.Model<unknown>, 1);

    expect(mockEntity.mocks.skipMock).toHaveBeenCalledWith(0);
  });

  it('calculates correct skip for page 2', async () => {
    const mockEntity = createMockEntity(50, mockData);

    await paginate(mockEntity as unknown as mongoose.Model<unknown>, 2);

    expect(mockEntity.mocks.skipMock).toHaveBeenCalledWith(PAGINATION_LIMIT);
  });

  it('calculates correct skip for page 3', async () => {
    const mockEntity = createMockEntity(50, mockData);

    await paginate(mockEntity as unknown as mongoose.Model<unknown>, 3);

    expect(mockEntity.mocks.skipMock).toHaveBeenCalledWith(2 * PAGINATION_LIMIT);
  });

  it('uses default sort when not provided', async () => {
    const mockEntity = createMockEntity(50, mockData);

    await paginate(mockEntity as unknown as mongoose.Model<unknown>);

    expect(mockEntity.mocks.sortMock).toHaveBeenCalledWith('-dateCreated');
  });

  it('uses custom sort when provided', async () => {
    const mockEntity = createMockEntity(50, mockData);

    await paginate(mockEntity as unknown as mongoose.Model<unknown>, 1, 'name');

    expect(mockEntity.mocks.sortMock).toHaveBeenCalledWith('name');
  });

  it('passes populate parameter correctly', async () => {
    const mockEntity = createMockEntity(50, mockData);
    const populateOptions = [{ path: 'user', select: 'name' }];

    await paginate(mockEntity as unknown as mongoose.Model<unknown>, 1, undefined, populateOptions);

    expect(mockEntity.mocks.populateMock).toHaveBeenCalledWith(populateOptions);
  });

  it('uses empty array for populate when not provided', async () => {
    const mockEntity = createMockEntity(50, mockData);

    await paginate(mockEntity as unknown as mongoose.Model<unknown>);

    expect(mockEntity.mocks.populateMock).toHaveBeenCalledWith([]);
  });

  it('handles pageQuery as string', async () => {
    const mockEntity = createMockEntity(50, mockData);
    const result = await paginate(mockEntity as unknown as mongoose.Model<unknown>, '3' as unknown as number);

    expect(result.data).toEqual(mockData);
    expect(mockEntity.mocks.skipMock).toHaveBeenCalledWith(2 * PAGINATION_LIMIT);
  });

  it('treats NaN pageQuery as page 1', async () => {
    const mockEntity = createMockEntity(50, mockData);
    const result = await paginate(mockEntity as unknown as mongoose.Model<unknown>, Number.NaN);

    expect(result.data).toEqual(mockData);
    expect(mockEntity.mocks.skipMock).toHaveBeenCalledWith(0);
  });

  it('calculates total pages correctly', async () => {
    const mockEntity = createMockEntity(72, mockData);
    const result = await paginate(mockEntity as unknown as mongoose.Model<unknown>);

    expect(result.total).toBe(3);
  });

  it('excludes password field in select', async () => {
    const mockEntity = createMockEntity(50, mockData);

    await paginate(mockEntity as unknown as mongoose.Model<unknown>);

    expect(mockEntity.mocks.selectMock).toHaveBeenCalledWith('-password');
  });

  it('applies limit from PAGINATION_LIMIT constant', async () => {
    const mockEntity = createMockEntity(50, mockData);

    await paginate(mockEntity as unknown as mongoose.Model<unknown>);

    expect(mockEntity.mocks.limitMock).toHaveBeenCalledWith(PAGINATION_LIMIT);
  });
});

describe('sendMail', () => {
  const mockSendMail = vi.fn().mockResolvedValue({});
  const mockTransporter = {
    sendMail: mockSendMail,
  };

  beforeEach(() => {
    vi.stubEnv('EMAIL_SMTP', 'smtp.example.com');
    vi.stubEnv('EMAIL_USER', 'user@example.com');
    vi.stubEnv('EMAIL_PASSWORD', 'password123');
    (nodemailer.createTransport as ReturnType<typeof vi.fn>).mockReturnValue(mockTransporter);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('sends email with correct parameters', async () => {
    await sendMail('Test message', 'recipient@example.com');

    expect(mockSendMail).toHaveBeenCalledWith({
      from: 'user@example.com',
      to: 'recipient@example.com',
      subject: 'App-fit.ru',
      text: 'Test message',
    });
  });

  it('throws internal error when EMAIL_SMTP is not configured', async () => {
    vi.stubEnv('EMAIL_SMTP', '');

    await expect(sendMail('Test', 'to@example.com')).rejects.toThrow('Internal server error');
  });

  it('creates transporter with correct SMTP settings', async () => {
    await sendMail('Test', 'to@example.com');

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: 'smtp.example.com',
      port: 465,
      secure: true,
      auth: { user: 'user@example.com', pass: 'password123' },
    });
  });
});

describe('rateLimit', () => {
  it('has correct default max value', async () => {
    const rateLimitConfig = await getRateLimit();

    expect(rateLimitConfig.max).toBe(RATE_LIMIT_MAX);
  });

  it('has correct default timeWindow value', async () => {
    const rateLimitConfig = await getRateLimit();

    expect(rateLimitConfig.timeWindow).toBe(RATE_LIMIT_TIME_WINDOW);
  });

  it('uses environment variables when provided', async () => {
    vi.stubEnv('RATE_LIMIT_MAX', '10');
    vi.stubEnv('RATE_LIMIT_TIME_WINDOW', '60000');

    vi.resetModules();

    const { rateLimit: rateLimitConfig } = await import('./helpers.ts');

    expect(rateLimitConfig.max).toBe(10);
    expect(rateLimitConfig.timeWindow).toBe(60000);

    vi.unstubAllEnvs();
  });

  it('errorResponseBuilder returns correct format', async () => {
    const rateLimitConfig = await getRateLimit();
    const mockReq = {} as Parameters<NonNullable<typeof rateLimitConfig.errorResponseBuilder>>[0];
    const mockContext = {
      statusCode: 429,
      ban: false,
      max: 5,
      ttl: 10000,
      after: '30 seconds',
    } as Parameters<NonNullable<typeof rateLimitConfig.errorResponseBuilder>>[1];

    const result = rateLimitConfig.errorResponseBuilder?.(mockReq, mockContext);

    expect(result).toEqual({ message: 'Too many attempts. Try again later.', code: 429, retryAfter: '30 seconds' });
  });
});
