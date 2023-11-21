interface ResultImageProps {
  cardUrl: string;
}

export function ResultImage({ cardUrl }: ResultImageProps) {
  return (
    <div className="w-384 h-640 rounded-2xl flex flex-all-center">
      <img
        className="rounded-2xl"
        src={cardUrl}
      />
    </div>
  );
}
