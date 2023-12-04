import { useState } from 'react';

import { CustomButton } from '@components/Buttons';

import { getBgmQuery } from '@stores/queries/getBgmQuery';

import { Icon } from '@iconify/react';

function BackgroundMusic() {
  const backgroundMusicURL = getBgmQuery().data.url;
  const [playing, setPlaying] = useState(false);

  return (
    <div className="h-50 w-50 overflow-hidden fixed top-[10vh] right-25">
      <div className="absolute top-0 left-0">
        <CustomButton
          color={playing ? 'active' : 'cancel'}
          circle
        >
          <Icon
            className="text-26"
            icon={playing ? 'ic:baseline-music-note' : 'ic:baseline-music-off'}
          />
        </CustomButton>
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

export default BackgroundMusic;
