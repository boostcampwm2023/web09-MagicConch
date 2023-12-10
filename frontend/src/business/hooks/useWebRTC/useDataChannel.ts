import { useMediaInfo } from '@stores/zustandStores/useMediaInfo';
import { useProfileInfo } from '@stores/zustandStores/useProfileInfo';

import { array2ArrayBuffer } from '@utils/array';

import WebRTC from './WebRTC';

export function useDataChannel() {
  const { myMicOn, myVideoOn, setRemoteMicOn, setRemoteVideoOn } = useMediaInfo(state => ({
    myMicOn: state.myMicOn,
    myVideoOn: state.myVideoOn,
    setRemoteMicOn: state.setRemoteMicOn,
    setRemoteVideoOn: state.setRemoteVideoOn,
  }));
  const { myNickname, myProfile, setRemoteNickname, setRemoteProfileImage } = useProfileInfo(state => ({
    setRemoteNickname: state.setRemoteNickname,
    setRemoteProfileImage: state.setRemoteProfile,
    myNickname: state.myNickname,
    myProfile: state.myProfile,
  }));

  const { addDataChannel } = WebRTC.getInstace();

  const initMediaInfoChannel = () => {
    const mediaInfoChannel = addDataChannel('mediaInfoChannel');

    mediaInfoChannel?.addEventListener('message', ({ data }) => {
      const mediaInfoArray = JSON.parse(data);

      mediaInfoArray.forEach(({ type, onOrOff }: { type: string; onOrOff: boolean }) => {
        if (type === 'audio') {
          setRemoteMicOn(onOrOff);
        } else if (type === 'video') {
          setRemoteVideoOn(onOrOff);
        }
      });
    });

    mediaInfoChannel?.addEventListener('open', function () {
      this.send(
        JSON.stringify([
          { type: 'audio', onOrOff: myMicOn },
          { type: 'video', onOrOff: myVideoOn },
        ]),
      );
    });
  };

  const initChatChannel = () => {
    addDataChannel('chatChannel');
  };

  const initProfileChannel = () => {
    const profileChannel = addDataChannel('profileChannel');

    profileChannel?.addEventListener('message', ({ data }) => {
      const receivedData = JSON.parse(data);

      const { type, arrayBuffer: array } = receivedData;

      const arrayBuffer = array2ArrayBuffer(array);

      setRemoteProfileImage({ arrayBuffer, type });
    });

    profileChannel?.addEventListener('open', function () {
      this.send(JSON.stringify({ myProfile }));
    });
  };

  const initNicknameChannel = () => {
    const nicknameChannel = addDataChannel('nicknameChannel');

    nicknameChannel?.addEventListener('message', ({ data }) => {
      setRemoteNickname(data);
    });

    nicknameChannel?.addEventListener('open', function () {
      if (!myNickname) {
        return;
      }
      this.send(myNickname);
    });
  };

  const initDataChannels = () => {
    initMediaInfoChannel();
    initChatChannel();
    initProfileChannel();
    initNicknameChannel();
  };

  return { initDataChannels };
}
