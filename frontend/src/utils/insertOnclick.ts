export function insertOnclick<T extends { onClick?: () => void }>(value: T, onClick: () => void) {
  value.onClick = onClick;
  return value;
}
