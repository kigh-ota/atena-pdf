
function toFullWidthArabicNumber(c) {
  if (c === '1') return '１';
  if (c === '2') return '２';
  if (c === '3') return '３';
  if (c === '4') return '４';
  if (c === '5') return '５';
  if (c === '6') return '６';
  if (c === '7') return '７';
  if (c === '8') return '８';
  if (c === '9') return '９';
  if (c === '0') return '０';
  return c;
}

// eslint-disable-next-line
function toKanjiNumber(c) {
  const cc = toFullWidthArabicNumber(c);
  if (cc === '１') return '一';
  if (cc === '２') return '二';
  if (cc === '３') return '三';
  if (cc === '４') return '四';
  if (cc === '５') return '五';
  if (cc === '６') return '六';
  if (cc === '７') return '七';
  if (cc === '８') return '八';
  if (cc === '９') return '九';
  if (cc === '０') return '〇';
  return cc;
}