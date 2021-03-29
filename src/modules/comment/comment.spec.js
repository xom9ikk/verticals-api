const { build } = require('../../server');
const { Knex } = require('../../knex');
const { Generator } = require('../../../tests/generator');
const { Helper } = require('../../../tests/helper');
const { routes } = require('../../../tests/routes');
const { FastifyRequest } = require('../../../tests/request');

let knex;
let app;

const request = () => new FastifyRequest(app);

const helper = new Helper(request);

beforeAll(async (done) => {
  knex = new Knex();
  app = build(knex);
  done();
});

afterAll(async (done) => {
  await knex.closeConnection();
  done();
});

const defaultUser = {
  boards: [{
    title: 'default-board-1',
    columns: [{
      title: 'default-column-1',
      headings: [{
        title: 'default-heading-1',
        todos: [{
          title: 'todo-1',
        }, {
          title: 'todo-2',
        }],
      }, {
        title: 'default-heading-2',
        todos: [{
          title: 'todo-3',
        }, {
          title: 'todo-4',
        }],
      }],
    }, {
      title: 'default-column-2',
      headings: [{
        title: 'default-heading-3',
        todos: [{
          title: 'todo-5',
        }, {
          title: 'todo-6',
        }],
      }, {
        title: 'default-heading-4',
        todos: [{
          title: 'todo-7',
        }, {
          title: 'todo-8',
        }],
      }, {
        title: 'default-heading-5',
        todos: [{
          title: 'todo-9',
        }, {
          title: 'todo-10',
        }],
      }],
    }],
  }, {
    title: 'default-board-2',
    columns: [{
      title: 'default-column-3',
      headings: [{
        title: 'default-heading-6',
        todos: [{
          title: 'todo-11',
        }, {
          title: 'todo-12',
        }],
      }, {
        title: 'default-heading-7',
        todos: [{
          title: 'todo-13',
        }, {
          title: 'todo-14',
        }],
      }, {
        title: 'default-heading-8',
        todos: [{
          title: 'todo-15',
        }, {
          title: 'todo-16',
        }],
      }],
    }, {
      title: 'default-column-4',
      headings: [{
        title: 'default-heading-9',
        todos: [{
          title: 'todo-17',
        }, {
          title: 'todo-18',
        }],
      }, {
        title: 'default-heading-10',
        todos: [{
          title: 'todo-19',
        }, {
          title: 'todo-20',
        }],
      }, {
        title: 'default-heading-11',
        todos: [{
          title: 'todo-21',
        }, {
          title: 'todo-22',
        }],
      }],
    }],
  }, {
    title: 'default-board-3',
    columns: [{
      title: 'default-column-5',
      headings: [{
        title: 'default-heading-12',
        todos: [{
          title: 'todo-23',
        }, {
          title: 'todo-24',
        }],
      }, {
        title: 'default-heading-13',
        todos: [{
          title: 'todo-25',
        }, {
          title: 'todo-26',
        }],
      }, {
        title: 'default-heading-14',
        todos: [{
          title: 'todo-27',
        }, {
          title: 'todo-28',
        }],
      }],
    }, {
      title: 'default-column-6',
      headings: [{
        title: 'default-heading-15',
        todos: [{
          title: 'todo-29',
        }, {
          title: 'todo-30',
        }],
      }, {
        title: 'default-heading-16',
        todos: [{
          title: 'todo-31',
        }, {
          title: 'todo-32',
        }],
      }, {
        title: 'default-heading-17',
        todos: [{
          title: 'todo-33',
        }, {
          title: 'todo-34',
        }],
      }],
    }],
  }, {
    title: 'default-board-4',
    columns: [{
      title: 'default-column-7',
      headings: [{
        title: 'default-heading-18',
        todos: [{
          title: 'todo-35',
        }, {
          title: 'todo-36',
        }],
      }, {
        title: 'default-heading-19',
        todos: [{
          title: 'todo-37',
        }, {
          title: 'todo-38',
        }],
      }, {
        title: 'default-heading-20',
        todos: [{
          title: 'todo-39',
        }, {
          title: 'todo-40',
        }],
      }],
    }, {
      title: 'default-column-8',
      headings: [{
        title: 'default-heading-21',
        todos: [{
          title: 'todo-41',
        }, {
          title: 'todo-42',
        }],
      }, {
        title: 'default-heading-22',
        todos: [{
          title: 'todo-43',
        }, {
          title: 'todo-44',
        }],
      }, {
        title: 'default-heading-23',
        todos: [{
          title: 'todo-45',
        }, {
          title: 'todo-46',
        }],
      }],
    }],
  }],
};

