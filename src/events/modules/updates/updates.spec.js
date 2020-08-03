const path = require('path');
const superagent = require('superagent');
const superagentAbsolute = require('superagent-absolute');
const { build } = require('../../../server');
const { Knex } = require('../../../knex');
const { Subscriber } = require('../../subscriber');
const { Operations } = require('../../../enums');
const { WS } = require('../../../../tests/ws');
const { Generator } = require('../../../../tests/generator');
const { Helper } = require('../../../../tests/helper');
const { routes } = require('../../../../tests/routes');

const pathToAttachment = path.resolve('tests', 'files', 'node.jpg');

const agent = superagent.agent();
let baseUrl;
let baseUrlWs;
let request;
let helper;
let knex;
let app;

beforeAll(async (done) => {
  knex = new Knex();
  app = build(knex);
  app.listen(0, async () => {
    const { address, port } = app.server.address();
    baseUrl = `http://${address}:${port}`;
    baseUrlWs = `ws://${address}:${port}`;
    request = () => superagentAbsolute(agent)(baseUrl);
    helper = new Helper(request);

    await Subscriber.subscribe();
    done();
  });
});

afterAll(async (done) => {
  await Subscriber.unsubscribe();
  await knex.closeConnection();
  app.server.close(done);
});

const defaultUser = {
  boards: [{
    title: 'default-board-1',
    columns: [{
      title: 'default-column-1',
      todos: [{
        title: 'default-todo-1',
        comments: [{
          text: 'comment-1',
        }, {
          text: 'comment-2',
        }],
      }, {
        title: 'default-todo-2',
        comments: [{
          text: 'comment-3',
        }, {
          text: 'comment-4',
        }],
      }],
    }, {
      title: 'default-column-2',
      todos: [{
        title: 'default-todo-3',
        comments: [{
          text: 'comment-5',
        }, {
          text: 'comment-6',
        }],
      }, {
        title: 'default-todo-4',
        comments: [{
          text: 'comment-7',
        }, {
          text: 'comment-8',
        }],
      }, {
        title: 'default-todo-5',
        comments: [{
          text: 'comment-9',
        }, {
          text: 'comment-10',
        }],
      }],
    }],
  }, {
    title: 'default-board-2',
    columns: [{
      title: 'default-column-3',
      todos: [{
        title: 'default-todo-6',
        comments: [{
          text: 'comment-11',
        }, {
          text: 'comment-12',
        }],
      }, {
        title: 'default-todo-7',
        comments: [{
          text: 'comment-13',
        }, {
          text: 'comment-14',
        }],
      }, {
        title: 'default-todo-8',
        comments: [{
          text: 'comment-15',
        }, {
          text: 'comment-16',
        }],
      }],
    }, {
      title: 'default-column-4',
      todos: [{
        title: 'default-todo-9',
        comments: [{
          text: 'comment-17',
        }, {
          text: 'comment-18',
        }],
      }, {
        title: 'default-todo-10',
        comments: [{
          text: 'comment-19',
        }, {
          text: 'comment-20',
        }],
      }, {
        title: 'default-todo-11',
        comments: [{
          text: 'comment-21',
        }, {
          text: 'comment-22',
        }],
      }],
    }],
  }, {
    title: 'default-board-3',
    columns: [{
      title: 'default-column-5',
      todos: [{
        title: 'default-todo-12',
        comments: [{
          text: 'comment-23',
        }, {
          text: 'comment-24',
        }],
      }, {
        title: 'default-todo-13',
        comments: [{
          text: 'comment-25',
        }, {
          text: 'comment-26',
        }],
      }, {
        title: 'default-todo-14',
        comments: [{
          text: 'comment-27',
        }, {
          text: 'comment-28',
        }],
      }],
    }, {
      title: 'default-column-6',
      todos: [{
        title: 'default-todo-15',
        comments: [{
          text: 'comment-29',
        }, {
          text: 'comment-30',
        }],
      }, {
        title: 'default-todo-16',
        comments: [{
          text: 'comment-31',
        }, {
          text: 'comment-32',
        }],
      }, {
        title: 'default-todo-17',
        comments: [{
          text: 'comment-33',
        }, {
          text: 'comment-34',
        }],
      }],
    }],
  }, {
    title: 'default-board-4',
    columns: [{
      title: 'default-column-7',
      todos: [{
        title: 'default-todo-18',
        comments: [{
          text: 'comment-35',
        }, {
          text: 'comment-36',
        }],
      }, {
        title: 'default-todo-19',
        comments: [{
          text: 'comment-37',
        }, {
          text: 'comment-38',
        }],
      }, {
        title: 'default-todo-20',
        comments: [{
          text: 'comment-39',
        }, {
          text: 'comment-40',
        }],
      }],
    }, {
      title: 'default-column-8',
      todos: [{
        title: 'default-todo-21',
        comments: [{
          text: 'comment-41',
        }, {
          text: 'comment-42',
        }],
      }, {
        title: 'default-todo-22',
        comments: [{
          text: 'comment-43',
        }, {
          text: 'comment-44',
        }],
      }, {
        title: 'default-todo-23',
        comments: [{
          text: 'comment-45',
        }, {
          text: 'comment-46',
        }],
      }],
    }],
  }],
};

