export function getCorrectDate(d) {
  return new Date(d).toLocaleString('ru', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
