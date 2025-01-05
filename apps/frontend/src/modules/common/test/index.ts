import { Component, ComponentPublicInstance } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { shallowMount } from '@vue/test-utils';
import { VueQueryPlugin } from 'mhz-helpers';
import { uiStubs } from 'mhz-ui';

import { routes } from '@/common/router/routes';

export const router = createRouter({ history: createWebHistory('/'), routes });

export function wrapperFactory<T>(component: Component<T>, props?: Partial<ComponentPublicInstance<T>['$props']>) {
  document.body.innerHTML = '<div id="app"></div>';

  return shallowMount(component, {
    global: {
      plugins: [router, VueQueryPlugin],
      stubs: { RouterLink: { template: '<a><slot></slot></a>' }, ...uiStubs },
    },
    props: props as ComponentPublicInstance<T>['$props'],
    attachTo: document.getElementById('app') as HTMLElement,
  });
}
