import { toast } from 'mhz-ui';

export async function copyToClipboard(text: string, toastText: string) {
  await navigator.clipboard.writeText(text);

  toast.success(toastText);
}
