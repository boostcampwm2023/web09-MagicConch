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

      return (
        <div className="w-h-screen flex-with-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      );
    });
  };

  return { displayTold };
}
