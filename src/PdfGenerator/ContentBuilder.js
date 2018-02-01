module.exports = class ContentBuilder {
  constructor() {
    this._contents = [];
  }

  build(entries, layout, showFrames) {
    if (!(entries instanceof Array)) {
      throw new Error();
    }
    let frameCanvas = showFrames ? this._buildFrames(layout) : null;

    this._contents = [];
    entries.forEach((entry, i) => {
      if (showFrames) {
        this._contents.push({canvas: frameCanvas});
      }
      this._buildEntry(entry, layout, i === entries.length - 1);
    });

    // console.log(result);
    return this._contents;
  }

  _buildFrames(layout) {
    return Array.prototype.concat.apply([], [
      layout.postalCode.map(canvasRect),
      canvasRect(layout.address),
      canvasRect(layout.names),
      layout.fromPostalCode.map(canvasRect),
      canvasRect(layout.fromAddress),
      canvasRect(layout.fromNames),
    ]);
  }

  _buildEntry(entry, layout, isLastPage) {
    // to.postalCode
    if (entry.to.postalCode) {
      const toPostalCodeFontSize = this._postalCodeContent(entry.to.postalCode, layout.postalCode, 11);
      console.log(`to.postalCode: ${toPostalCodeFontSize} pt`);
    }

    // to.address
    const toAddressFontSize = this._addressContent(entry.to.address, layout.address);
    console.log(`to.address: ${toAddressFontSize} pt`);

    // to.names
    const toNamesFontSize = this._namesContent(entry.to.names, layout.names);
    console.log(`to.names: ${toNamesFontSize} pt`);

    // from.postalCode
    if (entry.from.postalCode) {
      const fromPostalCodeFontSize = this._postalCodeContent(entry.from.postalCode, layout.fromPostalCode, 9);
      console.log(`from.postalCode: ${fromPostalCodeFontSize} pt`);
    }

    // from.address
    const fromAddressFontSize = this._addressContent(entry.from.address, layout.fromAddress);
    console.log(`from.address: ${fromAddressFontSize} pt`);

    // from.names
    const fromNamesFontSize = this._namesContent(entry.from.names, layout.fromNames);
    console.log(`from.names: ${fromNamesFontSize} pt`);

    if (!isLastPage) {
      this._insertPageBreak();
    }
  }

  _insertPageBreak() {
    this._contents.push({ text: '', pageBreak: 'after'});
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
