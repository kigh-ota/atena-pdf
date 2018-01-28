const mm2pt = require('./util').mm2pt;

exports.makeContent = (data, layout) => {
  let canvas = [];
  let result = [];
  // to.postalCode
  for (let i = 0; i < 7; i++) {
    const fontSize = 8;
    const x = layout.postalCode.x[i] + (layout.postalCode.w - fontSize) * 0.5;
    const y = layout.postalCode.y + (layout.postalCode.h - fontSize) * 0.5;
    result.push({
      text: toFullWidthArabicNumber(data.to.postalCode[i]),
      fontSize,
      absolutePosition: { x, y }
    });

    canvas.push({
      type: 'rect',
      x: layout.postalCode.x[i],
      y: layout.postalCode.y,
      w: layout.postalCode.w,
      h: layout.postalCode.h
    });
  }
  // to.address
  data.to.address.split('').forEach((c, i) => {
    const size = 14;
    const x = layout.address.x + 0.5 * (layout.address.w - size);
    const y = layout.address.y + i * size;
    if (y + size >= layout.h) {
      throw new Error('住所が用紙をはみ出た');
    }
    result.push({
      text: toKanjiNumber(c),
      fontSize: size,
      absolutePosition: { x, y }
    });
  });
  // to.name
  data.to.name.familyName.split('')
  .concat(data.to.name.givenName.split(''))
  .concat(data.to.name.title.split(''))
  .forEach((text, i) => {
    const fontSize = 30;
    const x = (layout.w - fontSize) * 0.5;
    const y = mm2pt(30) + i * fontSize
    if (y + fontSize >= layout.h) {
      throw new Error('宛名が用紙をはみ出た');
    }
    result.push({ text, fontSize, absolutePosition: { x, y } });
  });


  // from.postalCode
  for (let i = 0; i < 7; i++) {
    const fontSize = 8;
    const x = layout.fromPostalCode.x[i] + (layout.fromPostalCode.w - fontSize) * 0.5;
    const y = layout.fromPostalCode.y + (layout.fromPostalCode.h - fontSize) * 0.5;
    result.push({
      text: toFullWidthArabicNumber(data.to.postalCode[i]),
      fontSize,
      absolutePosition: { x, y }
    });

    canvas.push({
      type: 'rect',
      x: layout.fromPostalCode.x[i],
      y: layout.fromPostalCode.y,
      w: layout.fromPostalCode.w,
      h: layout.fromPostalCode.h
    });
  }
  // from.address
  let box = layout.fromAddress;
  data.from.address.split('').forEach((c, i) => {
    const size = 11;
    const x = box.x + 0.5 * (box.w - size);
    const y = box.y + i * size
    if (y + size >= layout.h) {
      throw new Error('差出人住所が用紙をはみ出た');
    }
    result.push({
      text: toKanjiNumber(c),
      fontSize: size,
      absolutePosition: { x, y }
    });
  });

  result.push({canvas})
  console.log(result);
  return result;
};

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

