interface ResultImageProps {
  cardUrl: string;
}

export function ResultImage({ cardUrl }: ResultImageProps) {
  return (
    <div className="flex flex-with-center">
      <img
        className="w-300 h-500 min-w-300 min-h-450 rounded-2xl"
        src={cardUrl}
      />
    </div>
  );
}
