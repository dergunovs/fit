import { Component, computed } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { shallowMount } from '@vue/test-utils';
import { VueQueryPlugin } from 'mhz-helpers';

import { routes } from '@/common/router/routes';

document.body.innerHTML = '<div id="app"></div>';

interface IWrapperFactoryArgs {
  mocks?: object;
  props?: object;
  slots?: object;
  stubs?: object;
}

export const router = createRouter({ history: createWebHistory('/'), routes });

export function wrapperFactory(component: Component, { mocks, props, slots, stubs }: IWrapperFactoryArgs) {
  return shallowMount(component, {
    global: {
      plugins: [router, VueQueryPlugin],
      stubs: {
        RouterLink: { template: '<a><slot></slot></a>' },
        UiField: { template: '<fieldset><slot></slot></fieldset>' },
        UiInput: { template: '<input type="text"/>' },
        UiButton: { template: '<button><slot></slot></button>' },
        UiTable: { template: '<table><tbody><slot></slot></tbody></table>' },
        UiSelect: { template: '<input type="text"/>' },
        UiCheckbox: { template: '<input type="checkbox" />' },
        UiModal: { template: '<div><slot></slot></div>' },
        UiSpoiler: { template: '<div><slot></slot></div>' },
        UiFlex: { template: '<div><slot></slot></div>' },
        UiChip: { template: '<div><slot></slot></div>' },
        UiCalendar: { template: '<div></div>' },
        UiChart: { template: '<div></div>' },
        UiPagination: { template: '<div></div>' },
        ...stubs,
      },
      mocks,
    },
    props,
    slots,
    attachTo: document.getElementById('app') as HTMLElement,
  });
}

export function dataTest(value: string) {
  return `[data-test="${value}"]`;
}

export async function wait(time?: number) {
  await new Promise((r) => {
    setTimeout(r, time || 10);
  });
}

export function returnComputed<T>(value: T) {
  return computed(() => value);
}
