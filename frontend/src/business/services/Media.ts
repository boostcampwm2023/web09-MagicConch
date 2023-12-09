export async function getCameraInputOptions() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const cameraOptions = devices.filter(device => device.kind === 'videoinput');
  return cameraOptions;
}

export async function getAudioInputOptions() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const audiosOptions = devices.filter(device => device.kind === 'audioinput');
  return audiosOptions;
}

export async function getMediaDeviceOptions() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const cameraOptions = devices.filter(device => device.kind === 'videoinput');
  const audiosOptions = devices.filter(device => device.kind === 'audioinput');
  return { cameraOptions, audiosOptions };
}

export async function getUserMediaStream({
  audio,
  video,
}: {
  audio: boolean | MediaTrackConstraints | undefined;
  video: boolean | MediaTrackConstraints | undefined;
}) {
  return await navigator.mediaDevices.getUserMedia({ audio, video });
}
