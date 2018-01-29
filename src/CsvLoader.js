const parse = require('csv-parse/lib/sync');
const fs = require('fs');

function assertPropertiesExist(parsedJson) {
  if (!parsedJson.hasOwnProperty('postalCode')) {
    throw new Error('No postalCode');
  }
  if (!parsedJson.hasOwnProperty('address')) {
    throw new Error('No address');
  }
  if (!parsedJson.hasOwnProperty('names')) {
    throw new Error('No names');
  }
}

// TODO add tests
function processPostalCode(str) {
  const pc = str
    .replace(/[0-9]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0xFEE0))
    .replace(/[^０-９]/g, '');
  if (pc.length !== 7) {
    throw new Error(`Illegal postalCode: ${str}`);
  }
  return pc;
}

function processAddress(str) {
  return str
    .split('\n')
    .map(lineStr => {
      return lineStr
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
    });
}

function processNames(str) {
  return str.split('\n').map(processName);
}

function processName(str) {
  const ary = str.split(/\s+/);
  return {
    familyName: ary[0],
    givenName: ary[1],
    title: ary[2],
  };
}

exports.loadCsv = (csvPath) => {
  const csv = fs.readFileSync(csvPath, {encoding: 'utf-8'});
  return parse(csv, {columns: true}).map(entry => {
    assertPropertiesExist(entry);
    return {
      postalCode: processPostalCode(entry.postalCode),
      address: processAddress(entry.address),
      names: processNames(entry.names),
    };
  });
};
