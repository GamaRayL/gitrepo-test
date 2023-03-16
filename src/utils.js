export function getCorrectDate(d) {
  return new Date(d).toLocaleString('ru', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function createBlur() {
  setTimeout(() => {
    this.style.width = '260px';
  }, 1000);
}
