const Name = require('./Name');

/**
 * @param {[string]} names
 * @param {[string]} jointNames
 * @param {string=} title
 * @return {[Name]}
 */
module.exports = class NamesConverter {
  constructor() {}

  convert(names, jointNames, title) {
    let adaptedNames = [];

    let firstTitleOmitted = false;

    names.concat(jointNames).forEach((nameStr, i) => {
      const ary = nameStr.split(/\s+/);
      if (ary.length === 3) {
        adaptedNames.push(new Name(ary[0], ary[1], ary[2]));
      } else if (ary.length === 2) {
        if (i === 0) {
          // 敬称省略
          adaptedNames.push(new Name(ary[0], ary[1], title || ''));
          firstTitleOmitted = true;
        } else {
          // TODO 敬称・姓のどちらが省略されたかは、第2要素が敬称かどうかを予測して判別すると良さそう
          if (title && firstTitleOmitted) {
            // 敬称省略
            adaptedNames.push(new Name(ary[0], ary[1], title));
          } else {
            // 姓省略
            adaptedNames.push(new Name('', ary[0], ary[1]));
          }
        }
      } else if (ary.length === 1 && i > 0) { // 姓・敬称省略（2人目以降のみ）
        adaptedNames.push(new Name('', ary[0], title || adaptedNames[0].title));
      } else {
        throw new Error(`Invalid name: ${nameStr}`);
      }
    });

    if (adaptedNames.length === 0) {
      throw new Error('No names');
    }

    return adaptedNames;
  }
};
