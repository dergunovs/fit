import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import LayoutDefault from './LayoutDefault.vue';
import TheHeader from '@/common/components/TheHeader.vue';
import AuthForm from '@/auth/components/AuthForm.vue';
import RegistrationForm from '@/auth/components/RegistrationForm.vue';

import { wrapperFactory } from '@/common/test';

const header = dataTest('layout-default-header');
const loginForm = dataTest('layout-default-login-form');
const loginFormModal = dataTest('layout-default-login-form-modal');
const registrationForm = dataTest('layout-default-registration-form');
const registrationFormModal = dataTest('layout-default-registration-form-modal');

let wrapper: VueWrapper<InstanceType<typeof LayoutDefault>>;

beforeEach(() => {
  wrapper = wrapperFactory(LayoutDefault, { isAdmin: true });
});

enableAutoUnmount(afterEach);

describe('LayoutDefault', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(LayoutDefault)).toBeTruthy();
  });

  it('shows login modal', async () => {
    expect(wrapper.find(loginFormModal).attributes('modelvalue')).toBe('false');

    wrapper.findComponent<typeof TheHeader>(header).vm.$emit('showLogin');

    await nextTick();

    expect(wrapper.find(loginFormModal).attributes('modelvalue')).toBe('true');

    wrapper.findComponent<typeof AuthForm>(loginForm).vm.$emit('login');

    await nextTick();

    expect(wrapper.find(loginFormModal).attributes('modelvalue')).toBe('false');
  });

  it('hides login modal when user is reseting password', async () => {
    expect(wrapper.find(loginFormModal).attributes('modelvalue')).toBe('false');

    wrapper.findComponent<typeof TheHeader>(header).vm.$emit('showLogin');

    await nextTick();

    expect(wrapper.find(loginFormModal).attributes('modelvalue')).toBe('true');

    wrapper.findComponent<typeof AuthForm>(loginForm).vm.$emit('reset');

    await nextTick();

    expect(wrapper.find(loginFormModal).attributes('modelvalue')).toBe('false');
  });

  it('shows registration modal', async () => {
    expect(wrapper.find(registrationFormModal).attributes('modelvalue')).toBe('false');

    wrapper.findComponent<typeof TheHeader>(header).vm.$emit('showRegistration');

    await nextTick();

    expect(wrapper.find(registrationFormModal).attributes('modelvalue')).toBe('true');

    wrapper.findComponent<typeof RegistrationForm>(registrationForm).vm.$emit('register');

    await nextTick();

    expect(wrapper.find(registrationFormModal).attributes('modelvalue')).toBe('false');
  });

  it('emits pwa install by header emit', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('install');

    wrapper.findComponent<typeof TheHeader>(header).vm.$emit('install');

    expect(wrapper.emitted('install')).toHaveLength(1);
  });
});
