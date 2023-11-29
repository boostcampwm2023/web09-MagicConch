interface ResultImageProps {
  cardUrl: string;
}

export function ResultImage({ cardUrl }: ResultImageProps) {
  return (
    <div className="flex-with-center">
      <img
        className="w-300 h-500 sm:w-220 sm:h-400 min-w-300 sm:min-w-0 rounded-2xl"
        src={cardUrl}
        alt="타로 카드 결과 이미지"
      />
    </div>
  );
}
