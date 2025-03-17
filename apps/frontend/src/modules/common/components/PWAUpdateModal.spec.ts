import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import PWAUpdateModal from './PWAUpdateModal.vue';

import { wrapperFactory } from '@/common/test';
import { spyUseRegisterSW, spyUpdateServiceWorker, mockNeedRefresh } from '@/common/mocks';

const modal = dataTest('pwa-update-modal');
const submit = dataTest('pwa-update-submit');
const cancel = dataTest('pwa-update-cancel');

let wrapper: VueWrapper<InstanceType<typeof PWAUpdateModal>>;

beforeEach(() => {
  wrapper = wrapperFactory(PWAUpdateModal);
});

enableAutoUnmount(afterEach);

describe('PWAUpdateModal', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(PWAUpdateModal)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('updates pwa', async () => {
    expect(spyUpdateServiceWorker).toBeCalledTimes(0);
    expect(spyUseRegisterSW).toBeCalledTimes(1);

    await wrapper.find(submit).trigger('click');

    expect(spyUpdateServiceWorker).toBeCalledTimes(1);
  });

  it('hides pwa modal by cancel button click', async () => {
    expect(wrapper.find(modal).attributes('modelvalue')).toBe(mockNeedRefresh.value.toString());

    await wrapper.find(cancel).trigger('click');

    expect(wrapper.find(modal).attributes('modelvalue')).toBe('false');
  });
});
