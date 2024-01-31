import useOverlay from './useOverlay';

type TOLD_TYPE = 'AI' | 'HUMAN';

export default function useTOLD(event: TOLD_TYPE) {
  const global = window as any;
  const { openOverlay } = useOverlay();

  const displayTold = () => {
    global.dataLayer.push({ event });

    openOverlay(({ closeOverlay }) => {
      const interval = setInterval(() => {
        const container = document.querySelector('#told-container');
        if (container && !container.innerHTML) {
          return;
        }
        closeOverlay();
        clearInterval(interval);
      }, 1000);

      return (
        <div className="w-h-screen flex-with-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      );
    });
  };

  return { displayTold };
}
