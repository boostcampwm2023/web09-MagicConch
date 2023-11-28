import axios from 'axios';
import { useEffect, useState } from 'react';

import { CustomButton } from '@components/Buttons';

import { Icon } from '@iconify/react';

const GET_BGM_API =
  'https://www.viodio.io/_api/v1/musics/627c8e78715664b72b9bee90/audios/dcbfe1206d7b4410a7e71963bc9e2e4d?auto_play=true';

function BackgroundMusic() {
  const [backgroundMusicURL, setBackgroundMusicURL] = useState('');
  const [playing, setPlaying] = useState(false);

  useEffect(() => getBackgroundURL(), []);

  const getBackgroundURL = () => {
    axios.get(GET_BGM_API).then(res => setBackgroundMusicURL(res.data.url));
  };

  return (
    <div className="h-50 w-50 overflow-hidden fixed top-[10vh] right-[5vw]">
      <div className="absolute top-0 left-0">
        <CustomButton
          color={playing ? 'active' : 'disabled'}
          size="l"
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
        onError={getBackgroundURL}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />
    </div>
  );
}

export default BackgroundMusic;
