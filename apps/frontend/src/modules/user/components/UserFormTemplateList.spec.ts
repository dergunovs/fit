import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UserFormTemplateList from './UserFormTemplateList.vue';
import UserFormTemplateElement from './UserFormTemplateElement.vue';

import { wrapperFactory } from '@/common/test';
import { USER_TEMPLATES } from '@/user/fixtures';

const template = dataTest('user-form-template-element');

let wrapper: VueWrapper<InstanceType<typeof UserFormTemplateList>>;

beforeEach(() => {
  wrapper = wrapperFactory(UserFormTemplateList, { templates: USER_TEMPLATES });
});

enableAutoUnmount(afterEach);

describe('UserFormTemplateList', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UserFormTemplateList)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows templates', async () => {
    expect(wrapper.findAll(template).length).toBe(USER_TEMPLATES.length);
    expect(wrapper.findComponent<typeof UserFormTemplateElement>(template).props('template')).toStrictEqual(
      USER_TEMPLATES[0]
    );
  });

  it('emits edit template', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('edit');

    wrapper.findComponent<typeof UserFormTemplateElement>(template).vm.$emit('edit', USER_TEMPLATES[0]);

    expect(wrapper.emitted('edit')).toHaveLength(1);
    expect(wrapper.emitted()['edit'][0]).toStrictEqual([USER_TEMPLATES[0]]);
  });

  it('emits delete template', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('delete');

    wrapper.findComponent<typeof UserFormTemplateElement>(template).vm.$emit('delete', USER_TEMPLATES[0]._id);

    expect(wrapper.emitted('delete')).toHaveLength(1);
    expect(wrapper.emitted()['delete'][0]).toStrictEqual([USER_TEMPLATES[0]._id]);
  });
});
