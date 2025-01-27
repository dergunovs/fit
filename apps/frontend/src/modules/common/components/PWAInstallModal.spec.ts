import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import PWAInstallModal from './PWAInstallModal.vue';

import { wrapperFactory } from '@/common/test';
import { spyUsePWA, spyInstallPWA, mockIsShowInstallPWA } from '@/common/mocks';

const modal = dataTest('pwa-install-modal');
const submit = dataTest('pwa-install-submit');
const cancel = dataTest('pwa-install-cancel');

let wrapper: VueWrapper<InstanceType<typeof PWAInstallModal>>;

beforeEach(() => {
  wrapper = wrapperFactory(PWAInstallModal, { isAuth: true });
});

enableAutoUnmount(afterEach);

describe('PWAInstallModal', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(PWAInstallModal)).toBeTruthy();
  });

  it('installs pwa', async () => {
    expect(spyInstallPWA).toBeCalledTimes(0);
    expect(spyUsePWA).toBeCalledTimes(1);

    await wrapper.find(submit).trigger('click');

    expect(spyInstallPWA).toBeCalledTimes(1);
  });

  it('hides pwa modal by cancel button click', async () => {
    expect(wrapper.find(modal).attributes('modelvalue')).toBe(mockIsShowInstallPWA.value.toString());

    await wrapper.find(cancel).trigger('click');

    expect(wrapper.find(modal).attributes('modelvalue')).toBe('false');
  });

  it('hides pwa modal if user is not auth', async () => {
    expect(wrapper.find(modal).exists()).toBe(true);

    await wrapper.setProps({ isAuth: false });

    expect(wrapper.find(modal).exists()).toBe(false);
  });
});
