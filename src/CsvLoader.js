const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const NamesConverter = require('./NamesConverter');

const DEFAULT_COLUMN_MAP = {
  postalCode: 'postalCode',
  address: 'address',
  names: 'names',
  jointNames: 'jointNames',
  title: 'title',
};

module.exports = class CsvLoader {
  constructor() {
    this._namesConverter = new NamesConverter();
  }

  loadCsvFile(csvPath, columnMap) {
    const csv = fs.readFileSync(csvPath, {encoding: 'utf-8'});
    return parse(csv, {columns: true}).map(entry => {
      entry = this._applyColumnMap(entry, columnMap);
      this._assertPropertiesExist(entry);
      return {
        postalCode: this._convertPostalCode(entry.postalCode),
        address: this._convertAddress(entry.address),
        names: this._convertNames(entry.names, entry.jointNames, entry.title),
      };
    });
  }

  _applyColumnMap(entry, columnMap = DEFAULT_COLUMN_MAP) {
    return {
      postalCode: entry[columnMap.postalCode],
      address: entry[columnMap.address],
      names: entry[columnMap.names],
      jointNames: entry[columnMap.jointNames],
      title: entry[columnMap.title],
    };
  }

  _assertPropertiesExist(parsedJson) {
    if (!parsedJson.hasOwnProperty('postalCode') || typeof parsedJson.postalCode !== 'string') {
      throw new Error('No postalCode');
    }
    if (!parsedJson.hasOwnProperty('address') || typeof parsedJson.address !== 'string') {
      throw new Error('No address');
    }
    if (!parsedJson.hasOwnProperty('names') || typeof parsedJson.names !== 'string') {
      throw new Error('No names');
    }
  }

  _convertPostalCode(str) {
    if (!str) {
      return undefined;
    }
    const pc = str
      .replace(/[0-9]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0xFEE0))
      .replace(/[^０-９]/g, '');
    if (pc.length !== 7) {
      throw new Error(`Illegal postalCode: ${str}`);
    }
    return pc;
  }

  _convertAddress(str) {
    return str.split('\n').map(this._convertAddressLine);
  }

  _convertAddressLine(str) {
    return str
      .replace(/[0０]/g, '〇')
      .replace(/[1１]/g, '一')
      .replace(/[2２]/g, '二')
      .replace(/[3３]/g, '三')
      .replace(/[4４]/g, '四')
      .replace(/[5５]/g, '五')
      .replace(/[6６]/g, '六')
      .replace(/[7７]/g, '七')
      .replace(/[8８]/g, '八')
      .replace(/[9９]/g, '九')
      .replace(/[-−―ー－]/g, '｜');
  }

  _convertNames(names, jointNames, title) {
    return this._namesConverter.convert(
      names.split('\n'),
      jointNames ? jointNames.split('\n') : [],
      title);
  }
};