describe('create', () => {
  it('user can successfully create comment with all fields', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const comment = Generator.Comment.getUnique(todoId);
    const res = await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send(comment);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        commentId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create comment without text', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const comment = Generator.Comment.getUnique(todoId);
    delete comment.text;
    const res = await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send(comment);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        commentId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create comment without is edited', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const comment = Generator.Comment.getUnique(todoId);
    delete comment.updatedAt;
    const res = await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send(comment);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        commentId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create comment without reply comment id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const comment = Generator.Comment.getUnique(todoId, 1);
    delete comment.replyCommentId;
    const res = await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send(comment);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        commentId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create comment without all non-required fields', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const comment = Generator.Comment.getUnique(todoId);
    delete comment.text;
    delete comment.updatedAt;
    delete comment.replyCommentId;
    const res = await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send(comment);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        commentId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can\'t create comment without authorization', async (done) => {
    const user = await helper.createUser(defaultUser);
    const todoId = user.getRandomTodoId();

    const comment = Generator.Comment.getUnique(todoId);
    const res = await request()
      .post(`${routes.comment}/`)
      .send(comment);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create comment with long text', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const comment = Generator.Comment.getUnique(todoId);
    const res = await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...comment,
        text: Generator.Comment.getLongText(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create comment with negative column id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const comment = Generator.Comment.getUnique(todoId);
    const res = await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...comment,
        todoId: Generator.Comment.getNegativeTodoId(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create comment with column id without having access to it', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const { token } = firstUser;

    const secondUser = await helper.createUser(defaultUser);
    const todoIdWithoutAccess = secondUser.getRandomTodoId();

    const comment = Generator.Comment.getUnique(todoIdWithoutAccess);
    const res = await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send(comment);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('get comment by id', () => {
  it('user can successfully get comment by id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const comment = Generator.Comment.getUnique(todoId);
    const { body: { data: { commentId } } } = await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send(comment);

    const res = await request()
      .get(`${routes.comment}/${commentId}`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    expect(res.body.data).toEqual({
      id: commentId,
      ...comment,
      replyCommentId: null,
      createdAt: expect.any(Number),
      updatedAt: expect.any(Number),
    });

    done();
  });
  it('user can\'t get comment without authorization header', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const comment = Generator.Comment.getUnique(todoId);
    const { body: { data: { commentId } } } = await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send(comment);

    const res = await request()
      .get(`${routes.comment}/${commentId}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t access to the comment if he does not have access to it', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const firstUserTodoId = firstUser.getRandomTodoId();

    const secondUser = await helper.createUser(defaultUser);

    const comment = Generator.Comment.getUnique(firstUserTodoId);
    const { body: { data: { commentId } } } = await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(comment);

    const res = await request()
      .get(`${routes.comment}/${commentId}`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send();

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t access to the comment by string id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const comment = Generator.Comment.getUnique(todoId);
    const { body: { data: { commentId } } } = await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send(comment);

    const res = await request()
      .get(`${routes.comment}/string_${commentId}`)
      .send();

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('get all comments', () => {
  it('user can successfully gets all comments to which he has access', async (done) => {
    const user = await helper.createUser(defaultUser);
    const [firstTodoId, secondTodoId] = user.getTodoIds();
    const token = user.getToken();
    const secondUser = await helper.createUser(defaultUser);
    const secondUserTodoId = secondUser.getRandomTodoId();

    const secondUserTodo = Generator.Comment.getUnique(secondUserTodoId);
    await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send(secondUserTodo);

    const commentOne = Generator.Comment.getUnique(firstTodoId);
    await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send(commentOne);

    const commentTwo = Generator.Comment.getUnique(secondTodoId);
    await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send(commentTwo);

    const res = await request()
      .get(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    const { comments } = res.body.data;
    const [{ id: commentIdOne }, { id: commentIdTwo }] = comments;

    expect(comments).toEqual([{
      id: commentIdOne,
      ...commentOne,
      replyCommentId: null,
      createdAt: expect.any(Number),
      updatedAt: expect.any(Number),
    }, {
      id: commentIdTwo,
      ...commentTwo,
      replyCommentId: null,
      createdAt: expect.any(Number),
      updatedAt: expect.any(Number),
    }]);

    done();
  });
  it('user can successfully gets all comments to which he has access by board id', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const token = firstUser.getToken();
    const [firstBoardId, secondBoardId] = firstUser.getBoardIds();
    const todoIdFromFirstBoard = firstUser.getRandomTodoIdFromBoard(firstBoardId);
    const todoIdFromSecondBoard = firstUser.getRandomTodoIdFromBoard(secondBoardId);

    await helper.createUser(defaultUser);

    const commentOne = Generator.Comment.getUnique(todoIdFromFirstBoard);
    await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send(commentOne);

    const commentTwo = Generator.Comment.getUnique(todoIdFromSecondBoard);
    await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send(commentTwo);

    const res = await request()
      .get(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .query({ boardId: firstBoardId })
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    const { comments } = res.body.data;
    const [{ id: commentIdOne }] = comments;

    expect(comments).toEqual([{
      id: commentIdOne,
      ...commentOne,
      replyCommentId: null,
      createdAt: expect.any(Number),
      updatedAt: expect.any(Number),
    }]);

    done();
  });
  it('user can successfully gets all comments to which he has access by column id', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const token = firstUser.getToken();
    const board = firstUser.getRandomBoard();
    const [firstColumn, secondColumn] = board.getColumns();
    const headingFromFirstColumn = firstColumn.getRandomHeading();
    const headingFromSecondColumn = secondColumn.getRandomHeading();

    const todoIdFromFirstColumn = headingFromFirstColumn.getRandomTodoId();
    const todoIdFromSecondColumn = headingFromSecondColumn.getRandomTodoId();

    await helper.createUser(defaultUser);

    const commentOne = Generator.Comment.getUnique(todoIdFromFirstColumn);
    await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send(commentOne);

    const commentTwo = Generator.Comment.getUnique(todoIdFromSecondColumn);
    await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send(commentTwo);

    const res = await request()
      .get(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .query({ columnId: firstColumn.id })
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    const { comments } = res.body.data;
    const [{ id: commentIdOne }] = comments;

    expect(comments).toEqual([{
      id: commentIdOne,
      ...commentOne,
      replyCommentId: null,
      createdAt: expect.any(Number),
      updatedAt: expect.any(Number),
    }]);

    done();
  });
  it('user can successfully gets all comments to which he has access by todo id', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const token = firstUser.getToken();
    const board = firstUser.getRandomBoard();
    const [firstColumn, secondColumn] = board.getColumns();
    const headingFromFirstColumn = firstColumn.getRandomHeading();
    const headingFromSecondColumn = secondColumn.getRandomHeading();

    const todoIdFromFirstColumn = headingFromFirstColumn.getRandomTodoId();
    const todoIdFromSecondColumn = headingFromSecondColumn.getRandomTodoId();

    await helper.createUser(defaultUser);

    const commentOne = Generator.Comment.getUnique(todoIdFromFirstColumn);
    await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send(commentOne);

    const commentTwo = Generator.Comment.getUnique(todoIdFromSecondColumn);
    await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send(commentTwo);

    const res = await request()
      .get(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .query({ todoId: todoIdFromFirstColumn })
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    const { comments } = res.body.data;
    const [{ id: commentIdOne }] = comments;

    expect(comments).toEqual([{
      id: commentIdOne,
      ...commentOne,
      subTodoId: null,
      replyCommentId: null,
      likedUsers: [],
      createdAt: expect.any(Number),
      updatedAt: expect.any(Number),
    }]);

    done();
  });
  it('user can\'t get all comments if he does not have access to board id', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const todoIdFirstUser = firstUser.getRandomTodoId();

    const secondUser = await helper.createUser(defaultUser);
    const todoIdSecondUser = secondUser.getRandomTodoId();
    const boardIdWithoutAccess = secondUser.getRandomBoardId();

    const commentOne = Generator.Comment.getUnique(todoIdFirstUser);
    await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(commentOne);

    const commentTwo = Generator.Comment.getUnique(todoIdSecondUser);
    await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send(commentTwo);

    const res = await request()
      .get(`${routes.todo}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .query({ boardId: boardIdWithoutAccess })
      .send();

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t get all comments if he does not have access to column id', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const todoIdFirstUser = firstUser.getRandomTodoId();

    const secondUser = await helper.createUser(defaultUser);
    const todoIdSecondUser = secondUser.getRandomTodoId();
    const columnIdWithoutAccess = secondUser.getRandomColumnId();

    const commentOne = Generator.Comment.getUnique(todoIdFirstUser);
    await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(commentOne);

    const commentTwo = Generator.Comment.getUnique(todoIdSecondUser);
    await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send(commentTwo);

    const res = await request()
      .get(`${routes.comment}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .query({ columnId: columnIdWithoutAccess })
      .send();

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t get all comments if he does not have access to todo id', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const todoIdFirstUser = firstUser.getRandomTodoId();

    const secondUser = await helper.createUser(defaultUser);
    const todoIdSecondUser = secondUser.getRandomTodoId();
    const todoIdWithoutAccess = secondUser.getRandomTodoId();

    const commentOne = Generator.Comment.getUnique(todoIdFirstUser);
    await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(commentOne);

    const commentTwo = Generator.Comment.getUnique(todoIdSecondUser);
    await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send(commentTwo);

    const res = await request()
      .get(`${routes.comment}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .query({ todoId: todoIdWithoutAccess })
      .send();

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t get comments if he has no comments', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const [firstTodoId, secondTodoId] = firstUser.getTodoIds();
    const secondUser = await helper.createUser();

    const commentOne = Generator.Comment.getUnique(firstTodoId);
    await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(commentOne);

    const commentTwo = Generator.Comment.getUnique(secondTodoId);
    await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(commentTwo);

    const res = await request()
      .get(`${routes.comment}/`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: {
        comments: [],
      },
    }));
    done();
  });
  it('user can\'t get all comments without authorization header', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const comment = Generator.Comment.getUnique(todoId);
    await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send(comment);

    const res = await request()
      .get(`${routes.comment}/`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('remove comment', () => {
  it('user can successfully remove comment by id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const comment = Generator.Comment.getUnique(todoId);
    const { body: { data: { commentId } } } = await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send(comment);

    const res = await request()
      .delete(`${routes.comment}/${commentId}`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t remove comment without authorization header', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const comment = Generator.Comment.getUnique(todoId);
    const { body: { data: { commentId } } } = await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send(comment);

    const res = await request()
      .delete(`${routes.comment}/${commentId}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t remove comment if he does not have access to it', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const todoId = firstUser.getRandomTodoId();

    const secondUser = await helper.createUser();

    const comment = Generator.Comment.getUnique(todoId);
    const { body: { data: { commentId } } } = await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(comment);

    const res = await request()
      .delete(`${routes.comment}/${commentId}`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send();

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t remove comment by string id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const comment = Generator.Comment.getUnique(todoId);
    const { body: { data: { commentId } } } = await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send(comment);

    const res = await request()
      .delete(`${routes.comment}/string_${commentId}`)
      .send();

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('update comment', () => {
  it('user can successfully update comment by id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const comment = Generator.Comment.getUnique(todoId);
    const { body: { data: { commentId } } } = await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send(comment);

    const newComment = Generator.Comment.getUnique(todoId);
    const resUpdate = await request()
      .patch(`${routes.comment}/${commentId}`)
      .set('authorization', `Bearer ${token}`)
      .send(newComment);

    const res = await request()
      .get(`${routes.comment}/${commentId}`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(resUpdate.statusCode).toEqual(200);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    expect(res.body.data).toEqual({
      id: commentId,
      ...newComment,
      replyCommentId: null,
      createdAt: expect.any(Number),
      updatedAt: expect.any(Number),
    });

    done();
  });
  it('user can\'t update comment without authorization header', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const comment = Generator.Comment.getUnique(todoId);
    const { body: { data: { commentId } } } = await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send(comment);

    const newComment = Generator.Comment.getUnique(todoId);
    const res = await request()
      .patch(`${routes.comment}/${commentId}`)
      .send(newComment);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t update comment if he does not have access to it', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const todoId = firstUser.getRandomTodoId();

    const secondUser = await helper.createUser(defaultUser);

    const comment = Generator.Comment.getUnique(todoId);
    const { body: { data: { commentId } } } = await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(comment);

    const newComment = Generator.Comment.getUnique();
    const res = await request()
      .patch(`${routes.comment}/${commentId}`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send(newComment);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t update comment by string id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const comment = Generator.Comment.getUnique(todoId);
    const { body: { data: { commentId } } } = await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send(comment);

    const newComment = Generator.Comment.getUnique(todoId);
    const res = await request()
      .patch(`${routes.comment}/string_${commentId}`)
      .send(newComment);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});
