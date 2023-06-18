export default function arrayToMap<T>(
  array: T[],
  key = "id"
): Record<string, T> {
  const result: Record<string, T> = {};

  for (const item of array) {
    // @ts-ignore
    result[item[key]] = item;
  }

  return result;
}
