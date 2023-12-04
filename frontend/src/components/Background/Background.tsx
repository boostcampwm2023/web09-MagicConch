import { useEffect, useState } from 'react';

interface BackgroundProps {
  children?: React.ReactNode;
  type?: 'default' | 'open' | 'close' | 'dynamic';
}

function Background({ children, type = 'default' }: BackgroundProps) {
  const html = document.querySelector('html');
  const [conchAnimation, setConchAnimation] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(html?.dataset.theme === 'dark');
  const [initMode, setInitMode] = useState<boolean>(true);

  const fadeInIfOpen = type === 'open' ? 'animate-fadeIn' : '';
  const fadeOutIfClose = type === 'close' ? 'animate-fadeOut' : '';
  const fadeInIfDynamic = type === 'dynamic' ? 'animate-fadeIn' : '';

  useEffect(() => {
    addEventListener('animationend', removeAnimation);
    return () => removeEventListener('animationend', removeAnimation);
  }, []);

  const removeAnimation = ({ animationName }: AnimationEvent) => {
    if (animationName === 'rotatingConch') setConchAnimation(false);
  };

  const toggleTheme = () => {
    if (!html) return;
    if (initMode) setInitMode(false);

    const theme = html.dataset.theme;
    html.dataset.theme = theme === 'dark' ? 'light' : 'dark';
    setDarkMode(!darkMode);
    setConchAnimation(true);
  };

  return (
    <div className={`w-h-screen flex flex-with-center  ${fadeInIfOpen} ${fadeOutIfClose}`}>
      <div className="w-h-screen absolute flex flex-col flex-with-center">
        <img
          className={`absolute w-h-screen object-cover
          ${!initMode && (darkMode ? 'animate-fadeOut' : 'animate-fadeIn')}`}
          src="/bg-light.png"
          alt="낮하늘 배경 이미지"
        />
        <img
          className={`absolute w-h-screen object-cover ${initMode && !darkMode && 'hidden'} 
          ${!initMode && (darkMode ? 'animate-fadeIn' : 'animate-fadeOut')}`}
          src="/bg-night.png"
          alt="밤하늘 배경 이미지"
        />

        <button
          className={`absolute -bottom-[20%] -translate-y-[65vh] lg:hover:scale-105 transition-transform
          ${conchAnimation && 'animate-rotatingConch'}`}
          onClick={toggleTheme}
        >
          <img
            className="animate-shining w-[35vh] h-[35vh] "
            src="/moon.png"
            alt="빛나는 마법의 소라 고둥"
          />
        </button>
        {type != 'default' && (
          <div className={`absolute w-h-screen ${darkMode ? 'bg-black/75' : 'bg-neutral-500/60'} ${fadeInIfDynamic}`} />
        )}
      </div>

      {children}
    </div>
  );
}

export default Background;
