import { vi } from 'vitest';

import { toast } from 'mhz-ui';

export const spyToastSuccess = vi.spyOn(toast, 'success');
export const spyToastError = vi.spyOn(toast, 'error');
