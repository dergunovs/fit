import { describe, it, expect } from 'vitest';
import mongoose from 'mongoose';

import { checkInvalidId } from './helpers.js';

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
