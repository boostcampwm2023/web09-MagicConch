import WebRTC from '@business/services/__mocks__/WebRTC';

import { ProfileInfo } from '@stores/zustandStores/useProfileInfo';

import { array2ArrayBuffer } from '@utils/array';

const webRTC = WebRTC.getInstance();

export async function setMediaStates({
  ev: { data },
  setRemoteMicOn,
  setRemoteVideoOn,
}: {
  ev: MessageEvent<any>;
  setRemoteMicOn: (onOrOff: boolean) => void;
  setRemoteVideoOn: (onOrOff: boolean) => void;
}) {
  const mediaInfoArray = JSON.parse(data);

  mediaInfoArray.forEach(({ type, onOrOff }: { type: string; onOrOff: boolean }) => {
    if (type === 'audio') {
      setRemoteMicOn(onOrOff);
    } else if (type === 'video') {
      setRemoteVideoOn(onOrOff);
    }
  });
}

export function setRemoteProfileImageState({
  ev: { data },
  setRemoteProfileImage,
}: {
  ev: MessageEvent<any>;
  setRemoteProfileImage: (profileInfo: ProfileInfo) => void;
}) {
  const receivedData = JSON.parse(data);

  const { type, arrayBuffer: array } = receivedData;

  const arrayBuffer = array2ArrayBuffer(array);

  setRemoteProfileImage({ arrayBuffer, type });
}

export function setRemoteNicknameState({
  ev: { data },
  setRemoteNickname,
}: {
  ev: MessageEvent<any>;
  setRemoteNickname: (nickname: string) => void;
}) {
  setRemoteNickname(data);
}

export function sendNowMediaStates(this: RTCDataChannel) {
  const audioTrack = webRTC.getFirstAudioTrack();
  const videoTrack = webRTC.getFirstVideoTrack();

  this.send(
    JSON.stringify([
      { type: 'audio', onOrOff: audioTrack?.enabled },
      { type: 'video', onOrOff: videoTrack?.enabled },
    ]),
  );
}

export function sendMyProfileImage(this: RTCDataChannel, { myProfile }: { myProfile: ProfileInfo | undefined }) {
  this.send(JSON.stringify({ myProfile }));
}

export function sendMyNickname(this: RTCDataChannel, { myNickname }: { myNickname: string | undefined }) {
  if (!myNickname) {
    return;
  }
  this.send(myNickname);
}
