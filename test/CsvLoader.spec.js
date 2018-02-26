import test from 'ava';
import CsvLoader from '../src/core/CsvLoader';

let sut;

test.beforeEach(t => {
  sut = new CsvLoader();
});

test('_convertPostalCode', t => {
  t.is(sut._convertPostalCode('123-4567'), '１２３４５６７');
  t.is(sut._convertPostalCode('1234567'), '１２３４５６７');
  t.is(sut._convertPostalCode(''), undefined);
  t.is(sut._convertPostalCode(undefined), undefined);
  t.throws(() => sut._convertPostalCode('一二三四五六七'));
  t.throws(() => sut._convertPostalCode('123-45'));
  t.throws(() => sut._convertPostalCode('12345678'));
});

test('_convertAddressLine', t => {
  t.is(sut._convertAddressLine('1丁目'), '一丁目');
  t.is(sut._convertAddressLine('１丁目'), '一丁目');
  t.is(sut._convertAddressLine('一丁目'), '一丁目');
  t.is(sut._convertAddressLine('10'), '一〇');
  t.is(sut._convertAddressLine('1-5'), '一｜五');
  t.is(sut._convertAddressLine('1ー5'), '一｜五');
  t.is(sut._convertAddressLine('1−5'), '一｜五');
  t.is(sut._convertAddressLine('1―5'), '一｜五');
  t.is(sut._convertAddressLine('1－5'), '一｜五');
});

test('_applyColumnMap', t => {
  const entry = {
    '郵便番号': 'POSTAL_CODE',
    '住所': 'ADDRESS',
    '氏名': 'NAMES',
    '連名': 'JOINT_NAMES',
    '敬称': 'TITLE',
  };
  const columnMap = {
    postalCode: '郵便番号',
    address: '住所',
    names: '氏名',
    jointNames: '連名',
    title: '敬称',
  };
  const expected = {
    postalCode: 'POSTAL_CODE',
    address: 'ADDRESS',
    names: 'NAMES',
    jointNames: 'JOINT_NAMES',
    title: 'TITLE',
  };
  t.deepEqual(sut._applyColumnMap(entry, columnMap), expected);
});

test('_applyColumnMap：連名・敬称無し', t => {
  const entry = {
    '郵便番号': 'POSTAL_CODE',
    '住所': 'ADDRESS',
    '氏名': 'NAMES',
  };
  const columnMap = {
    postalCode: '郵便番号',
    address: '住所',
    names: '氏名',
    jointNames: '連名',
    title: '敬称',
  };
  const expected = {
    postalCode: 'POSTAL_CODE',
    address: 'ADDRESS',
    names: 'NAMES',
    jointNames: undefined,
    title: undefined,
  };
  t.deepEqual(sut._applyColumnMap(entry, columnMap), expected);
});

test('_applyColumnMap：columnMapを指定しない', t => {
  const entry = {
    postalCode: 'POSTAL_CODE',
    address: 'ADDRESS',
    names: 'NAMES',
  };
  const expected = {
    postalCode: 'POSTAL_CODE',
    address: 'ADDRESS',
    names: 'NAMES',
    jointNames: undefined,
    title: undefined,
  };
  t.deepEqual(sut._applyColumnMap(entry), expected);
});

test('_applyColumnMap：余分なカラムは消える', t => {
  const entry = {
    postalCode: 'POSTAL_CODE',
    address: 'ADDRESS',
    names: 'NAMES',
    hoge: 'FUGA'
  };
  const expected = {
    postalCode: 'POSTAL_CODE',
    address: 'ADDRESS',
    names: 'NAMES',
    jointNames: undefined,
    title: undefined,
  };
  t.deepEqual(sut._applyColumnMap(entry), expected);
});