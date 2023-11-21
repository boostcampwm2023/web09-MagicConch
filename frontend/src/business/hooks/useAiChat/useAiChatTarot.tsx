import useOverlay from '../useOverlay';
import { useEffect, useState } from 'react';

import CustomButton from '@components/CustomButton';
import TarotSpread from '@components/TarotSpread';

import { requestTarotRead, setTarotCardEventListener } from '@business/services/socket';

import { tarotCardNames } from '@constants/tarotCardNames';

export function useAiChatTarot(tarotCardId: React.MutableRefObject<string | undefined>) {
  const [displayAskTarotCardButtons, setDisplayAskTarotCardButtons] = useState(false);
  const [displayTarotSpreadButton, setDisplayTarotSpreadButton] = useState(false);

  const { open } = useOverlay();

  const continueChat = () => {
    setDisplayAskTarotCardButtons(false);
    setDisplayTarotSpreadButton(true);
  };

  const pickCard = (idx: number) => {
    idx %= tarotCardNames.length;
    requestTarotRead(`${idx}번 ${tarotCardNames[idx]}카드`);
    tarotCardId.current = idx.toString().padStart(2, '0');
  };

  const openTarotSpread = () => {
    setDisplayAskTarotCardButtons(false);
    open(({ opened, close }) => (
      <TarotSpread
        opened={opened}
        close={close}
        pickCard={pickCard}
      />
    ));
  };

  const askTarotCardButtons = displayAskTarotCardButtons && (
    <div className="absolute right-50 bottom-0 flex gap-16">
      <CustomButton
        size="s"
        color="dark"
        handleButtonClicked={continueChat}
      >
        아니, 더 이야기 나눌래
      </CustomButton>
      <CustomButton
        size="s"
        color="active"
        handleButtonClicked={openTarotSpread}
      >
        좋아, 타로 카드를 뽑을래
      </CustomButton>
    </div>
  );

  const tarotSpreadButton = displayTarotSpreadButton && (
    <div className="absolute top-80 left-40">
      <CustomButton
        size="m"
        color="dark"
        handleButtonClicked={openTarotSpread}
      >
        타로 카드
      </CustomButton>
    </div>
  );

  useEffect(() => {
    setTarotCardEventListener(() => setDisplayAskTarotCardButtons(true));
  }, []);

  return { askTarotCardButtons, tarotSpreadButton };
}
