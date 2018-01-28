const mm2pt = require('../util').mm2pt;

function fillBox(text, box) {
}

function addressContent(body, box) {
  const lines = body.length;
  const columns = Math.max.apply(this, body.map(line => line.length));
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

function namesContent(names, box) {
  const lines = names.length;
  const familyNameColumns = Math.max.apply(this, names.map(name => name.familyName.length));
  const givenNameColumns = Math.max.apply(this, names.map(name => name.givenName.length));
  const titleColumns = Math.max.apply(this, names.map(name => name.title ? name.title.length : 0));
  const columns = familyNameColumns + 0.5 + givenNameColumns + 0.5 + titleColumns;
  const ratio = lines / columns;
  const targetRatio = box.w() / box.h();
  const fitByWidth = ratio > targetRatio;
  const fontSize = fitByWidth ? box.w() / lines : box.h() / columns;

  let result = [];
  const baseX = box.x() + box.w() / 2 + (lines - 2) * fontSize / 2;
  names.forEach((name, i) => {
    const x = baseX - i * fontSize;
    name.familyName.split('').forEach((text, j) => {
      const y = box.y() + j * fontSize;
      result.push({ text, fontSize, absolutePosition: { x, y } });
    });
    name.givenName.split('').forEach((text, j) => {
      const y = box.y() + (familyNameColumns + 0.5 + j) * fontSize;
      result.push({ text, fontSize, absolutePosition: { x, y } });
    });
    if (name.title) {
      name.title.split('').forEach((text, j) => {
        const y = box.y() + (familyNameColumns + 0.5 + givenNameColumns + 0.5 + j) * fontSize;
        result.push({text, fontSize, absolutePosition: {x, y}});
      });
    }
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

function canvasRect(box) {
  return {
    type: 'rect',
    x: box.x(),
    y: box.y(),
    w: box.w(),
    h: box.h()
  };
}

exports.makeContent = (data, layout) => {
  let result = [];
  let canvas = [];
  // to.postalCode
  result = result.concat(postalCodeContent(data.to.postalCode, layout.postalCode));
  canvas = canvas.concat(layout.postalCode.map(canvasRect));
  // to.address
  result = result.concat(addressContent(data.to.address, layout.address));
  canvas = canvas.concat(canvasRect(layout.address));
  // to.names
  result = result.concat(namesContent(data.to.names, layout.names));
  canvas = canvas.concat(canvasRect(layout.names));
  // from.postalCode
  result = result.concat(postalCodeContent(data.from.postalCode, layout.fromPostalCode));
  canvas = canvas.concat(layout.fromPostalCode.map(canvasRect));
  // from.address
  result = result.concat(addressContent(data.from.address, layout.fromAddress));
  canvas = canvas.concat(canvasRect(layout.fromAddress));
  // from.names
  result = result.concat(namesContent(data.from.names, layout.fromNames));
  canvas = canvas.concat(canvasRect(layout.fromNames));

  result.push({canvas})
  console.log(result);
  return result;
};


