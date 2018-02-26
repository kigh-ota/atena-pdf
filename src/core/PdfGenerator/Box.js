const mm2pt = require('../util').mm2pt;

module.exports = class Box {
  constructor(x, y, w, h) {
    this.x_mm = x;
    this.y_mm = y;
    this.w_mm = w;
    this.h_mm = h;
  }

  x() {
    return mm2pt(this.x_mm);
  }

  y() {
    return mm2pt(this.y_mm);
  }

  w() {
    return mm2pt(this.w_mm);
  }

  h() {
    return mm2pt(this.h_mm);
  }
};