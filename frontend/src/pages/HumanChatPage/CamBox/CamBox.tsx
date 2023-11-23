interface CamBoxProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  defaultImage: 'bg-ddung' | 'bg-sponge';
  cameraConnected: boolean;
}

const CamBox = ({ videoRef, defaultImage, cameraConnected }: CamBoxProps) => {
  return (
    <>
      <div className="flex">
        <video
          className={`flex-1 rounded-[3.3rem] w-320 max-w-full ${!cameraConnected && defaultImage}`}
          ref={videoRef}
          autoPlay
          playsInline
        />
      </div>
    </>
  );
};

export default CamBox;
