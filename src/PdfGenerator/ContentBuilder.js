module.exports = class ContentBuilder {
  constructor() {
    this._contents = [];
  }

  build(data, layout, showFrames) {
    this._contents = [];
    let canvas = [];
    // to.postalCode
    const toPostalCodeFontSize = this._postalCodeContent(data.to.postalCode, layout.postalCode, 11);
    console.log(`to.postalCode: ${toPostalCodeFontSize} pt`);
    canvas = canvas.concat(layout.postalCode.map(canvasRect));
    // to.address
    const toAddressFontSize = this._addressContent(data.to.address, layout.address);
    console.log(`to.address: ${toAddressFontSize} pt`);
    canvas = canvas.concat(canvasRect(layout.address));
    // to.names
    const toNamesFontSize = this._namesContent(data.to.names, layout.names);
    console.log(`to.names: ${toNamesFontSize} pt`);
    canvas = canvas.concat(canvasRect(layout.names));
    // from.postalCode
    const fromPostalCodeFontSize = this._postalCodeContent(data.from.postalCode, layout.fromPostalCode, 9);
    console.log(`from.postalCode: ${fromPostalCodeFontSize} pt`);
    canvas = canvas.concat(layout.fromPostalCode.map(canvasRect));
    // from.address
    const fromAddressFontSize = this._addressContent(data.from.address, layout.fromAddress);
    console.log(`from.address: ${fromAddressFontSize} pt`);
    canvas = canvas.concat(canvasRect(layout.fromAddress));
    // from.names
    const fromNamesFontSize = this._namesContent(data.from.names, layout.fromNames);
    console.log(`from.names: ${fromNamesFontSize} pt`);
    canvas = canvas.concat(canvasRect(layout.fromNames));

    if (showFrames) {
      this._contents.push();
      this._contents.push({canvas});
    }
    // console.log(result);
    return this._contents;
  }

  _addressContent(body, box) {
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
    const baseX = box.x() + box.w() / 2 + (lines - 2) * fontSize / 2;
    body.forEach((line, i) => {
      const x = baseX - i * fontSize;
      line.split('').forEach((text, j) => {
        const y = box.y() + j * fontSize;
        this._contents.push({ text, fontSize, absolutePosition: { x, y } });
      });
    });

    return fontSize;
  }

  _namesContent(names, box) {
    const lines = names.length;
    const familyNameColumns = Math.max.apply(this, names.map(name => name.familyName.length));
    const givenNameColumns = Math.max.apply(this, names.map(name => name.givenName.length));
    const titleColumns = Math.max.apply(this, names.map(name => name.title ? name.title.length : 0));
    const columns = familyNameColumns + 0.5 + givenNameColumns + 0.5 + titleColumns;
    const ratio = lines / columns;
    const targetRatio = box.w() / box.h();
    const fitByWidth = ratio > targetRatio;
    const fontSize = fitByWidth ? box.w() / lines : box.h() / columns;

    const baseX = box.x() + box.w() / 2 + (lines - 2) * fontSize / 2;
    names.forEach((name, i) => {
      const x = baseX - i * fontSize;
      name.familyName.split('').forEach((text, j) => {
        const y = box.y() + j * fontSize;
        this._contents.push({ text, fontSize, absolutePosition: { x, y } });
      });
      name.givenName.split('').forEach((text, j) => {
        const y = box.y() + (familyNameColumns + 0.5 + j) * fontSize;
        this._contents.push({ text, fontSize, absolutePosition: { x, y } });
      });
      if (name.title) {
        name.title.split('').forEach((text, j) => {
          const y = box.y() + (familyNameColumns + 0.5 + givenNameColumns + 0.5 + j) * fontSize;
          this._contents.push({text, fontSize, absolutePosition: {x, y}});
        });
      }
    });

    return fontSize;
  }

  _postalCodeContent(codes, boxes, fontSize) {
    for (let i = 0; i < 7; i++) {
      const box = boxes[i];
      const x = box.x() + (box.w() - fontSize) * 0.5;
      const y = box.y() + (box.h() - fontSize) * 0.5;
      this._contents.push({text: codes[i], fontSize, absolutePosition: {x, y}});
    }
    return fontSize;
  }
};

function canvasRect(box) {
  return {
    type: 'rect',
    x: box.x(),
    y: box.y(),
    w: box.w(),
    h: box.h()
  };
}
