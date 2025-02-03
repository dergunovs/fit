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
  delete?: () => Promise<void>;
  login?: (user: TPostAuthLoginDTO) => Promise<void>;
  setup?: () => Promise<void>;
  register?: () => Promise<void>;
}

export interface IPromptEvent extends Event {
  prompt: () => Promise<void>;
}

export interface IGetLatestVersionDTO {
  'dist-tags': { latest: string };
}
