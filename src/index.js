const PdfGenerator = require('./PdfGenerator/PdfGenerator');
const mm2pt = require('./util').mm2pt;
const Box = require('./PdfGenerator/Box');

// TODO 微調整できる
// in mm
// (x,y)は左上

const NENGA_POSTCARD = {
  paper: new Box(0, 0, 100, 148),
  postalCode: [
    new Box(43.7, 11.7, 6, 8),
    new Box(50.8, 11.7, 6, 8),
    new Box(57.9, 11.7, 6, 8),
    new Box(65.3, 11.7, 6, 8),
    new Box(72.2, 11.7, 6, 8),
    new Box(79.1, 11.7, 6, 8),
    new Box(86.0, 11.7, 6, 8),
  ],
  address: new Box(70, 25, 20, 100),
  fromPostalCode: [
    new Box(5,  122.5, 4, 6.5),
    new Box(9,  122.5, 4, 6.5),
    new Box(13, 122.5, 4, 6.5),
    new Box(18, 122.5, 4, 6.5),
    new Box(22, 122.5, 4, 6.5),
    new Box(26, 122.5, 4, 6.5),
    new Box(30, 122.5, 4, 6.5),
  ],
  fromAddress: new Box(20, 60, 15, 60),
  fromNames: new Box(10, 60, 15, 60)
};

/**
 * Data:
 *   to: [ToEntry]
 *   from: FromEntry
 *
 * ToEntry:
 *   postalCode
 *   address
 *   names: [ToName]
 *
 * ToName:
 *   familyName
 *   givenName
 *   title
 *
 * FromEntry:
 *   postalCode
 *   address
 *   names: [FromName]
 *
 * FromName:
 *   familyName
 *   givenName
 */
const testData = {
  to: {
    postalCode: "５４００００８",
    address: ['大阪府大阪市中央区大手前２丁目１番２２号', '○○会館△△階'],
    names: [
      {
        familyName: "山田",
        givenName: "太郎",
        title: "様"
      },
      {
        familyName: '',
        givenName: "花子",
        title: "様"
      }
    ]
  },
  from: {
    postalCode: "１６３８００１",
    address: ['東京都新宿区西新宿２｜８｜１'],
    names: [
      {
        familyName: "佐藤",
        givenName: "小太郎"
      },
      {
        familyName: '',
        givenName: '恵'
      }
    ]
  }
};

PdfGenerator.generate(testData, NENGA_POSTCARD);
