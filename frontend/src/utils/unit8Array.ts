export function calculateAverage(array: Uint8Array) {
  return array.reduce((acc, value) => acc + value, 0);
}
