import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { API_MUSCLE } from 'fitness-tracker-contracts';
import { dataTest } from 'mhz-helpers';

import MuscleForm from './MuscleForm.vue';
import FormButtons from '@/common/components/FormButtons.vue';

import { wrapperFactory } from '@/common/test';
import { mockOnSuccess, spyCreateMuscle, spyUpdateMuscle, spyDeleteMuscle } from '@/muscle/mocks';
import { spyRefetchQueries, spyRemoveQueries, spyRouterPush, spyToastSuccess, mockIsValid } from '@/common/mocks';
import { URL_MUSCLE } from '@/muscle/constants';
import { MUSCLES_FIXTURE } from '@/muscle/fixtures';

const TITLE = 'Название';
const COLOR = '#eee';
const muscle = MUSCLES_FIXTURE[0];

const form = dataTest('muscle-form');
const formTitle = dataTest('muscle-form-title');
const formColor = dataTest('muscle-form-color');
const formColorExample = dataTest('muscle-form-color-example');
const formButtons = dataTest('muscle-form-buttons');

const wrapperWithMuscle: VueWrapper<InstanceType<typeof MuscleForm>> = wrapperFactory(MuscleForm, { muscle });

let wrapper: VueWrapper<InstanceType<typeof MuscleForm>>;

beforeEach(() => {
  wrapper = wrapperFactory(MuscleForm);
});

enableAutoUnmount(afterEach);

describe('MuscleForm', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(MuscleForm)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('uses validation', async () => {
    mockIsValid.value = false;

    await wrapper.find(form).trigger('submit');

    expect(spyCreateMuscle).toBeCalledTimes(0);

    mockIsValid.value = true;
  });

  it('creates muscle', async () => {
    expect(spyCreateMuscle).toBeCalledTimes(0);
    expect(spyRefetchQueries).toBeCalledTimes(0);
    expect(spyToastSuccess).toBeCalledTimes(0);
    expect(spyRouterPush).toBeCalledTimes(0);

    await wrapper.findComponent(formTitle).setValue(TITLE);

    expect(wrapper.find(formColorExample).exists()).toBe(false);

    await wrapper.findComponent(formColor).setValue(COLOR);

    expect(wrapper.find(formColorExample).exists()).toBe(true);

    await wrapper.find(form).trigger('submit');

    expect(spyCreateMuscle).toBeCalledTimes(1);
    expect(spyCreateMuscle).toBeCalledWith({ title: TITLE, color: COLOR });

    await mockOnSuccess.create?.();

    expect(spyRefetchQueries).toBeCalledTimes(1);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_MUSCLE] });

    expect(spyToastSuccess).toBeCalledTimes(1);

    expect(spyRouterPush).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledWith(URL_MUSCLE);
  });

  it('updates muscle', async () => {
    expect(spyUpdateMuscle).toBeCalledTimes(0);
    expect(spyRefetchQueries).toBeCalledTimes(0);
    expect(spyToastSuccess).toBeCalledTimes(0);

    const NEW_TITLE = 'Новое название';

    await wrapperWithMuscle.findComponent(formTitle).setValue(NEW_TITLE);

    await wrapperWithMuscle.find(form).trigger('submit');

    expect(spyUpdateMuscle).toBeCalledTimes(1);
    expect(spyUpdateMuscle).toBeCalledWith({
      _id: muscle._id,
      title: NEW_TITLE,
      color: muscle.color,
      dateCreated: muscle.dateCreated,
    });

    await mockOnSuccess.update?.();

    expect(spyRefetchQueries).toBeCalledTimes(1);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_MUSCLE] });

    expect(spyToastSuccess).toBeCalledTimes(1);
  });

  it('deletes muscle', async () => {
    expect(spyDeleteMuscle).toBeCalledTimes(0);
    expect(spyRemoveQueries).toBeCalledTimes(0);
    expect(spyRefetchQueries).toBeCalledTimes(0);
    expect(spyToastSuccess).toBeCalledTimes(0);
    expect(spyRouterPush).toBeCalledTimes(0);

    wrapperWithMuscle.findComponent<typeof FormButtons>(formButtons).vm.$emit('delete', muscle._id);

    expect(spyDeleteMuscle).toBeCalledTimes(1);
    expect(spyDeleteMuscle).toBeCalledWith(muscle._id);

    await mockOnSuccess.delete?.();

    expect(spyRemoveQueries).toBeCalledTimes(1);
    expect(spyRemoveQueries).toBeCalledWith({ queryKey: [API_MUSCLE] });

    expect(spyRefetchQueries).toBeCalledTimes(1);
    expect(spyRefetchQueries).toBeCalledWith({ queryKey: [API_MUSCLE] });

    expect(spyToastSuccess).toBeCalledTimes(1);

    expect(spyRouterPush).toBeCalledTimes(1);
    expect(spyRouterPush).toBeCalledWith(URL_MUSCLE);
  });

  it('sets form buttons id', async () => {
    expect(wrapper.find(formButtons).attributes('id')).toBe(undefined);
    expect(wrapperWithMuscle.find(formButtons).attributes('id')).toBe(muscle._id);
  });
});
