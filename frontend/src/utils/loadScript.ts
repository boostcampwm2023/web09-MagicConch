export function loadScript(src: string, intergrity: string = '', crossOrigin: string = 'anonymous') {
  return new Promise((resolve, reject) => {
    try {
      const body = document.querySelector('body');
      const script = document.createElement('script');

      script.onload = () => {
        resolve(script);
      };
      script.src = src;
      script.integrity = intergrity;
      script.crossOrigin = crossOrigin;
      script.async = true;

      body?.appendChild(script);
    } catch (e) {
      reject(e);
    }
  });
}
