import { DefineComponent } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import FormButtons from './FormButtons.vue';

import { dataTest, wrapperFactory } from '@/common/test';
import { spyRouterGo } from '@/common/mocks';
import { CREATE_BUTTON_TEXT, UPDATE_BUTTON_TEXT } from '@/common/constants';

const id = '123';

const buttonsSubmit = dataTest('form-buttons-submit');
const buttonsBack = dataTest('form-buttons-back');
const buttonsDelete = dataTest('form-buttons-delete');
const buttonsConfirmModal = dataTest('form-buttons-confirm-modal');

let wrapper: VueWrapper;

beforeEach(() => {
  wrapper = wrapperFactory(FormButtons, {
    props: { id, isLoading: false },
  });
});

enableAutoUnmount(afterEach);

describe('FormButtons', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(FormButtons)).toBeTruthy();
  });

  it('shows delete button if id props exists', async () => {
    expect(wrapper.findComponent(buttonsDelete).exists()).toEqual(true);

    await wrapper.setProps({ id: undefined });

    expect(wrapper.findComponent(buttonsDelete).exists()).toEqual(false);
  });

  it('disables buttons by loading props', async () => {
    expect(wrapper.findComponent(buttonsSubmit).attributes('isdisabled')).toEqual('false');
    expect(wrapper.findComponent(buttonsBack).attributes('isdisabled')).toEqual('false');
    expect(wrapper.findComponent(buttonsDelete).attributes('isdisabled')).toEqual('false');

    await wrapper.setProps({ isLoading: true });

    expect(wrapper.findComponent(buttonsSubmit).attributes('isdisabled')).toEqual('true');
    expect(wrapper.findComponent(buttonsBack).attributes('isdisabled')).toEqual('true');
    expect(wrapper.findComponent(buttonsDelete).attributes('isdisabled')).toEqual('true');
  });

  it('changes submit button text by id props', async () => {
    expect(wrapper.findComponent(buttonsSubmit).text()).toEqual(UPDATE_BUTTON_TEXT);

    await wrapper.setProps({ id: undefined });

    expect(wrapper.findComponent(buttonsSubmit).text()).toEqual(CREATE_BUTTON_TEXT);
  });

  it('pushed to previous page by back button click', async () => {
    expect(spyRouterGo).toBeCalledTimes(0);

    await wrapper.findComponent(buttonsBack).trigger('click');

    expect(spyRouterGo).toBeCalledTimes(1);
    expect(spyRouterGo).toBeCalledWith(-1);
  });

  it('emits delete by delete button click with confirm', async () => {
    expect(wrapper.findComponent(buttonsConfirmModal).attributes('modelvalue')).toEqual('false');

    await wrapper.findComponent(buttonsDelete).trigger('click');

    expect(wrapper.findComponent(buttonsConfirmModal).attributes('modelvalue')).toEqual('true');

    wrapper.findComponent<DefineComponent>(buttonsConfirmModal).vm.$emit('confirm');

    expect(wrapper.emitted('delete')).toHaveLength(1);
    expect(wrapper.emitted()['delete'][0]).toEqual([id]);
  });
});
