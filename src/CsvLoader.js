const parse = require('csv-parse/lib/sync');
const fs = require('fs');

// TODO 連名・敬称を別カラムでも指定できる
module.exports = class CsvLoader {
  constructor() {}

  loadCsv(csvPath) {
    const csv = fs.readFileSync(csvPath, {encoding: 'utf-8'});
    return parse(csv, {columns: true}).map(entry => {
      this._assertPropertiesExist(entry);
      return {
        postalCode: this._convertPostalCode(entry.postalCode),
        address: this._convertAddress(entry.address),
        names: this._convertNames(entry.names),
      };
    });
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
      .replace(/[-−―ー]/g, '｜');
  }

  _convertNames(str) {
    return str.split('\n').map(this._convertName);
  }

  _convertName(str) {
    const ary = str.split(/\s+/);
    if (ary.length !== 3) {
      throw new Error(`Invalid name: ${str}`);
    }
    return {
      familyName: ary[0],
      givenName: ary[1],
      title: ary[2],
    };
  }
};
