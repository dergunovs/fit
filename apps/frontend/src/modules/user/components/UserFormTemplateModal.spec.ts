import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UserFormTemplateModal from './UserFormTemplateModal.vue';
import ExerciseChooseList from '@/exercise/components/ExerciseChooseList.vue';
import ExerciseChoosenList from '@/exercise/components/ExerciseChoosenList.vue';
import ActivityPotentialDuration from '@/activity/components/ActivityPotentialDuration.vue';
import FormButtons from '@/common/components/FormButtons.vue';

import { wrapperFactory } from '@/common/test';
import { EXERCISE_CHOOSEN_2_FIXTURE, EXERCISES_FIXTURE } from '@/exercise/fixtures';
import { spyGetExercisesAll } from '@/exercise/mocks';
import { USER_TEMPLATES } from '@/user/fixtures';

const form = dataTest('template-form-modal');
const title = dataTest('template-form-title');
const potentialDuration = dataTest('template-form-potential-duration');
const addExercise = dataTest('template-form-add-exercise');
const addExerciseModal = dataTest('template-form-add-exercise-modal');
const addExerciseChooseList = dataTest('template-form-exercise-choose-list');
const choosenExercises = dataTest('template-form-exercise-choosen-list');
const formButtons = dataTest('template-form-buttons');

let wrapper: VueWrapper<InstanceType<typeof UserFormTemplateModal>>;

const wrapperWithoutTemplate = wrapperFactory(UserFormTemplateModal, {});

beforeEach(() => {
  wrapper = wrapperFactory(UserFormTemplateModal, { template: USER_TEMPLATES[0] });
});

enableAutoUnmount(afterEach);

describe('UserFormTemplateModal', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UserFormTemplateModal)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('gets exercises data', async () => {
    expect(spyGetExercisesAll).toBeCalledTimes(1);
  });

  it('shows potential duration', async () => {
    expect(wrapper.findComponent<typeof ActivityPotentialDuration>(potentialDuration).props('exercises')).toStrictEqual(
      USER_TEMPLATES[0].exercises
    );
  });

  it('emits edit by template submit', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('edit');

    expect(wrapper.find(addExerciseModal).attributes('modelvalue')).toStrictEqual('false');

    await wrapper.find(addExercise).trigger('click');

    expect(wrapper.find(addExerciseModal).attributes('modelvalue')).toStrictEqual('true');

    expect(wrapper.findComponent<typeof ExerciseChooseList>(addExerciseChooseList).props('exercises')).toStrictEqual(
      EXERCISES_FIXTURE
    );

    expect(wrapper.findComponent<typeof ExerciseChoosenList>(choosenExercises).props('choosenExercises')).toStrictEqual(
      USER_TEMPLATES[0].exercises
    );

    wrapper
      .findComponent<typeof ExerciseChooseList>(addExerciseChooseList)
      .vm.$emit('choose', EXERCISE_CHOOSEN_2_FIXTURE);

    await nextTick();

    expect(wrapper.find(addExerciseModal).attributes('modelvalue')).toStrictEqual('false');

    const updatedExercises = [...USER_TEMPLATES[0].exercises, EXERCISE_CHOOSEN_2_FIXTURE];

    expect(wrapper.findComponent<typeof ExerciseChoosenList>(choosenExercises).props('choosenExercises')).toStrictEqual(
      updatedExercises
    );

    await wrapper.find(form).trigger('submit');

    expect(wrapper.emitted('edit')).toHaveLength(1);
    expect(wrapper.emitted()['edit'][0]).toStrictEqual([
      { _id: USER_TEMPLATES[0]._id, title: USER_TEMPLATES[0].title, exercises: updatedExercises },
    ]);
  });

  it('emits create by template submit', async () => {
    expect(wrapperWithoutTemplate.emitted()).not.toHaveProperty('create');

    await wrapperWithoutTemplate.findComponent(title).setValue(USER_TEMPLATES[0].title);

    await wrapperWithoutTemplate.find(addExercise).trigger('click');

    wrapperWithoutTemplate
      .findComponent<typeof ExerciseChooseList>(addExerciseChooseList)
      .vm.$emit('choose', USER_TEMPLATES[0].exercises[0]);

    await wrapperWithoutTemplate.find(form).trigger('submit');

    expect(wrapperWithoutTemplate.emitted('create')).toHaveLength(1);
    expect(wrapperWithoutTemplate.emitted()['create'][0]).toStrictEqual([
      { title: USER_TEMPLATES[0].title, exercises: USER_TEMPLATES[0].exercises },
    ]);
  });

  it('emits delete by button click', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('delete');

    wrapper.findComponent<typeof FormButtons>(formButtons).vm.$emit('delete', USER_TEMPLATES[0]._id);

    await nextTick();

    expect(wrapper.emitted('delete')).toHaveLength(1);
    expect(wrapper.emitted()['delete'][0]).toStrictEqual([USER_TEMPLATES[0]._id]);
  });
});
