import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UserFormTemplateElement from './UserFormTemplateElement.vue';

import { wrapperFactory } from '@/common/test';
import { USER_TEMPLATE } from '@/user/fixtures';

const title = dataTest('user-form-template-title');
const editButton = dataTest('user-form-template-edit');
const deleteButton = dataTest('user-form-template-delete');

let wrapper: VueWrapper<InstanceType<typeof UserFormTemplateElement>>;

beforeEach(() => {
  wrapper = wrapperFactory(UserFormTemplateElement, { template: USER_TEMPLATE });
});

enableAutoUnmount(afterEach);

describe('UserFormTemplateElement', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UserFormTemplateElement)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows template title', async () => {
    expect(wrapper.find(title).text()).toStrictEqual(USER_TEMPLATE.title);
  });

  it('emits template by edit button click', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('edit');

    await wrapper.find(editButton).trigger('click');

    expect(wrapper.emitted('edit')).toHaveLength(1);
    expect(wrapper.emitted()['edit'][0]).toStrictEqual([USER_TEMPLATE]);
  });

  it('emits id by delete button click', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('delete');

    await wrapper.find(deleteButton).trigger('click');

    expect(wrapper.emitted('delete')).toHaveLength(1);
    expect(wrapper.emitted()['delete'][0]).toStrictEqual([USER_TEMPLATE._id]);
  });
});
