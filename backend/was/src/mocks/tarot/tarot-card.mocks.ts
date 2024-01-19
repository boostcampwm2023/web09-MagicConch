import { TarotCard } from 'src/tarot/entities';

function makeTarotCardMock(): TarotCard {
  const tarotCard: TarotCard = new TarotCard();
  tarotCard.cardNo = 0;
  tarotCard.ext = '.jpg';
  return tarotCard;
}

export const tarotCardMock: TarotCard = makeTarotCardMock();
