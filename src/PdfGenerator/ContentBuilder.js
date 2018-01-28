const mm2pt = require('../util').mm2pt;

function fillBox(text, box) {
}

function addressContent(body, box) {
  const lines = body.length;
  const columns = Math.max.apply(this, body.map(line => line.length));
  console.log(columns);
  // w <=> lines * fontSize
  // h <=> columns * fontSize
  const ratio = lines / columns;
  const targetRatio = box.w() / box.h();
  const fitByWidth = ratio > targetRatio;
  // set font size
  // TODO limit max/min font size
  const fontSize = fitByWidth ? box.w() / lines : box.h() / columns;

  // 垂直上、水平中央
  let result = [];
  const baseX = box.x() + box.w() / 2 + (lines - 2) * fontSize / 2;
  body.forEach((line, i) => {
    const x = baseX - i * fontSize;
    line.split('').forEach((text, j) => {
      const y = box.y() + j * fontSize;
      result.push({ text, fontSize, absolutePosition: { x, y } });
    });
  });

  return result;
}

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
  result = result.concat(addressContent(data.to.address, layout.address));

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
  result = result.concat(addressContent(data.from.address, layout.fromAddress));

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


