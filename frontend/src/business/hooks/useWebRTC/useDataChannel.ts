import WebRTC from '@business/services/WebRTC';

import { useMediaInfo } from '@stores/zustandStores/useMediaInfo';
import { useProfileInfo } from '@stores/zustandStores/useProfileInfo';

import { array2ArrayBuffer } from '@utils/array';

export function useDataChannel() {
  const { setRemoteMicOn, setRemoteVideoOn } = useMediaInfo(state => ({
    setRemoteMicOn: state.setRemoteMicOn,
    setRemoteVideoOn: state.setRemoteVideoOn,
  }));
  const { myNickname, myProfile, setRemoteNickname, setRemoteProfileImage } = useProfileInfo(state => ({
    setRemoteNickname: state.setRemoteNickname,
    setRemoteProfileImage: state.setRemoteProfile,
    myNickname: state.myNickname,
    myProfile: state.myProfile,
  }));

  const webRTC = WebRTC.getInstace();

  const initMediaInfoChannel = () => {
    const mediaInfoChannel = webRTC.addDataChannel('mediaInfoChannel');

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
      const audioTrack = webRTC.localStream?.getAudioTracks()[0];
      const videoTrack = webRTC.localStream?.getVideoTracks()[0];

      mediaInfoChannel?.send(
        JSON.stringify([
          { type: 'audio', onOrOff: audioTrack?.enabled },
          { type: 'video', onOrOff: videoTrack?.enabled },
        ]),
      );
    });
  };

  const initChatChannel = () => {
    webRTC.addDataChannel('chatChannel');
  };

  const initProfileChannel = () => {
    const profileChannel = webRTC.addDataChannel('profileChannel');

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
    const nicknameChannel = webRTC.addDataChannel('nicknameChannel');

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
