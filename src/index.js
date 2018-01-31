const CsvLoader = require('./CsvLoader');
const PdfGenerator = require('./PdfGenerator/PdfGenerator');
const NENGA_POSTCARD_LAYOUT = require('./PdfGenerator/Layout').NENGA_POSTCARD;
const program = require('commander');
const fs = require('fs');

program
  .option('--to <toCsvPath>', '宛先データ(CSV) [必須]')
  .option('--from <fromJsonPath>', '差出人データ(JSON) [必須]')
  .parse(process.argv);

if (!program.to || !program.from) {
  program.outputHelp();
  process.exit(1);
}

const fromJson = fs.readFileSync(program.from, {encoding: 'utf-8'});
const from = JSON.parse(fromJson);

const entries = new CsvLoader().loadCsvFile(program.to);

PdfGenerator.generate(entries.map(entry => {
  return {to: entry, from};
}), NENGA_POSTCARD_LAYOUT, 'fonts/ipaexm.ttf');
