interface HeaderRightProps {
  items?: React.ReactNode[];
}

export function HeaderRight({ items }: HeaderRightProps) {
  return <div className="flex gap-16">{items}</div>;
}
