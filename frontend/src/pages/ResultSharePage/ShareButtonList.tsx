import { RefObject } from 'react';

import { IconButton } from '@components/Buttons';

import { useShareButtons } from '@business/hooks/useShareButtons';

import { RESULT_SHARE_ICON_SIZE } from '@constants/sizes';

interface ShareButtonListProps {
  cardUrl: string;
  resultSharePageRef: RefObject<HTMLDivElement>;
}

export function ShareButtonList({ cardUrl, resultSharePageRef }: ShareButtonListProps) {
  const { shareButtons } = useShareButtons({ cardUrl, resultSharePageRef });

  return (
    <ul className="w-full h-110 rounded-b-2xl flex flex-all-center gap-12 ignore-html2canvas">
      {Object.entries(shareButtons).map(([key, { icon, iconColor, onClick, text, tooltip }]) => (
        <li
          key={key}
          className={tooltip && 'tooltip'}
          data-tip={tooltip && tooltip}
        >
          <IconButton
            text={text}
            icon={icon}
            iconColor={iconColor}
            iconSize={RESULT_SHARE_ICON_SIZE}
            onClick={onClick}
          />
        </li>
      ))}
    </ul>
  );
}
