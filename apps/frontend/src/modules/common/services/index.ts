import { API_UPLOAD_IMAGE, TPostUploadImageDTO, TPostUploadImageDataDTO } from 'fitness-tracker-contracts';
import { useMutation, api } from 'mhz-helpers';

export const commonService = {
  uploadImage: (options: object) =>
    useMutation({
      mutationKey: [API_UPLOAD_IMAGE],
      mutationFn: async (file: TPostUploadImageDataDTO) => {
        const formData = new FormData();

        formData.append('file', file);

        const { data } = await api.post<TPostUploadImageDTO>(API_UPLOAD_IMAGE, formData);

        return data;
      },
      ...options,
    }),
};
