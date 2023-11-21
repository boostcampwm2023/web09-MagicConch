import { loadScript } from '@utils/loadScript';

import { KAKAO_SDK_INTERGRITY, KAKAO_SDK_URL } from '@constants/kakao';

async function init() {
  await loadScript(KAKAO_SDK_URL, KAKAO_SDK_INTERGRITY, 'anonymous');

  const { Kakao } = window;

  if (!window.Kakao) {
    throw new Error('Kakao SDK 로딩 실패');
  }

  if (!Kakao.isInitialized()) {
    Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
  }
}
export const Kakao = {
  init: async () => {
    await init();
  },

  shareSendDefault: async ({ cardUrl, id }: { id: string; cardUrl: string }) => {
    if (!window.Kakao || !window.Kakao) {
      await init();
    }

    const { Kakao } = window;
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '마법의 소라고둥',
        description: 'AI 타로 플랫폼, 마법의 소라고둥',
        imageUrl: cardUrl,
        link: {
          mobileWebUrl: `${BASE_URL}/result/${id}`,
          webUrl: `${BASE_URL}/result/${id}`,
        },
      },
      buttons: [
        {
          title: '타로 보러가기',
          link: {
            mobileWebUrl: `${BASE_URL}/result/${id}`,
            webUrl: `${BASE_URL}/result/${id}`,
          },
        },
      ],
    });
  },
};
