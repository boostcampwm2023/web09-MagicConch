import { useState } from 'react';

import { IconToggleButton } from '@components/common/Buttons';

import { getBgmQuery } from '@stores/queries/getBgmQuery';

export function BackgroundMusic() {
  const backgroundMusicURL = getBgmQuery().data.url;
  const [playing, setPlaying] = useState(false);

  return (
    <div className="h-50 w-50 fixed top-[10vh] right-25">
      <div className="absolute top-0 left-0">
        <IconToggleButton
          activeIcon="ic:baseline-music-note"
          inactiveIcon="ic:baseline-music-off"
          active={playing}
        />
      </div>
      <audio
        className="opacity-0 absolute -top-30 -left-2 h-80"
        loop
        controls
        src={backgroundMusicURL}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />
    </div>
  );
}
