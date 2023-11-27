import { IconButton } from '@components/Buttons';

interface CamContainerProps {}

export default function CamContainer({}: CamContainerProps) {
  return (
    <div className="flex-with-center flex-col gap-80 pt-80">
      <div className="flex-with-center gap-64">
        {/* TODO: Cam component가 완성되면 바꿔야 함. */}
        <img
          className="w-320 h-320"
          src="/ddung.png"
        />
        <img
          className="w-320 h-320"
          src="/ddung.png"
        />
      </div>
      <div className="flex-with-center gap-48">
        <IconButton
          icon="pepicons-pop:camera"
          iconColor="textWhite"
          iconSize={28}
          buttonColor="active"
          buttonSize="l"
        />
        <IconButton
          icon="mingcute:mic-line"
          iconColor="textWhite"
          iconSize={28}
          buttonColor="active"
          buttonSize="l"
        />
      </div>
    </div>
  );
}
