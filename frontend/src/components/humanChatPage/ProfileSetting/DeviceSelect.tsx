import { Select, SelectOptions } from '@components/common';

interface DeviceSelectProps {
  name: string;
  deviceList: SelectOptions[];
  onChange: (deviceId: string) => void;
  defaultId?: string;
}

export function DeviceSelect({ name, deviceList, defaultId, onChange }: DeviceSelectProps) {
  return (
    <div className="flex flex-col gap-4 w-full h-80">
      <span className="text-strong display-bold14">사용할 {name} 장치를 선택하세요.</span>
      <Select
        width="w-full"
        options={deviceList}
        onChange={({ value }) => onChange(value)}
        defaultId={defaultId}
      />
    </div>
  );
}
