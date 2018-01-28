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

function namesContent(names, paper, baseY) {
  let chars = names[0].familyName.split('')
    .concat(names[0].givenName.split(''));
  if (names[0].title) {
    chars = chars.concat(names[0].title.split(''))
  }
  let result = [];
  chars.forEach((text, i) => {
    const fontSize = 30;
    const x = (paper.w() - fontSize) * 0.5;
    const y = baseY + i * fontSize;
    if (y + fontSize >= paper.h()) {
      throw new Error('宛名が用紙をはみ出た');
    }
    result.push({ text, fontSize, absolutePosition: { x, y } });
  });

  return result;
}

function fromNamesContent(names, box) {
  let chars = names[0].familyName.split('')
    .concat(names[0].givenName.split(''));
  if (names[0].title) {
    chars = chars.concat(names[0].title.split(''))
  }
  let result = [];
  chars.forEach((text, i) => {
    const fontSize = 15;
    const x = box.x() + (box.w() - fontSize) * 0.5;
    const y = box.y() + i * fontSize;
    result.push({ text, fontSize, absolutePosition: { x, y } });
  });

  return result;
}

function postalCodeContent(codes, boxes) {
  let result = [];
  for (let i = 0; i < 7; i++) {
    const fontSize = 10;
    const box = boxes[i];
    const x = box.x() + (box.w() - fontSize) * 0.5;
    const y = box.y() + (box.h() - fontSize) * 0.5;
    result.push({text: codes[i], fontSize, absolutePosition: {x, y}});
  }
  return result;
}

function postalCodeCanvas(boxes) {
  return boxes.map(box => {
    return {
      type: 'rect',
      x: box.x(),
      y: box.y(),
      w: box.w(),
      h: box.h()
    };
  });
}

exports.makeContent = (data, layout) => {
  let result = [];
  let canvas = [];
  // to.postalCode
  result = result.concat(postalCodeContent(data.to.postalCode, layout.postalCode));
  canvas = canvas.concat(postalCodeCanvas(layout.postalCode));
  // to.address
  result = result.concat(addressContent(data.to.address, layout.address));
  // to.names
  result = result.concat(namesContent(data.to.names, layout.paper, mm2pt(30)));
  // from.postalCode
  result = result.concat(postalCodeContent(data.from.postalCode, layout.fromPostalCode));
  canvas = canvas.concat(postalCodeCanvas(layout.fromPostalCode));
  // from.address
  result = result.concat(addressContent(data.from.address, layout.fromAddress));
  // from.names
  result = result.concat(fromNamesContent(data.from.names, layout.fromNames));

  result.push({canvas})
  console.log(result);
  return result;
};


