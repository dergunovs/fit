import { DefineComponent, nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import LayoutContainer from './LayoutContainer.vue';
import TheHeader from '@/common/components/TheHeader.vue';
import AuthForm from '@/auth/components/AuthForm.vue';
import RegistrationForm from '@/auth/components/RegistrationForm.vue';

import { wrapperFactory } from '@/common/test';

const layout = dataTest('layout');
const header = dataTest('layout-header');
const loginForm = dataTest('layout-login-form');
const loginFormModal = dataTest('layout-login-form-modal');
const registrationForm = dataTest('layout-registration-form');
const registrationFormModal = dataTest('layout-registration-form-modal');

let wrapper: VueWrapper<InstanceType<typeof LayoutContainer>>;

beforeEach(() => {
  wrapper = wrapperFactory(LayoutContainer);
});

enableAutoUnmount(afterEach);

describe('LayoutContainer', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(LayoutContainer)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows layout component', async () => {
    expect(wrapper.find(layout).exists()).toBe(true);
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

  it('shows registration modal from header', async () => {
    expect(wrapper.find(registrationFormModal).attributes('modelvalue')).toBe('false');

    wrapper.findComponent<typeof TheHeader>(header).vm.$emit('register');

    await nextTick();

    expect(wrapper.find(registrationFormModal).attributes('modelvalue')).toBe('true');

    wrapper.findComponent<typeof RegistrationForm>(registrationForm).vm.$emit('register');

    await nextTick();

    expect(wrapper.find(registrationFormModal).attributes('modelvalue')).toBe('false');
  });

  it('shows registration modal from page', async () => {
    expect(wrapper.find(registrationFormModal).attributes('modelvalue')).toBe('false');

    wrapper.findComponent<DefineComponent>(layout).vm.$emit('register');

    await nextTick();

    expect(wrapper.find(registrationFormModal).attributes('modelvalue')).toBe('true');
  });
});
