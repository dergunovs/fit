import { vi } from 'vitest';
import { TPostUploadImageDataDTO, TPostUploadImageDTO } from 'fitness-tracker-contracts';

import { mockMutationReply } from '@/common/mocks';
import { IOnSuccess } from '@/common/interface';
import { commonService } from '@/common/services';

const spyUploadImage = vi.fn();

const mockOnSuccess: IOnSuccess = {
  uploadImage: undefined,
};

vi.spyOn(commonService, 'uploadImage').mockImplementation((options: { onSuccess?: () => Promise<void> }) => {
  if (options.onSuccess) mockOnSuccess.login = options.onSuccess;

  return mockMutationReply<TPostUploadImageDTO, TPostUploadImageDataDTO>(spyUploadImage);
});

export { spyUploadImage };
