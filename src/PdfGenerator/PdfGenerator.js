const PdfPrinter = require('pdfmake/src/printer');
const fs = require('fs');
const ContentBuilder = require('./ContentBuilder');

const fonts = {
  IPAexMincho: {
    normal: 'fonts/ipaexm.ttf',
    bold: 'fonts/ipaexm.ttf',
    italics: 'fonts/ipaexm.ttf',
    bolditalics: 'fonts/ipaexm.ttf'
  }
};

exports.generate = (data, layout) => {
  const docDefinition = {
    pageSize: {
      width: layout.paper.w,
      height: layout.paper.h
    },
    pageMargins: [0, 0, 0, 0],
    defaultStyle: {
      font: 'IPAexMincho'
    },
    content: ContentBuilder.makeContent(data, layout),
  };
  const printer = new PdfPrinter(fonts);
  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream('out/print.pdf'));
  pdfDoc.end();
};
