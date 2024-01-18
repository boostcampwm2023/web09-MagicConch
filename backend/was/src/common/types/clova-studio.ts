import { CLOVA_API_KEY_NAMES } from '../constants/clova-studio';

export type ClovaStudioEvent = {
  id: string;
  event: string;
  data: {
    message: ClovaStudioMessage;
  };
};

export type ClovaStudioMessage = {
  role: 'user' | 'system' | 'assistant';
  content: string;
};

export type ClovaStudioApiKeys = {
  [key in (typeof CLOVA_API_KEY_NAMES)[number]]: string;
};
