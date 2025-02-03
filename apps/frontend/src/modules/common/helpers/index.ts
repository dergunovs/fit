import { URL_HOME } from '@/common/constants';

export function isLinkActive(currentUrl: string, linkUrl: string) {
  return currentUrl === URL_HOME ? currentUrl === linkUrl : currentUrl.includes(linkUrl) && linkUrl !== URL_HOME;
}
