const mm2pt = require('../util').mm2pt;

exports.makeContent = (data, layout) => {
  let canvas = [];
  let result = [];
  // to.postalCode
  for (let i = 0; i < 7; i++) {
    const fontSize = 8;
    const box = layout.postalCode[i];
    const x = box.x() + (box.w() - fontSize) * 0.5;
    const y = box.y() + (box.h() - fontSize) * 0.5;
    result.push({
      text: data.to.postalCode[i],
      fontSize,
      absolutePosition: { x, y }
    });

    canvas.push({
      type: 'rect',
      x: box.x(),
      y: box.y(),
      w: box.w(),
      h: box.h()
    });
  }
  // to.address
  data.to.address.split('').forEach((c, i) => {
    const size = 14;
    const box = layout.address;
    const x = box.x() + 0.5 * (box.w() - size);
    const y = box.y() + i * size;
    if (y + size >= layout.paper.h()) {
      throw new Error('住所が用紙をはみ出た');
    }
    result.push({
      text: c,
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
    const x = (layout.paper.w() - fontSize) * 0.5;
    const y = mm2pt(30) + i * fontSize
    if (y + fontSize >= layout.paper.h()) {
      throw new Error('宛名が用紙をはみ出た');
    }
    result.push({ text, fontSize, absolutePosition: { x, y } });
  });


  // from.postalCode
  for (let i = 0; i < 7; i++) {
    const fontSize = 8;
    const box = layout.fromPostalCode[i];
    const x = box.x() + (box.w() - fontSize) * 0.5;
    const y = box.y() + (box.h() - fontSize) * 0.5;
    result.push({
      text: data.to.postalCode[i],
      fontSize,
      absolutePosition: { x, y }
    });

    canvas.push({
      type: 'rect',
      x: box.x(),
      y: box.y(),
      w: box.w(),
      h: box.h()
    });
  }
  // from.address
  let box = layout.fromAddress;
  data.from.address.split('').forEach((c, i) => {
    const size = 11;
    const x = box.x() + 0.5 * (box.w() - size);
    const y = box.y() + i * size
    if (y + size >= layout.paper.h()) {
      throw new Error('差出人住所が用紙をはみ出た');
    }
    result.push({
      text: c,
      fontSize: size,
      absolutePosition: { x, y }
    });
  });

  // from.name
  data.from.name.familyName.split('')
  .concat(data.from.name.givenName.split(''))
  .forEach((text, i) => {
    const fontSize = 15;
    const box = layout.fromName;
    const x = box.x() + (box.w() - fontSize) * 0.5;
    const y = box.y() + i * fontSize;
    if (y + fontSize >= layout.paper.h()) {
      throw new Error('宛名が用紙をはみ出た');
    }
    result.push({ text, fontSize, absolutePosition: { x, y } });
  });

  result.push({canvas})
  console.log(result);
  return result;
};


