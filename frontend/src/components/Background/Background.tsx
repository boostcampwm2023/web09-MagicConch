interface BackgroundProps {
  children?: React.ReactNode;
  type?: 'default' | 'static' | 'dynamic';
}

function Background({ children, type = 'default' }: BackgroundProps) {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-80">
      <img
        className="absolute w-full h-full object-cover -z-10"
        src="/bg.png"
        alt="밤 하늘의 배경 이미지"
      />
      <img
        className="absolute w-285 h-285 -z-10 animate-shining top-150"
        src="/moon.png"
        alt="빛나는 마법의 소라 고둥"
      />
      {type != 'default' && (
        <div className={`absolute w-full h-full bg-black/75 ${type == 'dynamic' && 'animate-fadeIn'}`} />
      )}
      {children}
    </div>
  );
}

export default Background;
