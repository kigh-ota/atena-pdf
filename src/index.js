const CsvLoader = require('./CsvLoader');
const PdfGenerator = require('./PdfGenerator/PdfGenerator');
const NENGA_POSTCARD_LAYOUT = require('./PdfGenerator/Layout').NENGA_POSTCARD;
const testdata = require('./testdata');

const entries = new CsvLoader().loadCsv('./test.csv');
PdfGenerator.generate({to: entries[0], from: testdata.json.from}, NENGA_POSTCARD_LAYOUT, 'fonts/ipaexm.ttf');
