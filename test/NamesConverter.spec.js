import test from 'ava';
import NamesConverter from '../src/core/NamesConverter';

let sut;

test.beforeEach(t => {
  sut = new NamesConverter();
});

test('敬称を含める：titleを指定しない', t => {
  const names = sut.convert(['山田 太郎 様'], ['山田 花子 様']);
  t.true(names.length === 2);
  t.true(names[0].equals('山田', '太郎', '様'));
  t.true(names[1].equals('山田', '花子', '様'));
});

// test('敬称を含めずtitleも指定しない => 敬称なし', t => {
//   const names = sut.convert(['山田 太郎'], ['山田 花子']);
//   t.true(names.length === 2);
//   t.true(names[0].equals('山田', '太郎', ''));
//   t.true(names[1].equals('山田', '花子', ''));
// });

test('titleを指定', t => {
  const names = sut.convert(['山田 太郎'], ['山田 花子'], '様');
  t.true(names.length === 2);
  t.true(names[0].equals('山田', '太郎', '様'));
  t.true(names[1].equals('山田', '花子', '様'));
});

test('敬称もtitleも指定 => titleは無視される', t => {
  const names = sut.convert(['山田 太郎 様'], ['山田 花子 様'], '殿');
  t.true(names.length === 2);
  t.true(names[0].equals('山田', '太郎', '様'));
  t.true(names[1].equals('山田', '花子', '様'));
});

test('1人目は姓・敬称両方を省略できない', t => {
  t.throws(() => sut.convert(['太郎'], [], '殿'));
});

test('2人目で姓を省略：titleを指定', t => {
  const names = sut.convert(['山田 太郎'], ['花子'], '様');
  t.true(names.length === 2);
  t.true(names[0].equals('山田', '太郎', '様'));
  t.true(names[1].equals('', '花子', '様'));
});

// test('2人目で姓を省略：titleを指定しない', t => {
//   const names = sut.convert(['山田 太郎'], ['花子']);
//   t.true(names.length === 2);
//   t.true(names[0].equals('山田', '太郎', ''));
//   t.true(names[1].equals('', '花子', ''));
// });

test('敬称を変える', t => {
  const names = sut.convert(['山田 太郎 様'], ['花子 ちゃん']);
  t.true(names.length === 2);
  t.true(names[0].equals('山田', '太郎', '様'));
  t.true(names[1].equals('', '花子', 'ちゃん'));
});

test('敬称を変える：筆頭に敬称あり、titleも指定', t => {
  const names = sut.convert(['山田 太郎 様', '次郎'], ['花子 ちゃん'], '殿');
  t.true(names.length === 3);
  t.true(names[0].equals('山田', '太郎', '様'));
  t.true(names[1].equals('', '次郎', '殿'));
  t.true(names[2].equals('', '花子', 'ちゃん'));
});

// TODO 2要素の場合、姓・敬称どちらが省略されたか、ary[1]が敬称っぽいかどうかで判別すれば通る
// test('敬称を変える：筆頭に敬称なし、titleも指定）', t => {
//   const names = sut.convert(['山田 太郎'], ['花子 ちゃん'], '様');
//   t.true(names.length === 2);
//   t.true(names[0].equals('山田', '太郎', '様'));
//   t.true(names[1].equals('', '花子', 'ちゃん'));
// });

test('姓が異なる', t => {
  const names = sut.convert(['山田 太郎 様'], ['鈴木 花子 様']);
  t.true(names.length === 2);
  t.true(names[0].equals('山田', '太郎', '様'));
  t.true(names[1].equals('鈴木', '花子', '様'));
});

test('姓が異なる：titleを指定', t => {
  const names = sut.convert(['山田 太郎'], ['鈴木 花子'], '様');
  t.true(names.length === 2);
  t.true(names[0].equals('山田', '太郎', '様'));
  t.true(names[1].equals('鈴木', '花子', '様'));
});

test('jointNamesの1人目に姓が指定してあれば、namesは空でもよい', t => {
  const names = sut.convert([], ['鈴木 花子 様']);
  t.true(names.length === 1);
  t.true(names[0].equals('鈴木', '花子', '様'));
});