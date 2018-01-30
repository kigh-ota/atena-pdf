const PdfPrinter = require('pdfmake/src/printer');
const fs = require('fs');
const ContentBuilder = require('./ContentBuilder');

/**
 * Entry:
 *   to: [ToEntry]
 *   from: FromEntry
 *
 * ToEntry:
 *   postalCode
 *   address
 *   names: [ToName]
 *
 * ToName:
 *   familyName
 *   givenName
 *   title
 *
 * FromEntry:
 *   postalCode
 *   address
 *   names: [FromName]
 *
 * FromName:
 *   familyName
 *   givenName
 */
exports.generate = (entries, layout, pathToTtf) => {
  const docDefinition = {
    pageSize: {
      width: layout.paper.w(),
      height: layout.paper.h()
    },
    pageMargins: [0, 0, 0, 0],
    content: new ContentBuilder().build(entries, layout, true),
  };

  const fonts = {
    Roboto: {
      normal: pathToTtf,
      bold: pathToTtf,
      italics: pathToTtf,
      bolditalics: pathToTtf
    }
  };

  const pdfDoc = new PdfPrinter(fonts).createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream('out/print.pdf'));
  pdfDoc.end();
};
