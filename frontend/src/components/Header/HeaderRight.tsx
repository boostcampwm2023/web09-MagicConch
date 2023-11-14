interface HeaderRightProps {
  items: React.ReactNode[];
}

export default function HeaderRight(props: HeaderRightProps) {
  return <div>{props.items}</div>;
};
