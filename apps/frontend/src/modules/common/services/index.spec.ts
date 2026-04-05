import { describe, it, expect, beforeEach, vi } from 'vitest';
import { API_UPLOAD_IMAGE, TPostUploadImageDTO } from 'fitness-tracker-contracts';

import { serviceMocks } from '@/common/mocks';

const FILE = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
const UPLOAD_RESPONSE: TPostUploadImageDTO = { url: 'uploads/test.jpg' };

describe('commonService', () => {
  let commonService: typeof import('@/common/services').commonService;

  beforeEach(async () => {
    vi.resetAllMocks();
    const mod = await import('@/common/services');

    commonService = mod.commonService;
  });

  it('uploadImage', async () => {
    serviceMocks.mutation.success(UPLOAD_RESPONSE);
    serviceMocks.http.mockPost<TPostUploadImageDTO>(UPLOAD_RESPONSE);

    const { mutate } = commonService.uploadImage({});

    mutate(FILE);

    expect(serviceMocks.useMutation).toHaveBeenCalledTimes(1);

    const lastMutation = serviceMocks.lastMutation;

    expect(lastMutation.mutationKey).toEqual([API_UPLOAD_IMAGE]);

    const result = await lastMutation.mutationFn(FILE);

    expect(result).toEqual(UPLOAD_RESPONSE);

    expect(serviceMocks.api.post).toHaveBeenCalledTimes(1);
    expect(serviceMocks.api.post).toHaveBeenCalledWith(API_UPLOAD_IMAGE, expect.any(FormData));

    const formData = serviceMocks.api.post.mock.calls[0][1] as FormData;

    expect(formData.has('file')).toBe(true);
    expect(formData.get('file')).toBe(FILE);
  });
});
