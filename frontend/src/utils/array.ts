export const shuffledArray = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
};

export const arrayBuffer2Array = (buffer: ArrayBuffer) => {
  const unit8Array = new Uint8Array(buffer);
  const dataArray = Array.from(unit8Array);
  return dataArray;
};

export const arrayBuffer2Blob = (buffer: ArrayBuffer, type: string) => {
  return new Blob([buffer], { type });
};

export const array2ArrayBuffer = (array: any[]) => {
  return new Uint8Array(array).buffer;
};

export const array2Blob = (array: any[], type: string) => {
  return new Blob([new Uint8Array(array)], { type });
};
