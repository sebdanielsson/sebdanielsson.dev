export function shortenNumberWithK(number: number) {
  if (number >= 10000) {
    return `${Math.floor(number / 1000)}k`;
  } else if (number >= 1000) {
    return `${Math.floor(number / 100) / 10}k`;
  } else {
    return `${number}`;
  }
}
