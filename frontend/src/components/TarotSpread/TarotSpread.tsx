import TarotCard from './TarotCard';

interface TarotSpreadProps {
  pickCard: (idx: number) => void;
}

export default function TarotSpread({ pickCard }: TarotSpreadProps) {
  return (
    <div className="w-screen h-screen absolute z-100 flex justify-center items-center">
      <img
        className="w-full h-full object-cover absolute"
        src="/bgConch.png"
        alt="밤 하늘의 배경 이미지"
      />
      <TarotCard onClick={() => pickCard(Math.floor(Math.random() * 21) + 1)} />
    </div>
  );
}
