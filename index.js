const fonts = {
  IPAexMincho: {
    normal: 'fonts/ipaexm.ttf',
    bold: 'fonts/ipaexm.ttf',
    italics: 'fonts/ipaexm.ttf',
    bolditalics: 'fonts/ipaexm.ttf'
  }
};
const PdfPrinter = require('pdfmake/src/printer');
const printer = new PdfPrinter(fonts);
const fs = require('fs');

function mm2pt(v) {
  return v * 2.8346;
}

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

// TODO 微調整できる
// in mm
// (x,y)は左上
const NENGA_POSTCARD = {
  x: 0,
  y: 0,
  w: mm2pt(100),
  h: mm2pt(148),
  postalCode: {
    w: mm2pt(6),
    h: mm2pt(8),
    x: [
      mm2pt(43.7),
      mm2pt(50.8),
      mm2pt(57.9),
      mm2pt(65.3),
      mm2pt(72.2),
      mm2pt(79.1),
      mm2pt(86.0),
    ],
    y: mm2pt(11.7)
  },
  address: {
    x: mm2pt(70),
    y: mm2pt(25),
    w: mm2pt(20),
    h: mm2pt(100)
  },
  fromPostalCode: {
    w: mm2pt(4),
    h: mm2pt(6.5),
    x: [
      mm2pt(5),
      mm2pt(9),
      mm2pt(13),
      mm2pt(18),
      mm2pt(22),
      mm2pt(26),
      mm2pt(30),
    ],
    y: mm2pt(122.5)
  },
  fromAddress: {
    x: mm2pt(20),
    y: mm2pt(60),
    w: mm2pt(15),
    h: mm2pt(60)
  }
};

/**
 * Name {
 *   familyName: "山田",
 *   givenName: "太郎",
 *   title?: "様"
 * }
 * Entry {
 *   postalCode: "5400008",
 *   address: "大阪府大阪市中央区大手前2-1-22",
 *   name: Name,
 *   jointNames?: [Name],
 * }
 * Data {
 *   to: Entry,
 *   from?: Entry
 * }
 */
const testData = {
  to: {
    postalCode: "5400008",
    address: "大阪府大阪市中央区大手前2丁目1番22号",
    name: {
      familyName: "山田",
      givenName: "太郎",
      title: "様"
    },
    jointNames: [
      {
        familyName: "山田",
        givenName: "花子",
        title: "様"
      }
    ]
  },
  from: {
    postalCode: "1638001",
    address: "東京都新宿区西新宿２−８−１",
    name: {
      familyName: "佐藤",
      givenName: "小太郎"
    }
  }
}

// TODO ContentBuilder
function makeContent(data, layout) {
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
    const y = layout.address.y + i * size
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
}

const docDefinition = {
  pageSize: {
    width: NENGA_POSTCARD.w,
    height: NENGA_POSTCARD.h
  },
  pageMargins: [0, 0, 0, 0],
  defaultStyle: {
    font: 'IPAexMincho'
  },
  content: makeContent(testData, NENGA_POSTCARD)
};
const pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream('print.pdf'));
pdfDoc.end();
