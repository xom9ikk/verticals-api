const faker = require('faker');

class Column {
  constructor(id, boardId, headings) {
    this.id = id;
    this.boardId = boardId;
    this.headings = headings;
  }

  getRandomHeading() {
    const randomIndex = faker.random.number({ max: this.headings.length - 1 });
    return this.headings[randomIndex];
  }

  getRandomHeadingId() {
    return this.getRandomHeading().id;
  }

  getRandomCommentId() {
    return this.getRandomHeading().getRandomTodo().getRandomComment().id;
  }
}

module.exports = {
  Column,
};
