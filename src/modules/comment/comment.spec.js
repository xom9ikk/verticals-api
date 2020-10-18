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
      todos: [{
        title: 'default-todo-1',
      }, {
        title: 'default-todo-2',
      }],
    }, {
      title: 'default-column-2',
      todos: [{
        title: 'default-todo-3',
      }, {
        title: 'default-todo-4',
      }, {
        title: 'default-todo-5',
      }],
    }],
  }, {
    title: 'default-board-2',
    columns: [{
      title: 'default-column-3',
      todos: [{
        title: 'default-todo-6',
      }, {
        title: 'default-todo-7',
      }, {
        title: 'default-todo-8',
      }],
    }, {
      title: 'default-column-4',
      todos: [{
        title: 'default-todo-9',
      }, {
        title: 'default-todo-10',
      }, {
        title: 'default-todo-11',
      }],
    }],
  }, {
    title: 'default-board-3',
    columns: [{
      title: 'default-column-5',
      todos: [{
        title: 'default-todo-12',
      }, {
        title: 'default-todo-13',
      }, {
        title: 'default-todo-14',
      }],
    }, {
      title: 'default-column-6',
      todos: [{
        title: 'default-todo-15',
      }, {
        title: 'default-todo-16',
      }, {
        title: 'default-todo-17',
      }],
    }],
  }, {
    title: 'default-board-4',
    columns: [{
      title: 'default-column-7',
      todos: [{
        title: 'default-todo-18',
      }, {
        title: 'default-todo-19',
      }, {
        title: 'default-todo-20',
      }],
    }, {
      title: 'default-column-8',
      todos: [{
        title: 'default-todo-21',
      }, {
        title: 'default-todo-22',
      }, {
        title: 'default-todo-23',
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
    delete comment.editDate;
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
    delete comment.editDate;
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
  it('user can`t create comment without authorization', async (done) => {
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
  it('user can`t create comment with empty text', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const comment = Generator.Comment.getUnique(todoId);
    const res = await request()
      .post(`${routes.comment}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...comment,
        text: '',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create comment with long text', async (done) => {
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
  it('user can`t create comment with negative column id', async (done) => {
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
  it('user can`t create comment with column id without having access to it', async (done) => {
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
      editDate: null,
      attachedFiles: [],
    });

    done();
  });
  it('user can`t get comment without authorization header', async (done) => {
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
  it('user can`t access to the comment if he does not have access to it', async (done) => {
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
  it('user can`t access to the comment by string id', async (done) => {
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
      editDate: null,
    }, {
      id: commentIdTwo,
      ...commentTwo,
      replyCommentId: null,
      editDate: null,
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
      editDate: null,
    }]);

    done();
  });
  it('user can successfully gets all comments to which he has access by column id', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const token = firstUser.getToken();
    const board = firstUser.getRandomBoard();
    const [firstColumn, secondColumn] = board.getColumns();
    const todoIdFromFirstColumn = firstColumn.getRandomTodoId();
    const todoIdFromSecondColumn = secondColumn.getRandomTodoId();

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
      editDate: null,
    }]);

    done();
  });
  it('user can successfully gets all comments to which he has access by todo id', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const token = firstUser.getToken();
    const board = firstUser.getRandomBoard();
    const [firstColumn, secondColumn] = board.getColumns();
    const todoIdFromFirstColumn = firstColumn.getRandomTodoId();
    const todoIdFromSecondColumn = secondColumn.getRandomTodoId();

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
      replyCommentId: null,
      editDate: null,
    }]);

    done();
  });
  it('user can`t get all comments if he does not have access to board id', async (done) => {
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
  it('user can`t get all comments if he does not have access to column id', async (done) => {
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
  it('user can`t get all comments if he does not have access to todo id', async (done) => {
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
  it('user can`t get comments if he has no comments', async (done) => {
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

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));
    done();
  });
  it('user can`t get all comments without authorization header', async (done) => {
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
  it('user can`t remove comment without authorization header', async (done) => {
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
  it('user can`t remove comment if he does not have access to it', async (done) => {
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
  it('user can`t remove comment by string id', async (done) => {
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
      editDate: expect.any(Date),
      attachedFiles: [],
    });

    done();
  });
  it('user can`t update comment without authorization header', async (done) => {
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
  it('user can`t update comment if he does not have access to it', async (done) => {
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
  it('user can`t update comment by string id', async (done) => {
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
