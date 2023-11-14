import { Icon } from '@iconify/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

import CustomButton from '../CustomButton';

const GET_BGM_API =
  'https://www.viodio.io/_api/v1/musics/627c8e78715664b72b9bee90/audios/dcbfe1206d7b4410a7e71963bc9e2e4d?auto_play=true';

function BackgroundMusic() {
  const [backgroundMusicURL, setBackgroundMusicURL] = useState('');
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    axios.get(GET_BGM_API).then(res => setBackgroundMusicURL(res.data.url));
  }, []);

  return (
    <div className="w-10 h-10 overflow-hidden relative">
      <div className="absolute -top-2 -left-4">
        <CustomButton
          color="transparent"
          size="s"
          children={
            <Icon
              className="text-[36px]"
              icon={playing ? 'ic:baseline-music-note' : 'ic:baseline-music-off'}
            />
          }
        />
      </div>
      <audio
        className="opacity-0 absolute -top-3 -left-2"
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
