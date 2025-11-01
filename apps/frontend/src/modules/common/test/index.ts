import { Component, ComponentPublicInstance } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { shallowMount } from '@vue/test-utils';
import { VueQueryPlugin } from 'mhz-helpers';
import { uiStubs } from 'mhz-ui';

import { routes } from '@/common/router/routes';
import { i18n } from '@/common/plugins';
import { IStubs, TComponentProps } from '@/common/interface';

export const router = createRouter({ history: createWebHistory(), routes });

export function wrapperFactory<T>(component: Component<T>, props?: TComponentProps<T>, stubs?: IStubs) {
  document.body.innerHTML = '<div id="app"></div>';

  return shallowMount(component, {
    global: {
      plugins: [router, VueQueryPlugin, i18n],
      stubs: { RouterLink: { template: '<a><slot></slot></a>' }, ...stubs, ...uiStubs },
    },
    props: props as ComponentPublicInstance<T>['$props'],
    attachTo: document.querySelector('#app') as HTMLElement,
  });
}
