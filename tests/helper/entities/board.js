const faker = require('faker');

class Board {
  constructor(id, columns) {
    this.id = id;
    this.columns = columns;
  }

  getRandomColumn() {
    const randomIndex = faker.random.number({ max: this.columns.length - 1 });
    return this.columns[randomIndex];
  }
}

module.exports = {
  Board,
};
