
function isValidOIB(oib) {
  if (!/^\d{11}$/.test(oib)) return false;

  let a = 10;
  for (let i = 0; i < 10; i++) {
    a = (a + parseInt(oib[i], 10)) % 10;
    if (a === 0) a = 10;
    a = (a * 2) % 11;
  }
  const kontrolna = (11 - a) % 10;
  return kontrolna === parseInt(oib[10], 10);
}

module.exports = { isValidOIB };