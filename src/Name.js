module.exports = class Name {
  constructor(familyName, givenName, title) {
    this.familyName = familyName;
    this.givenName = givenName;
    this.title = title;
  }

  equals(familyName, givenName, title) {
    return this.familyName === familyName && this.givenName === givenName && this.title === title;
  }
};
