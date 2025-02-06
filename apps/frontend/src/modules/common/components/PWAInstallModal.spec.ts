import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import PWAInstallModal from './PWAInstallModal.vue';

import { wrapperFactory } from '@/common/test';
import { spyInstallPWA, mockIsShowInstallPWA } from '@/common/mocks';

const submit = dataTest('pwa-install-submit');
const cancel = dataTest('pwa-install-cancel');
let wrapper: VueWrapper<InstanceType<typeof PWAInstallModal>>;

beforeEach(() => {
  wrapper = wrapperFactory(PWAInstallModal, { modelValue: mockIsShowInstallPWA.value, installPWA: spyInstallPWA });
});

enableAutoUnmount(afterEach);

describe('PWAInstallModal', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(PWAInstallModal)).toBeTruthy();
  });

  it('installs pwa', async () => {
    expect(spyInstallPWA).toBeCalledTimes(0);

    await wrapper.find(submit).trigger('click');

    expect(spyInstallPWA).toBeCalledTimes(1);
  });

  it('hides pwa modal by cancel button click', async () => {
    await wrapper.find(cancel).trigger('click');

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
  });
});