describe('board', () => {
  it('user can be successfully notified of board create', async (done) => {
    const user = await helper.createUser();
    const token = user.getToken();

    const board = Generator.Board.getUnique();
    const ws = new WS(baseUrlWs)
      .query({ authorization: `Bearer ${token}` })
      .start('updates')
      .onMessage((data) => {
        try {
          expect(data).toEqual(expect.objectContaining({
            operation: Operations.insert,
            channel: 'board',
            data: expect.objectContaining({
              id: expect.any(Number),
              ...board,
            }),
          }));
          done();
        } catch (error) {
          done(error);
        } finally {
          ws.close();
        }
      })
      .onOpen(async () => {
        await request()
          .post(`${baseUrl}${routes.board}/`)
          .set('authorization', `Bearer ${token}`)
          .send(board);
      });
  });
  it('user can be successfully notified on board change', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const board = Generator.Board.getUnique();
    const ws = new WS(baseUrlWs)
      .query({ authorization: `Bearer ${token}` })
      .start('updates')
      .onMessage((data) => {
        try {
          expect(data).toEqual(expect.objectContaining({
            operation: Operations.update,
            channel: 'board',
            data: expect.objectContaining({
              id: boardId,
              ...board,
            }),
          }));
          done();
        } catch (error) {
          done(error);
        } finally {
          ws.close();
        }
      })
      .onOpen(async () => {
        await request()
          .patch(`${baseUrl}${routes.board}/${boardId}`)
          .set('authorization', `Bearer ${token}`)
          .send(board);
      });
  });
  it('user can be successfully notified on board remove', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const ws = new WS(baseUrlWs)
      .query({ authorization: `Bearer ${token}` })
      .start('updates')
      .onMessage((data) => {
        try {
          expect(data).toEqual(expect.objectContaining({
            operation: Operations.delete,
            channel: 'board',
            data: expect.objectContaining({
              id: boardId,
            }),
          }));
          done();
        } catch (error) {
          done(error);
        } finally {
          ws.close();
        }
      })
      .onOpen(async () => {
        await request()
          .delete(`${baseUrl}${routes.board}/${boardId}`)
          .set('authorization', `Bearer ${token}`)
          .send();
      });
  });
});
describe('column', () => {
  it('user can be successfully notified of column create', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const column = Generator.Column.getUnique(boardId);
    const ws = new WS(baseUrlWs)
      .query({ authorization: `Bearer ${token}` })
      .start('updates')
      .onMessage((data) => {
        try {
          expect(data).toEqual(expect.objectContaining({
            operation: Operations.insert,
            channel: 'column',
            data: expect.objectContaining({
              id: expect.any(Number),
              ...column,
            }),
          }));
          done();
        } catch (error) {
          done(error);
        } finally {
          ws.close();
        }
      })
      .onOpen(async () => {
        await request()
          .post(`${baseUrl}${routes.column}/`)
          .set('authorization', `Bearer ${token}`)
          .send(column);
      });
  });
  it('user can be successfully notified on column change', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const column = user.getRandomColumn();

    const newColumn = Generator.Column.getUnique(column.boardId);
    const ws = new WS(baseUrlWs)
      .query({ authorization: `Bearer ${token}` })
      .start('updates')
      .onMessage((data) => {
        try {
          expect(data).toEqual(expect.objectContaining({
            operation: Operations.update,
            channel: 'column',
            data: expect.objectContaining({
              id: expect.any(Number),
              ...newColumn,
            }),
          }));
          done();
        } catch (error) {
          done(error);
        } finally {
          ws.close();
        }
      })
      .onOpen(async () => {
        await request()
          .patch(`${baseUrl}${routes.column}/${column.id}`)
          .set('authorization', `Bearer ${token}`)
          .send(newColumn);
      });
  });
  it('user can be successfully notified on column remove', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const ws = new WS(baseUrlWs)
      .query({ authorization: `Bearer ${token}` })
      .start('updates')
      .onMessage((data) => {
        try {
          expect(data).toEqual(expect.objectContaining({
            operation: Operations.delete,
            channel: 'column',
            data: expect.objectContaining({
              id: columnId,
            }),
          }));
          done();
        } catch (error) {
          done(error);
        } finally {
          ws.close();
        }
      })
      .onOpen(async () => {
        await request()
          .delete(`${baseUrl}${routes.column}/${columnId}`)
          .set('authorization', `Bearer ${token}`)
          .send();
      });
  });
});

