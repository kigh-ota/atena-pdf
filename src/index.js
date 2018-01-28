const PdfPrinter = require('pdfmake/src/printer');
const fs = require('fs');
const ContentBuilder = require('./ContentBuilder');
const mm2pt = require('./util').mm2pt;

const fonts = {
  IPAexMincho: {
    normal: 'fonts/ipaexm.ttf',
    bold: 'fonts/ipaexm.ttf',
    italics: 'fonts/ipaexm.ttf',
    bolditalics: 'fonts/ipaexm.ttf'
  }
};

const printer = new PdfPrinter(fonts);

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
};


const docDefinition = {
  pageSize: {
    width: NENGA_POSTCARD.w,
    height: NENGA_POSTCARD.h
  },
  pageMargins: [0, 0, 0, 0],
  defaultStyle: {
    font: 'IPAexMincho'
  },
  content: ContentBuilder.makeContent(testData, NENGA_POSTCARD)
};
const pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream('out/print.pdf'));
pdfDoc.end();
