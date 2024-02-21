const TOLD = {
  displayForm: (type: string) => {
    const button = document.createElement('button');
    button.innerText = type;
    button.click();
    console.log('displayForm', type);
  },
  isFormVisible: () => {
    const container = document.querySelector('#told-container');
    return container?.innerHTML ?? false;
  },
};

export default TOLD;