describe('todo', () => {
  it('user can be successfully notified of todo create', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    const ws = new WS(baseUrlWs)
      .query({ authorization: `Bearer ${token}` })
      .start('updates')
      .onMessage((data) => {
        try {
          expect(data).toEqual(expect.objectContaining({
            operation: Operations.insert,
            channel: 'todo',
            data: expect.objectContaining({
              id: expect.any(Number),
              ...todo,
            }),
          }));
          done();
        } catch (error) {
          done(error);
        } finally {
          ws.close();
        }
      })
      .onOpen(async () => {
        await request()
          .post(`${baseUrl}${routes.todo}/`)
          .set('authorization', `Bearer ${token}`)
          .send(todo);
      });
  });
  it('user can be successfully notified on todo change', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todo = user.getRandomTodo();

    const newTodo = Generator.Todo.getUnique(todo.columnId);
    const ws = new WS(baseUrlWs)
      .query({ authorization: `Bearer ${token}` })
      .start('updates')
      .onMessage((data) => {
        try {
          expect(data).toEqual(expect.objectContaining({
            operation: Operations.update,
            channel: 'todo',
            data: expect.objectContaining({
              id: expect.any(Number),
              ...newTodo,
            }),
          }));
          done();
        } catch (error) {
          done(error);
        } finally {
          ws.close();
        }
      })
      .onOpen(async () => {
        await request()
          .patch(`${baseUrl}${routes.todo}/${todo.id}`)
          .set('authorization', `Bearer ${token}`)
          .send(newTodo);
      });
  });
  it('user can be successfully notified on todo remove', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const ws = new WS(baseUrlWs)
      .query({ authorization: `Bearer ${token}` })
      .start('updates')
      .onMessage((data) => {
        try {
          expect(data).toEqual(expect.objectContaining({
            operation: Operations.delete,
            channel: 'todo',
            data: expect.objectContaining({
              id: todoId,
            }),
          }));
          done();
        } catch (error) {
          done(error);
        } finally {
          ws.close();
        }
      })
      .onOpen(async () => {
        await request()
          .delete(`${baseUrl}${routes.todo}/${todoId}`)
          .set('authorization', `Bearer ${token}`)
          .send();
      });
  });
});

