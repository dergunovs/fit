import { describe, it, expect, vi } from 'vitest';
import { copyToClipboard } from './index';

import { spyToastSuccess } from '@/common/mocks';

const text = 'test text';
const toastText = 'Copied to clipboard';

describe('copyToClipboard helper', () => {
  it('should copy text to clipboard and show success toast', async () => {
    const mockWriteText = vi.fn();

    Object.defineProperty(navigator, 'clipboard', { value: { writeText: mockWriteText }, writable: true });

    await copyToClipboard(text, toastText);

    expect(mockWriteText).toHaveBeenCalledWith(text);
    expect(spyToastSuccess).toHaveBeenCalledTimes(1);
  });

  it('should handle clipboard write error gracefully', async () => {
    const mockWriteText = vi.fn().mockRejectedValue(new Error('Error'));

    Object.defineProperty(navigator, 'clipboard', { value: { writeText: mockWriteText }, writable: true });

    await expect(copyToClipboard(text, toastText)).rejects.toThrowError('Error');
    expect(spyToastSuccess).toHaveBeenCalledTimes(0);
  });
});
