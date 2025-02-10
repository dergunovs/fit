import { vi } from 'vitest';

export const spyCopyToClipboard = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
