interface BackgroundProps {
  children?: React.ReactNode;
  type?: 'default' | 'open' | 'close' | 'dynamic';
}

function Background({ children, type = 'default' }: BackgroundProps) {
  const fadeInIfOpen = type == 'open' ? 'animate-fadeIn' : '';
  const fadeOutIfClose = type == 'close' ? 'animate-fadeOut' : '';
  const fadeInIfDynamic = type == 'dynamic' ? 'animate-fadeIn' : '';

  return (
    <div className={`w-h-screen flex flex-with-center  ${fadeInIfOpen} ${fadeOutIfClose}`}>
      <div className="w-h-screen absolute -z-10 flex flex-col flex-with-center ">
        <img
          className="absolute w-h-screen object-cover -z-10"
          src="/bg.png"
          alt="밤 하늘의 배경 이미지"
        />
        <img
          className="absolute w-285 h-285 -z-10 animate-shining top-150"
          src="/moon.png"
          alt="빛나는 마법의 소라 고둥"
        />
        {type != 'default' && <div className={`absolute w-h-screen bg-black/75 ${fadeInIfDynamic}`} />}
      </div>
      {children}
    </div>
  );
}

export default Background;
