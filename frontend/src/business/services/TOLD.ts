const TOLD = {
  displayForm: (type: string) => (window as any).dataLayer.push({ event: type }),
  isFormVisible: () => {
    const container = document.querySelector('#told-container');
    return container?.innerHTML ?? false;
  },
};

export default TOLD;
