import { DefineComponent } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import FormButtons from './FormButtons.vue';

import { wrapperFactory } from '@/common/test';
import { spyRouterGo } from '@/common/mocks';
import { CREATE_BUTTON_TEXT, UPDATE_BUTTON_TEXT } from '@/common/constants';

const id = '123';

const buttonsSubmit = dataTest('form-buttons-submit');
const buttonsBack = dataTest('form-buttons-back');
const buttonsDelete = dataTest('form-buttons-delete');
const buttonsConfirmModal = dataTest('form-buttons-confirm-modal');

let wrapper: VueWrapper<InstanceType<typeof FormButtons>>;

beforeEach(() => {
  wrapper = wrapperFactory(FormButtons, { id, isLoading: false });
});

enableAutoUnmount(afterEach);

describe('FormButtons', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(FormButtons)).toBeTruthy();
  });

  it('shows delete button if id props exists', async () => {
    expect(wrapper.findComponent(buttonsDelete).exists()).toBe(true);

    await wrapper.setProps({ id: undefined });

    expect(wrapper.findComponent(buttonsDelete).exists()).toBe(false);
  });

  it('disables buttons by loading props', async () => {
    expect(wrapper.findComponent(buttonsSubmit).attributes('isdisabled')).toBe('false');
    expect(wrapper.findComponent(buttonsBack).attributes('isdisabled')).toBe('false');
    expect(wrapper.findComponent(buttonsDelete).attributes('isdisabled')).toBe('false');

    await wrapper.setProps({ isLoading: true });

    expect(wrapper.findComponent(buttonsSubmit).attributes('isdisabled')).toBe('true');
    expect(wrapper.findComponent(buttonsBack).attributes('isdisabled')).toBe('true');
    expect(wrapper.findComponent(buttonsDelete).attributes('isdisabled')).toBe('true');
  });

  it('changes submit button text by id props', async () => {
    expect(wrapper.findComponent(buttonsSubmit).text()).toBe(UPDATE_BUTTON_TEXT);

    await wrapper.setProps({ id: undefined });

    expect(wrapper.findComponent(buttonsSubmit).text()).toBe(CREATE_BUTTON_TEXT);
  });

  it('pushed to previous page by back button click', async () => {
    expect(spyRouterGo).toBeCalledTimes(0);

    await wrapper.findComponent(buttonsBack).trigger('click');

    expect(spyRouterGo).toBeCalledTimes(1);
    expect(spyRouterGo).toBeCalledWith(-1);
  });

  it('emits delete by delete button click with confirm', async () => {
    expect(wrapper.findComponent(buttonsConfirmModal).attributes('modelvalue')).toBe('false');

    await wrapper.findComponent(buttonsDelete).trigger('click');

    expect(wrapper.findComponent(buttonsConfirmModal).attributes('modelvalue')).toBe('true');

    wrapper.findComponent<DefineComponent>(buttonsConfirmModal).vm.$emit('confirm');

    expect(wrapper.emitted('delete')).toHaveLength(1);
    expect(wrapper.emitted()['delete'][0]).toStrictEqual([id]);
  });
});
