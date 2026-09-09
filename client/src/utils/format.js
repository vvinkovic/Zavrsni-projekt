export function formatDatum(datumStr) {
  if (!datumStr) return '';
  const [godina, mjesec, dan] = datumStr.split('-');
  return `${dan}.${mjesec}.${godina}.`;
}