const TOLD = {
  init: () => ((window as any).dataLayer = []),
  displayForm: (type: string) => (window as any).dataLayer.push({ event: type }),
  isFormVisible: () => {
    const container = document.querySelector('#told-container');
    return container?.innerHTML ?? false;
  },
};

TOLD.init();

export default TOLD;
