import useOverlay from './useOverlay';

export default function useTOLD() {
  const event = new Event('TOLD');

  const { open } = useOverlay();

  const displayTold = () => {
    window.dispatchEvent(event);

    open(({ close }) => {
      const interval = setInterval(() => {
        const container = document.querySelector('#told-container');
        if (container && !container?.innerHTML) {
          return;
        }
        close();
        clearInterval(interval);
      }, 1000);

      return <span className="loading loading-spinner loading-lg"></span>;
    });
  };

  return { displayTold };
}
