interface HeaderRightProps {
  items: React.ReactNode[];
}

export default function HeaderRight(props: HeaderRightProps) {
  return <div className="flex gap-[16px]">{props.items}</div>;
};
