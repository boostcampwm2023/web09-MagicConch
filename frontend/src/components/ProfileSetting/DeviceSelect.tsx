import CustomSelect, { CustomSelectOptions } from '@components/CustomSelect';

interface DeviceSelectProps {
  name: string;
  deviceList: CustomSelectOptions[];
  onChange: (deviceId: string) => void;
}

export default function DeviceSelect({ name, deviceList, onChange }: DeviceSelectProps) {
  return (
    <div className="flex flex-col gap-4 w-300 h-80">
      <span className="text-strong display-bold14">사용할 {name} 장치를 선택하세요.</span>
      <CustomSelect
        options={deviceList}
        onChange={({ value }) => onChange(value)}
      />
    </div>
  );
}
