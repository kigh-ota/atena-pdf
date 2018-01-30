import test from 'ava';
import CsvLoader from '../src/CsvLoader';

let sut;

test.beforeEach(t => {
  sut = new CsvLoader();
});

test('_convertPostalCode', t => {
  t.is(sut._convertPostalCode('123-4567'), '１２３４５６７');
  t.is(sut._convertPostalCode('1234567'), '１２３４５６７');
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
});

test('_convertName', t => {
  t.deepEqual(sut._convertName('山田 太郎 先生'), {familyName: '山田', givenName: '太郎', title: '先生'});
  t.throws(() => sut._convertName('山田太郎'));
  t.throws(() => sut._convertName('山田 太郎'));
});
