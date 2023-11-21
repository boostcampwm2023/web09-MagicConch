import html2canvas from 'html2canvas';
import { RefObject } from 'react';

export async function downloadImage(ref: RefObject<HTMLDivElement>) {
  if (!ref.current) {
    throw new Error('ref.current is null');
  }

  const canvas = await html2canvas(ref.current, {
    windowWidth: 1920,
    windowHeight: 1080,
    // ignoreElements는 해당 함수의 반환값이 true이면 해당 엘리먼트를 무시한다.
    ignoreElements: el => el.classList.contains('ignore-html2canvas'),
  });
  const link = document.createElement('a');

  document.body.appendChild(link);

  link.href = canvas.toDataURL('image/png');
  link.download = 'result.png';
  link.click();

  document.body.removeChild(link);
}
