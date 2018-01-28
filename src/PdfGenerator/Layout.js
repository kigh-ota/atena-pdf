const Box = require('./Box');

// TODO 微調整できる
// in mm
// (x,y)は左上
exports.NENGA_POSTCARD = {
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
  address: new Box(75, 25, 20, 100),
  names: new Box(35, 25, 30, 100),
  fromPostalCode: [
    new Box(5,  122.5, 4, 6.5),
    new Box(9,  122.5, 4, 6.5),
    new Box(13, 122.5, 4, 6.5),
    new Box(18, 122.5, 4, 6.5),
    new Box(22, 122.5, 4, 6.5),
    new Box(26, 122.5, 4, 6.5),
    new Box(30, 122.5, 4, 6.5),
  ],
  fromAddress: new Box(23, 60, 10, 60),
  fromNames: new Box(7, 60, 15, 60)
};
