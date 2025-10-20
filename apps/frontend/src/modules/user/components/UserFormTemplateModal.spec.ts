import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UserFormTemplateModal from './UserFormTemplateModal.vue';
import ExerciseManagment from '@/exercise/components/ExerciseManagment.vue';
import ActivityPotentialDuration from '@/activity/components/ActivityPotentialDuration.vue';
import FormButtons from '@/common/components/FormButtons.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISE_CHOOSEN_2_FIXTURE } from '@/exercise/fixtures';
import { USER_TEMPLATE } from '@/user/fixtures';

const form = dataTest('template-form-modal');
const title = dataTest('template-form-title');
const potentialDuration = dataTest('template-form-potential-duration');
const addExercise = dataTest('template-form-add-exercise');
const exerciseManagment = dataTest('user-form-template-exercise-managment');
const formButtons = dataTest('template-form-buttons');

let wrapper: VueWrapper<InstanceType<typeof UserFormTemplateModal>>;

const wrapperWithoutTemplate = wrapperFactory(UserFormTemplateModal, {});

beforeEach(() => {
  wrapper = wrapperFactory(UserFormTemplateModal, { template: USER_TEMPLATE });
});

enableAutoUnmount(afterEach);

describe('UserFormTemplateModal', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UserFormTemplateModal)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows potential duration', async () => {
    expect(wrapper.findComponent<typeof ActivityPotentialDuration>(potentialDuration).props('exercises')).toStrictEqual(
      USER_TEMPLATE.exercises
    );
  });

  it('emits edit by template submit', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('edit');

    expect(wrapper.findComponent<typeof ExerciseManagment>(exerciseManagment).props('isShowModal')).toStrictEqual(
      false
    );

    await wrapper.find(addExercise).trigger('click');

    expect(wrapper.findComponent<typeof ExerciseManagment>(exerciseManagment).props('isShowModal')).toStrictEqual(true);

    const updatedExercises = [...USER_TEMPLATE.exercises, EXERCISE_CHOOSEN_2_FIXTURE];

    wrapper.findComponent<typeof ExerciseManagment>(exerciseManagment).vm.$emit('update:modelValue', updatedExercises);
    wrapper.findComponent<typeof ExerciseManagment>(exerciseManagment).vm.$emit('updateModal', false);

    expect(wrapper.emitted('edit')).toHaveLength(1);
    expect(wrapper.emitted()['edit'][0]).toStrictEqual([
      { _id: USER_TEMPLATE._id, title: USER_TEMPLATE.title, exercises: updatedExercises },
    ]);
  });

  it('emits create by template submit', async () => {
    expect(wrapperWithoutTemplate.emitted()).not.toHaveProperty('create');

    await wrapperWithoutTemplate.find(form).trigger('submit');

    expect(wrapperWithoutTemplate.emitted()).not.toHaveProperty('create');

    await wrapperWithoutTemplate.findComponent(title).setValue(USER_TEMPLATE.title);

    await wrapperWithoutTemplate.find(addExercise).trigger('click');

    wrapperWithoutTemplate
      .findComponent<typeof ExerciseManagment>(exerciseManagment)
      .vm.$emit('update:modelValue', USER_TEMPLATE.exercises);

    await wrapperWithoutTemplate.find(form).trigger('submit');

    expect(wrapperWithoutTemplate.emitted('create')).toHaveLength(1);
    expect(wrapperWithoutTemplate.emitted()['create'][0]).toStrictEqual([
      { title: USER_TEMPLATE.title, exercises: USER_TEMPLATE.exercises },
    ]);
  });

  it('emits delete by button click', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('delete');

    wrapper.findComponent<typeof FormButtons>(formButtons).vm.$emit('delete', USER_TEMPLATE._id);

    await nextTick();

    expect(wrapper.emitted('delete')).toHaveLength(1);
    expect(wrapper.emitted()['delete'][0]).toStrictEqual([USER_TEMPLATE._id]);
  });
});
