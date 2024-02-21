import TagManager from 'react-gtm-module';

const tagManagerArgs = {
  gtmId: 'GTM-55JJ73F3',
};

TagManager.initialize(tagManagerArgs);

const TOLD = {
  displayForm: (type: string) => TagManager.dataLayer({ dataLayer: { event: type } }),
  isFormVisible: () => {
    const container = document.querySelector('#told-container');
    return container?.innerHTML ?? false;
  },
};

export default TOLD;
