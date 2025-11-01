import { ComponentPublicInstance, FunctionalComponent } from 'vue';
import { TPostAuthLoginDTO } from 'fitness-tracker-contracts';

// eslint-disable-next-line @typescript-eslint/no-type-alias
type TFilteredProps<T> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [K in keyof T as K extends `$${infer _U}` ? never : K extends `on${infer _V}` ? never : K]: T[K];
};

export type TComponentProps<T> = Partial<TFilteredProps<ComponentPublicInstance<T>['$props']>>;

export interface IStubs {
  [title: string]: { template?: string | object; props?: string[]; name?: string };
}

export interface INavItem {
  url: string;
  title: string;
  icon: FunctionalComponent;
}

export interface IOnSuccess {
  create?: (id?: string) => Promise<void>;
  update?: () => Promise<void>;
  updatePassword?: () => Promise<void>;
  delete?: () => Promise<void>;
  check?: () => Promise<void>;
  login?: (user: TPostAuthLoginDTO) => Promise<void>;
  setup?: () => Promise<void>;
  register?: () => Promise<void>;
  confirmToken?: () => Promise<void>;
  resetPassword?: () => Promise<void>;
  feedback?: () => Promise<void>;
}
