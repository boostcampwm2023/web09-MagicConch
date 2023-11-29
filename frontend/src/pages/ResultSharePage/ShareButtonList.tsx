import { RefObject } from 'react';

import { IconButton } from '@components/Buttons';

import { useShareButtons } from '@business/hooks/useShareButtons';

import { RESULT_SHARE_ICON_SIZE } from '@constants/sizes';

interface ShareButtonListProps {
  isMobile: boolean;
  cardUrl: string;
  resultSharePageRef: RefObject<HTMLDivElement>;
}

export function ShareButtonList({ isMobile, cardUrl, resultSharePageRef }: ShareButtonListProps) {
  const { shareButtons } = useShareButtons({ cardUrl, resultSharePageRef });

  return (
    <ul className="w-full h-110 rounded-b-2xl flex-with-center gap-12 ignore-html2canvas">
      {Object.entries(shareButtons).map(([key, { icon, iconColor, onClick, text, tooltip }]) => (
        <li
          key={key}
          className={tooltip && 'tooltip'}
          data-tip={tooltip && tooltip}
        >
          <IconButton
            text={isMobile ? '' : text}
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
