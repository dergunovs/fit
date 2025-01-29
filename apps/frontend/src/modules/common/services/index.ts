import { useQuery, api } from 'mhz-helpers';

import { API_NPMJS } from '@/common/constants';
import { IGetLatestVersionDTO } from '@/common/interface';

export const commonService = {
  getLatestVersion: () => {
    return useQuery({
      queryKey: [API_NPMJS],
      queryFn: async () => {
        const { data } = await api.get<IGetLatestVersionDTO>(API_NPMJS);

        return data['dist-tags'].latest;
      },
    });
  },
};