describe('comment', () => {
  it('user can be successfully notified of comment create', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const comment = Generator.Comment.getUnique(todoId);
    const ws = new WS(baseUrlWs)
      .query({ authorization: `Bearer ${token}` })
      .start('updates')
      .onMessage((data) => {
        try {
          expect(data).toEqual(expect.objectContaining({
            operation: Operations.insert,
            channel: 'comment',
            data: expect.objectContaining({
              id: expect.any(Number),
              ...comment,
              replyCommentId: null,
            }),
          }));
          done();
        } catch (error) {
          done(error);
        } finally {
          ws.close();
        }
      })
      .onOpen(async () => {
        await request()
          .post(`${baseUrl}${routes.comment}/`)
          .set('authorization', `Bearer ${token}`)
          .send(comment);
      });
  });
  it('user can be successfully notified on comment change', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const comment = user.getRandomComment();

    const newComment = Generator.Comment.getUnique(comment.todoId);
    const ws = new WS(baseUrlWs)
      .query({ authorization: `Bearer ${token}` })
      .start('updates')
      .onMessage((data) => {
        try {
          expect(data).toEqual(expect.objectContaining({
            operation: Operations.update,
            channel: 'comment',
            data: expect.objectContaining({
              id: expect.any(Number),
              ...newComment,
              replyCommentId: null,
            }),
          }));
          done();
        } catch (error) {
          done(error);
        } finally {
          ws.close();
        }
      })
      .onOpen(async () => {
        await request()
          .patch(`${baseUrl}${routes.comment}/${comment.id}`)
          .set('authorization', `Bearer ${token}`)
          .send(newComment);
      });
  });
  it('user can be successfully notified on comment remove', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const commentId = user.getRandomCommentId();

    const ws = new WS(baseUrlWs)
      .query({ authorization: `Bearer ${token}` })
      .start('updates')
      .onMessage((data) => {
        try {
          expect(data).toEqual(expect.objectContaining({
            operation: Operations.delete,
            channel: 'comment',
            data: expect.objectContaining({
              id: commentId,
            }),
          }));
          done();
        } catch (error) {
          done(error);
        } finally {
          ws.close();
        }
      })
      .onOpen(async () => {
        await request()
          .delete(`${baseUrl}${routes.comment}/${commentId}`)
          .set('authorization', `Bearer ${token}`)
          .send();
      });
  });
});

describe('commentFile', () => {
  it('user can be successfully notified of comment file create', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const commentId = user.getRandomCommentId();

    const ws = new WS(baseUrlWs)
      .query({ authorization: `Bearer ${token}` })
      .start('updates')
      .onMessage((data) => {
        try {
          expect(data).toEqual(expect.objectContaining({
            operation: Operations.insert,
            channel: 'comment_files',
            data: expect.objectContaining({
              id: expect.any(Number),
              commentId,
              path: expect.any(String),
              name: expect.any(String),
              extension: expect.any(String),
              size: expect.any(Number),
              mimeType: expect.any(String),
              encoding: expect.any(String),
            }),
          }));
          done();
        } catch (error) {
          done(error);
        } finally {
          ws.close();
        }
      })
      .onOpen(async () => {
        await request()
          .post(`${routes.commentAttachment}/${commentId}`)
          .set('authorization', `Bearer ${token}`)
          .attach('name', pathToAttachment);
      });
  });
  it('user can be successfully notified on commentFile remove', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const commentId = user.getRandomCommentId();

    const response = await request()
      .post(`${routes.commentAttachment}/${commentId}`)
      .set('authorization', `Bearer ${token}`)
      .attach('name', pathToAttachment);

    const commentFileId = response.body.data.id;

    const ws = new WS(baseUrlWs)
      .query({ authorization: `Bearer ${token}` })
      .start('updates')
      .onMessage((data) => {
        try {
          expect(data).toEqual(expect.objectContaining({
            operation: Operations.delete,
            channel: 'comment_files',
            data: expect.objectContaining({
              id: commentFileId,
              commentId,
              path: expect.any(String),
              name: expect.any(String),
              extension: expect.any(String),
              size: expect.any(Number),
              mimeType: expect.any(String),
              encoding: expect.any(String),
            }),
          }));
          done();
        } catch (error) {
          done(error);
        } finally {
          ws.close();
        }
      })
      .onOpen(async () => {
        await request()
          .delete(`${routes.commentAttachment}/${commentFileId}`)
          .set('authorization', `Bearer ${token}`)
          .send();
      });
  });
});
