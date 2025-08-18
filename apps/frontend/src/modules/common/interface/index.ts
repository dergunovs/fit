import { TPostAuthLoginDTO } from 'fitness-tracker-contracts';
import { FunctionalComponent } from 'vue';

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
