import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { API_USER_FEEDBACK } from 'fitness-tracker-contracts';
import { dataTest } from 'mhz-helpers';

import UserFeedbackForm from './UserFeedbackForm.vue';

import { wrapperFactory } from '@/common/test';
import { mockOnSuccess, spyUserFeedback } from '@/user/mocks';
import { spyRefetchQueries, spyToastSuccess, mockIsValid } from '@/common/mocks';

const EMAIL = 'a@b.ru';
const NAME = 'Иван';
const MESSAGE = 'Спасибо за всё!';

const form = dataTest('feedback-form');
const name = dataTest('feedback-form-name');
const email = dataTest('feedback-form-email');
const message = dataTest('feedback-form-message');
const feedbackText = dataTest('feedback-text');

let wrapper: VueWrapper<InstanceType<typeof UserFeedbackForm>>;

beforeEach(() => {
  wrapper = wrapperFactory(UserFeedbackForm);
});

enableAutoUnmount(afterEach);

describe('UserFeedbackForm', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UserFeedbackForm)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('uses validation', async () => {
    mockIsValid.value = false;

    await wrapper.find(form).trigger('submit');

    expect(spyUserFeedback).toBeCalledTimes(0);

    mockIsValid.value = true;
  });

  it('sends user feedback', async () => {
    expect(wrapper.find(feedbackText).exists()).toBe(false);
    expect(spyUserFeedback).toBeCalledTimes(0);
    expect(spyRefetchQueries).toBeCalledTimes(0);
    expect(spyToastSuccess).toBeCalledTimes(0);

    await wrapper.findComponent(name).setValue(NAME);
    await wrapper.findComponent(email).setValue(EMAIL);
    await wrapper.findComponent(message).setValue(MESSAGE);

    await wrapper.find(form).trigger('submit');

    expect(spyUserFeedback).toBeCalledTimes(1);
    expect(spyUserFeedback).toBeCalledWith({ name: NAME, email: EMAIL, message: MESSAGE });

    await mockOnSuccess.feedback?.();

    expect(spyRefetchQueries).toBeCalledTimes(1);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_USER_FEEDBACK] });

    expect(spyToastSuccess).toBeCalledTimes(1);

    expect(wrapper.find(form).exists()).toBe(false);
    expect(wrapper.find(feedbackText).exists()).toBe(true);
  });
});
