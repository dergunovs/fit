import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';

import LayoutDefault from './LayoutDefault.vue';
import TheHeader from '@/common/components/TheHeader.vue';
import AuthForm from '@/auth/components/AuthForm.vue';

import { dataTest, wait, wrapperFactory } from '@/common/test';

const header = dataTest('layout-default-header');
const loginForm = dataTest('layout-default-login-form');
const loginFormModal = dataTest('layout-default-login-form-modal');

let wrapper: VueWrapper;

beforeEach(() => {
  wrapper = wrapperFactory(LayoutDefault, {});
});

enableAutoUnmount(afterEach);

describe('LayoutDefault', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(LayoutDefault)).toBeTruthy();
  });

  it('shows login modal', async () => {
    expect(wrapper.find(loginFormModal).attributes('modelvalue')).toBe('false');

    wrapper.findComponent<typeof TheHeader>(header).vm.$emit('showLogin');

    await wait();

    expect(wrapper.find(loginFormModal).attributes('modelvalue')).toBe('true');

    wrapper.findComponent<typeof AuthForm>(loginForm).vm.$emit('login');

    await wait();

    expect(wrapper.find(loginFormModal).attributes('modelvalue')).toBe('false');
  });
});
