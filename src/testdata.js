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
exports.json = {
  to: {
    postalCode: '５４００００８',
    address: ['大阪府大阪市中央区大手前２丁目１番２２号', '○○会館△△階'],
    names: [
      {
        familyName: '山田',
        givenName: '太郎',
        title: '様'
      },
      {
        familyName: '',
        givenName: '花子',
        title: '様'
      }
    ]
  },
  from: {
    postalCode: '１６３８００１',
    address: ['東京都新宿区西新宿２｜８｜１'],
    names: [
      {
        familyName: '佐藤',
        givenName: '小太郎'
      },
      {
        familyName: '',
        givenName: '恵'
      }
    ]
  }
};
