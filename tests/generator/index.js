const { UserDataGenerator } = require('./user');
const { AuthDataGenerator } = require('./auth');
const { BoardDataGenerator } = require('./board');
const { ColumnDataGenerator } = require('./column');
const { TodoDataGenerator } = require('./todo');
const { CommentDataGenerator } = require('./comment');

module.exports = {
  Generator: {
    User: UserDataGenerator,
    Auth: AuthDataGenerator,
    Board: BoardDataGenerator,
    Column: ColumnDataGenerator,
    Todo: TodoDataGenerator,
    Comment: CommentDataGenerator,
  },
};
