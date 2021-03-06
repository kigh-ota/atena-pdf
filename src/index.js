const CsvLoader = require('./core/CsvLoader');
const PdfGenerator = require('./core/PdfGenerator/PdfGenerator');
const NENGA_POSTCARD_LAYOUT = require('./core/PdfGenerator/Layout').NENGA_POSTCARD;
const program = require('commander');
const fs = require('fs');

program
  .option('--to <toCsvPath>', '宛先データ(CSV) [必須]')
  .option('--from <fromJsonPath>', '差出人データ(JSON)')
  .option('--columnMap <columnMapJsonPath>', 'CSVのカラム名')
  .option('--showFrames', '確認用の枠を出力する')
  .parse(process.argv);

if (!program.to) {
  program.outputHelp();
  process.exit(1);
}

let from;
if (program.from) {
  from = JSON.parse(fs.readFileSync(program.from, {encoding: 'utf-8'}));
}

let columnMap;
if (program.columnMap) {
  columnMap = JSON.parse(fs.readFileSync(program.columnMap, {encoding: 'utf-8'}));
}
const entries = new CsvLoader().loadCsvFile(program.to, columnMap);

PdfGenerator.generate(entries.map(entry => {
  return {to: entry, from};
}), NENGA_POSTCARD_LAYOUT, 'fonts/ipaexm.ttf', program.showFrames);
