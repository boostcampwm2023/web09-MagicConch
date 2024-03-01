export function isProdctionMode() {
  return import.meta.env.MODE === 'production';
}