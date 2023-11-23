interface CamBoxProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  defaultImag: 'ddung' | 'sponge';
  cameraConnected: boolean;
}

const CamBox = ({ videoRef, defaultImag, cameraConnected }: CamBoxProps) => {
  // const a = videoRef.current
  // const imageSrc = `${}`
  // const existVideo = videoRef.current?.srcObject ? true : false;
  // console.log(cameraConnected);
  return (
    <>
      <div className="flex">
        {/* {!cameraConnected && (
          <img
            src={defaultImageSrc}
            className="absolute w-320 h-320 left-1/2"
          />
        )} */}
        <video
          className={`flex-1 rounded-[3.3rem] w-320 max-w-full ${!cameraConnected && `bg-${defaultImag}`}`}
          ref={videoRef}
          autoPlay
          playsInline
        />
      </div>
    </>
  );
};

export default CamBox;
