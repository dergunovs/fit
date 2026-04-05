import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import ImagePreview from './ImagePreview.vue';

import { wrapperFactory } from '@/common/test';

const image = dataTest('image-preview');
const deleteButton = dataTest('image-preview-delete');

const IMAGE_URL = 'uploads/exercise/test.jpg';
const MOCK_UPLOAD_PATH = 'http://localhost:5000';

let wrapper: VueWrapper<InstanceType<typeof ImagePreview>>;

beforeEach(() => {
  vi.stubEnv('VITE_PATH_UPLOAD', MOCK_UPLOAD_PATH);
  wrapper = wrapperFactory(ImagePreview, { url: IMAGE_URL });
});

enableAutoUnmount(afterEach);

describe('ImagePreview', () => {
  it('exists', () => {
    expect(wrapper.findComponent(ImagePreview)).toBeTruthy();
  });

  it('matches snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders image with correct path', () => {
    expect(wrapper.find(image).attributes('src')).toContain(IMAGE_URL);
  });

  it('renders delete button', () => {
    expect(wrapper.findComponent(deleteButton).exists()).toBe(true);
  });

  it('emits delete event when button is clicked', async () => {
    await wrapper.findComponent(deleteButton).trigger('click');

    expect(wrapper.emitted('delete')).toHaveLength(1);
  });
});
