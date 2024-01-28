interface ContentAreaProps {
  children: React.ReactNode;
}

export default function ContentArea({ children }: ContentAreaProps) {
  return <article className="w-screen h-full flex justify-center">{children}</article>;
}
