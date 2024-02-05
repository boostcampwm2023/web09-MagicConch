import { RefObject } from 'react';

import { IconButton } from '@components/common/Buttons';

import { useShareButtons } from '@business/hooks';

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
            icon={icon ?? ''}
            iconColor={iconColor}
            onClick={onClick}
          >
            {isMobile ? undefined : text}
          </IconButton>
        </li>
      ))}
    </ul>
  );
}
