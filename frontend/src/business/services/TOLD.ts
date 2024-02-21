const TOLD = {
  displayForm: (type: string) => {
    const button = document.createElement('button');
    button.innerText = type;
    button.style.display = 'none';
    document.body.appendChild(button);
    button.click();
    document.body.removeChild(button);
    console.log('displayForm', type);
  },
  isFormVisible: () => {
    const container = document.querySelector('#told-container');
    return container?.innerHTML ?? false;
  },
};

export default TOLD;
