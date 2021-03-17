/* eslint-disable no-restricted-syntax,no-underscore-dangle */
const { Generator } = require('../generator');
const { User } = require('./entities/user');
const { Board } = require('./entities/board');
const { Column } = require('./entities/column');
const { Heading } = require('./entities/heading');
const { Todo } = require('./entities/todo');
const { routes } = require('../routes');

class Helper {
  constructor(request) {
    this.request = request;
  }

  _logError(name, res) {
    console.log(`helper.${name}`, res.statusCode, res.body);
  }

  async createUser(config = {}) {
    const userData = Generator.User.getUnique();
    const res = await this._post(`${routes.auth}/register`, userData);

    if (res.statusCode === 409) {
      this._logError('createUser', res);
      return this.createUser(config);
    }

    const { token, refreshToken } = res.body.data;

    let boards = [];
    if (config.boards) {
      boards = await this.createBoards({
        token,
        boards: config.boards,
      });
    }
    return new User(token, refreshToken, boards);
  }

  async createBoards({
    token, boards,
  }) {
    const resBoards = [];
    for await (const board of boards) {
      const boardData = Generator.Board.getUnique();
      const mergedData = this._mergeObject(boardData, board);
      const res = await this._post(`${routes.board}/`, mergedData, token);
      const { boardId } = res.body.data;
      if (res.statusCode !== 201) {
        this._logError('createBoards', res);
        return this.createBoards({
          token, boards,
        });
      }
      let columns = [];
      if (board.columns) {
        columns = await this.createColumns({
          token,
          columns: board.columns,
          boardId,
        });
      }
      resBoards.push(new Board(
        boardId,
        columns,
      ));
    }
    return resBoards;
  }

  async createColumns({
    token, columns, boardId,
  }) {
    const resColumns = [];
    for await (const column of columns) {
      const columnData = Generator.Column.getUnique(boardId);
      const mergedData = this._mergeObject(columnData, column);
      const res = await this._post(`${routes.column}/`, mergedData, token);
      if (res.statusCode !== 201) {
        this._logError('createColumns', res);
        return this.createColumns({
          token, columns, boardId,
        });
      }
      const { columnId } = res.body.data;
      let headings = [];
      if (column.headings) {
        headings = await this.createHeadings({
          token,
          headings: column.headings,
          columnId,
        });
      }

      resColumns.push(new Column(
        columnId,
        boardId,
        headings,
      ));
    }
    return resColumns;
  }

  async createHeadings({
    token, headings, columnId,
  }) {
    const resHeadings = [];
    for await (const heading of headings) {
      const headingData = Generator.Heading.getUnique(columnId);
      const mergedData = this._mergeObject(headingData, heading);
      const res = await this._post(`${routes.heading}/`, mergedData, token);
      if (res.statusCode !== 201) {
        this._logError('createHeadings', res);
        return this.createHeadings({
          token, headings, columnId,
        });
      }
      const { headingId } = res.body.data;
      let todos = [];
      if (heading.todos) {
        todos = await this.createTodos({
          token,
          todos: heading.todos,
          headingId,
        });
      }

      resHeadings.push(new Heading(
        headingId,
        columnId,
        todos,
      ));
    }
    return resHeadings;
  }

  async createTodos({
    token, todos, headingId,
  }) {
    const resTodos = [];
    for await (const todo of todos) {
      const todoData = Generator.Todo.getUnique(headingId);
      const mergedData = this._mergeObject(todoData, todo);
      const res = await this._post(`${routes.todo}/`, mergedData, token);
      if (res.statusCode !== 201) {
        this._logError('createTodos', res);
        return this.createTodos({
          token, todos, headingId,
        });
      }
      const { todoId } = res.body.data;
      let comments = [];
      if (todo.comments) {
        comments = await this.createComments({
          token,
          comments: todo.comments,
          todoId,
        });
      }
      resTodos.push(new Todo(
        todoId,
        headingId,
        comments,
      ));
    }
    return resTodos;
  }

  async createComments({
    token, comments, todoId,
  }) {
    const resComments = [];
    for await (const comment of comments) {
      const commentData = Generator.Comment.getUnique(todoId);
      const mergedData = this._mergeObject(commentData, comment);
      const res = await this._post(`${routes.comment}/`, mergedData, token);
      if (res.statusCode !== 201) {
        console.error('helper.createComments', res.statusCode, res.body);
        return this.createComments({
          token, comments, todoId,
        });
      }
      const { commentId } = res.body.data;
      resComments.push({
        id: commentId,
        todoId,
      });
    }
    return resComments;
  }

  _mergeObject(generatedData, userData) {
    const obj = {};
    Object.keys(generatedData).forEach((key) => {
      obj[key] = userData[key] !== undefined
        ? userData[key]
        : generatedData[key];
    });
    return obj;
  }

  _post(route, data, token) {
    if (token) {
      return this.request()
        .post(route)
        .set('authorization', `Bearer ${token}`)
        .send(data);
    }
    return this.request()
      .post(route)
      .send(data);
  }
}

module.exports = {
  Helper,
};
