const PdfGenerator = require('./PdfGenerator/PdfGenerator');
const mm2pt = require('./util').mm2pt;

// TODO 微調整できる
// in mm
// (x,y)は左上

const NENGA_POSTCARD = {
  paper: {x: 0, y: 0, w: mm2pt(100), h: mm2pt(148)},
  postalCode: [
    {w: mm2pt(6), h: mm2pt(8), x: mm2pt(43.7), y: mm2pt(11.7)},
    {w: mm2pt(6), h: mm2pt(8), x: mm2pt(50.8), y: mm2pt(11.7)},
    {w: mm2pt(6), h: mm2pt(8), x: mm2pt(57.9), y: mm2pt(11.7)},
    {w: mm2pt(6), h: mm2pt(8), x: mm2pt(65.3), y: mm2pt(11.7)},
    {w: mm2pt(6), h: mm2pt(8), x: mm2pt(72.2), y: mm2pt(11.7)},
    {w: mm2pt(6), h: mm2pt(8), x: mm2pt(79.1), y: mm2pt(11.7)},
    {w: mm2pt(6), h: mm2pt(8), x: mm2pt(86.0), y: mm2pt(11.7)},
  ],
  address: {x: mm2pt(70), y: mm2pt(25), w: mm2pt(20), h: mm2pt(100)},
  fromPostalCode: [
    {w: mm2pt(4), h: mm2pt(6.5), x: mm2pt(5), y: mm2pt(122.5)},
    {w: mm2pt(4), h: mm2pt(6.5), x: mm2pt(9), y: mm2pt(122.5)},
    {w: mm2pt(4), h: mm2pt(6.5), x: mm2pt(13), y: mm2pt(122.5)},
    {w: mm2pt(4), h: mm2pt(6.5), x: mm2pt(18), y: mm2pt(122.5)},
    {w: mm2pt(4), h: mm2pt(6.5), x: mm2pt(22), y: mm2pt(122.5)},
    {w: mm2pt(4), h: mm2pt(6.5), x: mm2pt(26), y: mm2pt(122.5)},
    {w: mm2pt(4), h: mm2pt(6.5), x: mm2pt(30), y: mm2pt(122.5)},
  ],
  fromAddress: {x: mm2pt(20), y: mm2pt(60), w: mm2pt(15), h: mm2pt(60)}
};

/**
 * Data:
 *   to: [ToEntry]
 *   from: FromEntry
 *
 * ToEntry:
 *   postalCode
 *   address
 *   name: ToName
 *   jointNames?: [ToName]
 *
 * ToName:
 *   familyName
 *   givenName
 *   title?
 *
 * FromEntry:
 *   postalCode
 *   address
 *   name: FromName
 *   jointNames?: [FromName]
 *
 * FromName:
 *   familyName
 *   givenName
 */
const testData = {
  to: {
    postalCode: "５４００００８",
    address: "大阪府大阪市中央区大手前２丁目１番２２号",
    name: {
      familyName: "山田",
      givenName: "太郎",
      title: "様"
    },
    jointNames: [
      {
        familyName: "山田",
        givenName: "花子",
        title: "様"
      }
    ]
  },
  from: {
    postalCode: "１６３８００１",
    address: "東京都新宿区西新宿２｜８｜１",
    name: {
      familyName: "佐藤",
      givenName: "小太郎"
    }
  }
};

PdfGenerator.generate(testData, NENGA_POSTCARD);
