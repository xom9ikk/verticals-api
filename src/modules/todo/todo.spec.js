const { HeadingType } = require('../../constants');
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
      }, {
        title: 'default-heading-2',
      }],
    }, {
      title: 'default-column-2',
      headings: [{
        title: 'default-heading-3',
      }, {
        title: 'default-heading-4',
      }, {
        title: 'default-heading-5',
      }],
    }],
  }, {
    title: 'default-board-2',
    columns: [{
      title: 'default-column-3',
      headings: [{
        title: 'default-heading-6',
      }, {
        title: 'default-heading-7',
      }, {
        title: 'default-heading-8',
      }],
    }, {
      title: 'default-column-4',
      headings: [{
        title: 'default-heading-9',
      }, {
        title: 'default-heading-10',
      }, {
        title: 'default-heading-11',
      }],
    }],
  }, {
    title: 'default-board-3',
    columns: [{
      title: 'default-column-5',
      headings: [{
        title: 'default-heading-12',
      }, {
        title: 'default-heading-13',
      }, {
        title: 'default-heading-14',
      }],
    }, {
      title: 'default-column-6',
      headings: [{
        title: 'default-heading-15',
      }, {
        title: 'default-heading-16',
      }, {
        title: 'default-heading-17',
      }],
    }],
  }, {
    title: 'default-board-4',
    columns: [{
      title: 'default-column-7',
      headings: [{
        title: 'default-heading-18',
      }, {
        title: 'default-heading-19',
      }, {
        title: 'default-heading-20',
      }],
    }, {
      title: 'default-column-8',
      headings: [{
        title: 'default-heading-21',
      }, {
        title: 'default-heading-22',
      }, {
        title: 'default-heading-23',
      }],
    }],
  }],
};

describe('create', () => {
  it('user can successfully create todo with all fields', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingId);
    const res = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        todoId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create todo without description', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingId);
    delete todo.description;
    const res = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        todoId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create todo without status', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingId);
    delete todo.status;
    const res = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        todoId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create todo without color', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingId);
    delete todo.color;
    const res = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        todoId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create todo without is notifications enabled', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingId);
    delete todo.isNotificationsEnabled;
    const res = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        todoId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create todo without all non-required fields', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingId);
    delete todo.description;
    delete todo.status;
    delete todo.color;
    delete todo.isNotificationsEnabled;
    const res = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        todoId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create todo with belowId', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const firstTodo = Generator.Todo.getUnique(headingId);
    const firstRes = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(firstTodo);

    const secondTodo = Generator.Todo.getUnique(headingId);
    const secondRes = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(secondTodo);

    const firstTodoId = firstRes.body.data.todoId;
    const secondTodoId = secondRes.body.data.todoId;

    const thirdTodo = Generator.Todo.getUnique(headingId);
    const thirdRes = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...thirdTodo,
        belowId: firstTodoId,
      });
    const thirdTodoId = thirdRes.body.data.todoId;

    const resTodos = await request()
      .get(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(resTodos.statusCode).toEqual(200);
    expect(resTodos.body.data.todos.positions[headingId]).toEqual(
      [firstTodoId, thirdTodoId, secondTodoId],
    );

    done();
  });
  it('user can\'t create todo without authorization', async (done) => {
    const user = await helper.createUser(defaultUser);
    const headingId = user.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingId);
    const res = await request()
      .post(`${routes.todo}/`)
      .send(todo);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create todo without title', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingId);
    delete todo.title;
    const res = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create todo without heading id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingId);
    delete todo.headingId;
    const res = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create todo with empty title', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingId);
    const res = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...todo,
        title: '',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create todo with long title', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingId);
    const res = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...todo,
        title: Generator.Todo.getLongTitle(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create todo with negative color', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingId);
    const res = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...todo,
        color: Generator.Todo.getNegativeColor(),
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create todo with string color', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingId);
    const res = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...todo,
        color: Generator.Todo.getNegativeColor(),
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create todo with color which is not included in the enum', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingId);
    const res = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...todo,
        color: Generator.Todo.getInvalidColor(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create todo with negative heading id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingId);
    const res = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...todo,
        headingId: Generator.Todo.getNegativeHeadingId(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create todo with heading id without having access to it', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const { token } = firstUser;

    const secondUser = await helper.createUser(defaultUser);
    const headingIdWithoutAccess = secondUser.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingIdWithoutAccess);
    const res = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create todo with belowId without access', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const firstUserToken = firstUser.getToken();
    const headingIdWithoutAccess = firstUser.getRandomHeadingId();

    const secondUser = await helper.createUser(defaultUser);
    const secondUserToken = secondUser.getToken();
    const headingIdWithAccess = secondUser.getRandomHeadingId();

    const firstTodo = Generator.Todo.getUnique(headingIdWithoutAccess);
    const firstRes = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${firstUserToken}`)
      .send(firstTodo);

    const secondTodo = Generator.Todo.getUnique(headingIdWithAccess);
    await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${firstUserToken}`)
      .send(secondTodo);

    const firstTodoIdWithoutAccess = firstRes.body.data.todoId;

    const thirdTodo = Generator.Todo.getUnique(headingIdWithAccess);
    const thirdRes = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${secondUserToken}`)
      .send({
        ...thirdTodo,
        belowId: firstTodoIdWithoutAccess,
      });

    expect(thirdRes.statusCode).toEqual(403);
    expect(thirdRes.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));
    done();
  });
});

describe('get todo by id', () => {
  it('user can successfully get todo by id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingId);
    const { body: { data: { todoId } } } = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    const res = await request()
      .get(`${routes.todo}/${todoId}`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));
    expect(res.body.data).toEqual({
      id: todoId,
      ...todo,
      expirationDate: expect.any(Number),
      position: expect.any(Number),
    });

    done();
  });
  it('user can\'t get todo without authorization header', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingId);
    const { body: { data: { todoId } } } = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    const res = await request()
      .get(`${routes.todo}/${todoId}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t access to the todo if he does not have access to it', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const firstUserHeadingId = firstUser.getRandomHeadingId();

    const secondUser = await helper.createUser(defaultUser);

    const todo = Generator.Todo.getUnique(firstUserHeadingId);
    const { body: { data: { todoId } } } = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(todo);

    const res = await request()
      .get(`${routes.todo}/${todoId}`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send();

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t access to the todo by string id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingId);
    const { body: { data: { todoId } } } = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    const res = await request()
      .get(`${routes.todo}/string_${todoId}`)
      .send();

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('get all todos', () => {
  it('user can successfully gets all todos to which he has access', async (done) => {
    const user = await helper.createUser(defaultUser);
    const [firstHeadingId, secondHeadingId] = user.getHeadingIds();
    const token = user.getToken();
    const secondUser = await helper.createUser(defaultUser);
    const secondUserHeadingId = secondUser.getRandomHeadingId();

    const secondUserTodo = Generator.Todo.getUnique(secondUserHeadingId);
    await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send(secondUserTodo);

    const todoOne = Generator.Todo.getUnique(firstHeadingId);
    await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todoOne);

    const todoTwo = Generator.Todo.getUnique(secondHeadingId);
    await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todoTwo);

    const res = await request()
      .get(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    const { todos } = res.body.data;

    expect(todos.entities).toEqual(
      expect.arrayContaining([{
        id: expect.any(Number),
        ...todoOne,
        attachmentsCount: 0,
        commentsCount: 0,
        imagesCount: 0,
        expirationDate: expect.any(Number),
      }, {
        id: expect.any(Number),
        ...todoTwo,
        attachmentsCount: 0,
        commentsCount: 0,
        imagesCount: 0,
        expirationDate: expect.any(Number),
      }]),
    );

    expect(Object.keys(todos.positions[firstHeadingId])).toHaveLength(1);
    expect(Object.keys(todos.positions[secondHeadingId])).toHaveLength(1);

    done();
  });
  it('user can successfully gets all todos to which he has access by board id', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const token = firstUser.getToken();
    const [firstBoardId, secondBoardId] = firstUser.getBoardIds();
    const headingIdFromFirstBoard = firstUser.getRandomHeadingIdFromBoard(firstBoardId);
    const headingIdFromSecondBoard = firstUser.getRandomHeadingIdFromBoard(secondBoardId);

    await helper.createUser(defaultUser);

    const todoOne = Generator.Todo.getUnique(headingIdFromFirstBoard);
    await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todoOne);

    const todoTwo = Generator.Todo.getUnique(headingIdFromSecondBoard);
    await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todoTwo);

    const res = await request()
      .get(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .query({ boardId: firstBoardId })
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    const { todos } = res.body.data;

    expect(todos.entities).toEqual(
      expect.arrayContaining([{
        id: expect.any(Number),
        ...todoOne,
        attachmentsCount: 0,
        commentsCount: 0,
        imagesCount: 0,
        expirationDate: expect.any(Number),
      }]),
    );

    expect(Object.keys(todos.positions[headingIdFromFirstBoard])).toHaveLength(1);

    done();
  });
  it('user can successfully gets all todos to which he has access by column id', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const token = firstUser.getToken();
    const [firstBoardId, secondBoardId] = firstUser.getBoardIds();
    const headingIdFromSecondBoard = firstUser.getRandomHeadingIdFromBoard(secondBoardId);
    const columnFromFirstBoard = firstUser.getRandomColumnFromBoard(firstBoardId);
    const columnIdFromFirstBoard = columnFromFirstBoard.id;
    const headingIdFromFirstBoard = columnFromFirstBoard.getRandomHeadingId();

    await helper.createUser(defaultUser);

    const todoOne = Generator.Todo.getUnique(headingIdFromFirstBoard);
    await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todoOne);

    const todoTwo = Generator.Todo.getUnique(headingIdFromSecondBoard);
    await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todoTwo);

    const res = await request()
      .get(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .query({ columnId: columnIdFromFirstBoard })
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    const { todos } = res.body.data;

    expect(todos.entities).toEqual(
      expect.arrayContaining([{
        id: expect.any(Number),
        ...todoOne,
        attachmentsCount: 0,
        commentsCount: 0,
        imagesCount: 0,
        expirationDate: expect.any(Number),
      }]),
    );

    expect(Object.keys(todos.positions[headingIdFromFirstBoard])).toHaveLength(1);

    done();
  });
  it('user can\'t get all todos if he does not have access to board id', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const token = firstUser.getToken();
    const [firstBoardId, secondBoardId] = firstUser.getBoardIds();
    const headingIdFromFirstBoard = firstUser.getRandomHeadingIdFromBoard(firstBoardId);
    const headingIdFromSecondBoard = firstUser.getRandomHeadingIdFromBoard(secondBoardId);

    const secondUser = await helper.createUser(defaultUser);
    const boardIdWithoutAccess = secondUser.getRandomBoardId();

    const todoOne = Generator.Todo.getUnique(headingIdFromFirstBoard);
    await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todoOne);

    const todoTwo = Generator.Todo.getUnique(headingIdFromSecondBoard);
    await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todoTwo);

    const res = await request()
      .get(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .query({ boardId: boardIdWithoutAccess })
      .send();

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t get all todos if he does not have access to column id', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const token = firstUser.getToken();
    const [firstBoardId, secondBoardId] = firstUser.getBoardIds();
    const headingIdFromFirstBoard = firstUser.getRandomHeadingIdFromBoard(firstBoardId);
    const headingIdFromSecondBoard = firstUser.getRandomHeadingIdFromBoard(secondBoardId);

    const secondUser = await helper.createUser(defaultUser);
    const columnIdWithoutAccess = secondUser.getRandomColumnId();

    const todoOne = Generator.Todo.getUnique(headingIdFromFirstBoard);
    await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todoOne);

    const todoTwo = Generator.Todo.getUnique(headingIdFromSecondBoard);
    await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todoTwo);

    const res = await request()
      .get(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .query({ columnId: columnIdWithoutAccess })
      .send();

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t get todos if he has no todos', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const [firstHeadingId, secondHeadingId] = firstUser.getHeadingIds();
    const secondUser = await helper.createUser();

    const todoOne = Generator.Todo.getUnique(firstHeadingId);
    await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(todoOne);

    const todoTwo = Generator.Todo.getUnique(secondHeadingId);
    await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(todoTwo);

    const res = await request()
      .get(`${routes.todo}/`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: {
        todos: {
          entities: [],
          positions: {},
        },
      },
    }));
    done();
  });
  it('user can\'t get all todos without authorization header', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingId);
    await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    const res = await request()
      .get(`${routes.todo}/`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('get all removed todos', () => {
  it('user can successfully gets all removed todos to which he has access', async (done) => {
    const user = await helper.createUser(defaultUser);
    const [firstHeadingId, secondHeadingId] = user.getHeadingIds();
    const token = user.getToken();

    const defaultTodos = [{
      title: 'default-todo-1',
    }, {
      title: 'default-todo-2',
    }, {
      title: 'default-todo-3',
    }, {
      title: 'default-todo-4',
    }, {
      title: 'default-todo-5',
    }, {
      title: 'default-todo-6',
    }];

    await helper.createTodos({
      headingId: firstHeadingId,
      token,
      todos: defaultTodos,
    });

    await helper.createTodos({
      headingId: secondHeadingId,
      token,
      todos: defaultTodos,
    });

    const secondUser = await helper.createUser(defaultUser);
    const secondUserToken = secondUser.getToken();
    const secondUserHeadingId = secondUser.getRandomHeadingId();

    await helper.createTodos({
      headingId: secondUserHeadingId,
      token: secondUserToken,
      todos: defaultTodos,
    });

    const resTodos = await request()
      .get(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const { todos } = resTodos.body.data;

    const [firstTodoIdForDelete, secondTodoIdForDelete] = todos.positions[firstHeadingId];
    const [thirdTodoIdForDelete] = todos.positions[secondHeadingId];

    await request()
      .post(`${routes.todo}/switch-removed`)
      .set('authorization', `Bearer ${token}`)
      .send({ todoId: firstTodoIdForDelete });
    await request()
      .post(`${routes.todo}/switch-removed`)
      .set('authorization', `Bearer ${token}`)
      .send({ todoId: secondTodoIdForDelete });
    await request()
      .post(`${routes.todo}/switch-removed`)
      .set('authorization', `Bearer ${token}`)
      .send({ todoId: thirdTodoIdForDelete });

    const res = await request()
      .get(`${routes.todo}/trash`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.body.data.todos.entities).toEqual([
      expect.objectContaining({
        id: firstTodoIdForDelete,
      }), expect.objectContaining({
        id: secondTodoIdForDelete,
      }), expect.objectContaining({
        id: thirdTodoIdForDelete,
      }),
    ]);

    done();
  });
});

describe('remove todo', () => {
  it('user can successfully remove todo by id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingId);
    const { body: { data: { todoId } } } = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    const res = await request()
      .delete(`${routes.todo}/${todoId}`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t remove todo without authorization header', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingId);
    const { body: { data: { todoId } } } = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    const res = await request()
      .delete(`${routes.todo}/${todoId}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t remove todo if he does not have access to it', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const headingId = firstUser.getRandomHeadingId();

    const secondUser = await helper.createUser();

    const todo = Generator.Todo.getUnique(headingId);
    const { body: { data: { todoId } } } = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(todo);

    const res = await request()
      .delete(`${routes.todo}/${todoId}`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send();

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t remove todo by string id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingId);
    const { body: { data: { todoId } } } = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    const res = await request()
      .delete(`${routes.todo}/string_${todoId}`)
      .send();

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('update todo', () => {
  it('user can successfully update todo by id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingId);
    const { body: { data: { todoId } } } = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    const newTodo = Generator.Todo.getUnique(headingId);
    const resUpdate = await request()
      .patch(`${routes.todo}/${todoId}`)
      .set('authorization', `Bearer ${token}`)
      .send(newTodo);

    const res = await request()
      .get(`${routes.todo}/${todoId}`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(resUpdate.statusCode).toEqual(200);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));
    expect(res.body.data).toEqual({
      id: todoId,
      ...newTodo,
      expirationDate: expect.any(Number),
      position: expect.any(Number),
    });

    done();
  });
  it('user can\'t update todo without authorization header', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingId);
    const { body: { data: { todoId } } } = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    const newTodo = Generator.Todo.getUnique(headingId);
    const res = await request()
      .patch(`${routes.todo}/${todoId}`)
      .send(newTodo);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t update todo if he does not have access to it', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const headingId = firstUser.getRandomHeadingId();

    const secondUser = await helper.createUser(defaultUser);

    const todo = Generator.Todo.getUnique(headingId);
    const { body: { data: { todoId } } } = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(todo);

    const newTodo = Generator.Todo.getUnique();
    const res = await request()
      .patch(`${routes.todo}/${todoId}`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send(newTodo);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t update todo by string id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingId);
    const { body: { data: { todoId } } } = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    const newTodo = Generator.Todo.getUnique(headingId);
    const res = await request()
      .patch(`${routes.todo}/string_${todoId}`)
      .send(newTodo);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t update todo if he does not have access to heading id', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const firstUserHeadingId = firstUser.getRandomHeadingId();

    const secondUser = await helper.createUser(defaultUser);
    const headingIdWithoutAccessForFirstUser = secondUser.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(firstUserHeadingId);
    const { body: { data: { todoId } } } = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(todo);

    const newTodo = Generator.Todo.getUnique(headingIdWithoutAccessForFirstUser);
    const res = await request()
      .patch(`${routes.todo}/${todoId}`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(newTodo);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('update position', () => {
  it('user can successfully update position', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    await helper.createTodos({
      token,
      headingId,
      todos: [{
        title: 'default-todo-1',
      }, {
        title: 'default-todo-2',
      }, {
        title: 'default-todo-3',
      }, {
        title: 'default-todo-4',
      }, {
        title: 'default-todo-5',
      }, {
        title: 'default-todo-6',
      }],
    });

    const resTodosBeforeUpdate = await request()
      .get(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    await request()
      .patch(`${routes.todo}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        headingId,
        sourcePosition: 1,
        destinationPosition: 4,
      });

    const resTodosAfterUpdate = await request()
      .get(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const beforePositions = resTodosBeforeUpdate.body.data.todos.positions[headingId];
    const afterPositions = resTodosAfterUpdate.body.data.todos.positions[headingId];

    expect(afterPositions).toEqual([
      beforePositions[0],
      beforePositions[2],
      beforePositions[3],
      beforePositions[4],
      beforePositions[1],
      beforePositions[5],
    ]);

    done();
  });
  it('user can successfully move todo between headings', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const [firstHeadingId, secondHeadingId] = user.getHeadingIds();

    await helper.createTodos({
      token,
      headingId: firstHeadingId,
      todos: [{
        title: 'default-todo-1',
      }, {
        title: 'default-todo-2',
      }, {
        title: 'default-todo-3',
      }, {
        title: 'default-todo-4',
      }, {
        title: 'default-todo-5',
      }, {
        title: 'default-todo-6',
      }],
    });

    await helper.createTodos({
      token,
      headingId: secondHeadingId,
      todos: [{
        title: 'default-todo-1',
      }, {
        title: 'default-todo-2',
      }, {
        title: 'default-todo-3',
      }, {
        title: 'default-todo-4',
      }, {
        title: 'default-todo-5',
      }, {
        title: 'default-todo-6',
      }],
    });

    const resTodosBeforeUpdate = await request()
      .get(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    await request()
      .patch(`${routes.todo}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        headingId: firstHeadingId,
        targetHeadingId: secondHeadingId,
        sourcePosition: 1,
        destinationPosition: 4,
      });

    const resTodosAfterUpdate = await request()
      .get(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const beforePositionsForFirstHeading = resTodosBeforeUpdate.body.data.todos.positions[firstHeadingId];
    const afterPositionsForFirstHeading = resTodosAfterUpdate.body.data.todos.positions[firstHeadingId];

    expect(afterPositionsForFirstHeading).toEqual([
      beforePositionsForFirstHeading[0],
      beforePositionsForFirstHeading[2],
      beforePositionsForFirstHeading[3],
      beforePositionsForFirstHeading[4],
      beforePositionsForFirstHeading[5],
    ]);

    const beforePositionsForSecondHeading = resTodosBeforeUpdate.body.data.todos.positions[secondHeadingId];
    const afterPositionsForSecondHeading = resTodosAfterUpdate.body.data.todos.positions[secondHeadingId];

    expect(afterPositionsForSecondHeading).toEqual([
      beforePositionsForSecondHeading[0],
      beforePositionsForSecondHeading[1],
      beforePositionsForSecondHeading[2],
      beforePositionsForSecondHeading[3],
      beforePositionsForFirstHeading[1],
      beforePositionsForSecondHeading[4],
      beforePositionsForSecondHeading[5],
    ]);

    done();
  });
  it('user can\'t update position with wrong source position', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    await helper.createTodos({
      token,
      headingId,
      todos: [{
        title: 'default-todo-1',
      }, {
        title: 'default-todo-2',
      }, {
        title: 'default-todo-3',
      }, {
        title: 'default-todo-4',
      }, {
        title: 'default-todo-5',
      }, {
        title: 'default-todo-6',
      }],
    });

    const res = await request()
      .patch(`${routes.todo}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        headingId,
        sourcePosition: 6,
        destinationPosition: 4,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t update position with wrong destination position', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    await helper.createTodos({
      token,
      headingId,
      todos: [{
        title: 'default-todo-1',
      }, {
        title: 'default-todo-2',
      }, {
        title: 'default-todo-3',
      }, {
        title: 'default-todo-4',
      }, {
        title: 'default-todo-5',
      }, {
        title: 'default-todo-6',
      }],
    });

    const res = await request()
      .patch(`${routes.column}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        headingId,
        sourcePosition: 1,
        destinationPosition: 6,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t update position with headingId without access', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const secondUser = await helper.createUser(defaultUser);
    const headingIdWithoutAccess = secondUser.getRandomHeadingId();

    await helper.createTodos({
      token,
      headingId,
      todos: [{
        title: 'default-todo-1',
      }, {
        title: 'default-todo-2',
      }, {
        title: 'default-todo-3',
      }, {
        title: 'default-todo-4',
      }, {
        title: 'default-todo-5',
      }, {
        title: 'default-todo-6',
      }],
    });

    const res = await request()
      .patch(`${routes.todo}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        headingId: headingIdWithoutAccess,
        sourcePosition: 1,
        destinationPosition: 6,
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t move todo between headings wrong source position', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const [firstHeadingId, secondHeadingId] = user.getHeadingIds();

    await helper.createTodos({
      token,
      headingId: firstHeadingId,
      todos: [{
        title: 'default-todo-1',
      }, {
        title: 'default-todo-2',
      }, {
        title: 'default-todo-3',
      }, {
        title: 'default-todo-4',
      }, {
        title: 'default-todo-5',
      }, {
        title: 'default-todo-6',
      }],
    });

    await helper.createTodos({
      token,
      headingId: secondHeadingId,
      todos: [{
        title: 'default-todo-1',
      }, {
        title: 'default-todo-2',
      }, {
        title: 'default-todo-3',
      }, {
        title: 'default-todo-4',
      }, {
        title: 'default-todo-5',
      }, {
        title: 'default-todo-6',
      }],
    });

    const res = await request()
      .patch(`${routes.todo}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        headingId: firstHeadingId,
        targetHeadingId: secondHeadingId,
        sourcePosition: 6,
        destinationPosition: 4,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t move todo between headings wrong destination position', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const [firstHeadingId, secondHeadingId] = user.getHeadingIds();

    await helper.createTodos({
      token,
      headingId: firstHeadingId,
      todos: [{
        title: 'default-todo-1',
      }, {
        title: 'default-todo-2',
      }, {
        title: 'default-todo-3',
      }, {
        title: 'default-todo-4',
      }, {
        title: 'default-todo-5',
      }, {
        title: 'default-todo-6',
      }],
    });

    await helper.createTodos({
      token,
      headingId: secondHeadingId,
      todos: [{
        title: 'default-todo-1',
      }, {
        title: 'default-todo-2',
      }, {
        title: 'default-todo-3',
      }, {
        title: 'default-todo-4',
      }, {
        title: 'default-todo-5',
      }, {
        title: 'default-todo-6',
      }],
    });

    const res = await request()
      .patch(`${routes.todo}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        headingId: firstHeadingId,
        targetHeadingId: secondHeadingId,
        sourcePosition: 1,
        destinationPosition: 7, // add entity to new heading, can be +1
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t move todo between headings with targetHeadingId without access', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const secondUser = await helper.createUser(defaultUser);
    const secondUserToken = secondUser.getToken();
    const headingIdWithoutAccess = secondUser.getRandomHeadingId();

    await helper.createTodos({
      token,
      headingId,
      todos: [{
        title: 'default-todo-1',
      }, {
        title: 'default-todo-2',
      }, {
        title: 'default-todo-3',
      }, {
        title: 'default-todo-4',
      }, {
        title: 'default-todo-5',
      }, {
        title: 'default-todo-6',
      }],
    });

    await helper.createTodos({
      token: secondUserToken,
      headingId: headingIdWithoutAccess,
      todos: [{
        title: 'default-todo-1',
      }, {
        title: 'default-todo-2',
      }, {
        title: 'default-todo-3',
      }, {
        title: 'default-todo-4',
      }, {
        title: 'default-todo-5',
      }, {
        title: 'default-todo-6',
      }],
    });

    const res = await request()
      .patch(`${routes.todo}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        headingId,
        targetHeadingId: headingIdWithoutAccess,
        sourcePosition: 1,
        destinationPosition: 4,
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));
    done();
  });
});

describe('switch removed', () => {
  it('user can successfully remove todos to which he has access', async (done) => {
    const user = await helper.createUser(defaultUser);
    const headingId = user.getRandomHeadingId();
    const token = user.getToken();

    await helper.createTodos({
      headingId,
      token,
      todos: [{
        title: 'default-todo-1',
      }, {
        title: 'default-todo-2',
      }, {
        title: 'default-todo-3',
      }, {
        title: 'default-todo-4',
      }, {
        title: 'default-todo-5',
      }, {
        title: 'default-todo-6',
      }],
    });

    const resBeforeTodos = await request()
      .get(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const beforeTodoPositions = resBeforeTodos.body.data.todos.positions[headingId];
    const secondTodoIdForDelete = beforeTodoPositions[1];

    await request()
      .post(`${routes.todo}/switch-removed`)
      .set('authorization', `Bearer ${token}`)
      .send({ todoId: secondTodoIdForDelete });

    const resAfterTodos = await request()
      .get(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const afterTodoPositions = resAfterTodos.body.data.todos.positions[headingId];

    expect(afterTodoPositions).toEqual(
      [
        beforeTodoPositions[0],
        beforeTodoPositions[2],
        beforeTodoPositions[3],
        beforeTodoPositions[4],
        beforeTodoPositions[5],
      ],
    );

    done();
  });
  it('user can successfully restore removed todos to which he has access', async (done) => {
    const user = await helper.createUser(defaultUser);
    const column = user.getRandomColumn();
    const headingId = column.getRandomHeadingId();
    const token = user.getToken();

    await helper.createTodos({
      headingId,
      token,
      todos: [{
        title: 'default-todo-1',
      }, {
        title: 'default-todo-2',
      }, {
        title: 'default-todo-3',
      }, {
        title: 'default-todo-4',
      }, {
        title: 'default-todo-5',
      }, {
        title: 'default-todo-6',
      }],
    });

    const resHeadings = await request()
      .get(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .query({ columnId: column.id })
      .send();

    const defaultHeadingId = resHeadings.body.data.headings.entities
      .find((heading) => heading.type === HeadingType.default).id;

    const resBeforeTodosRes = await request()
      .get(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const beforeTodoPositions = resBeforeTodosRes.body.data.todos.positions[headingId];
    const secondTodoIdForDelete = beforeTodoPositions[1];

    await request()
      .post(`${routes.todo}/switch-removed`)
      .set('authorization', `Bearer ${token}`)
      .send({ todoId: secondTodoIdForDelete });

    await request()
      .post(`${routes.todo}/switch-removed`)
      .set('authorization', `Bearer ${token}`)
      .send({ todoId: secondTodoIdForDelete });

    const afterTodosRes = await request()
      .get(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const afterTodoPositions = afterTodosRes.body.data.todos.positions;
    const afterTodoPositionsInCustomHeading = afterTodoPositions[headingId];
    const afterTodoPositionsInDefaultHeading = afterTodoPositions[defaultHeadingId];

    expect(afterTodoPositionsInCustomHeading).toEqual(
      [
        beforeTodoPositions[0],
        beforeTodoPositions[2],
        beforeTodoPositions[3],
        beforeTodoPositions[4],
        beforeTodoPositions[5],
      ],
    );

    expect(afterTodoPositionsInDefaultHeading).toEqual(
      [
        beforeTodoPositions[1],
      ],
    );

    done();
  });
});

describe('switch archived', () => {
  it('user can successfully archive todos to which he has access', async (done) => {
    const user = await helper.createUser(defaultUser);
    const headingId = user.getRandomHeadingId();
    const token = user.getToken();

    await helper.createTodos({
      headingId,
      token,
      todos: [{
        title: 'default-todo-1',
      }, {
        title: 'default-todo-2',
      }, {
        title: 'default-todo-3',
      }, {
        title: 'default-todo-4',
      }, {
        title: 'default-todo-5',
      }, {
        title: 'default-todo-6',
      }],
    });

    const resBeforeTodos = await request()
      .get(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const beforeTodoPositions = resBeforeTodos.body.data.todos.positions[headingId];
    const secondTodoIdForArchive = beforeTodoPositions[1];

    await request()
      .post(`${routes.todo}/switch-archived`)
      .set('authorization', `Bearer ${token}`)
      .send({ todoId: secondTodoIdForArchive });

    const resAfterTodos = await request()
      .get(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const afterTodoPositions = resAfterTodos.body.data.todos.positions[headingId];

    expect(afterTodoPositions).toEqual(
      [
        beforeTodoPositions[0],
        beforeTodoPositions[2],
        beforeTodoPositions[3],
        beforeTodoPositions[4],
        beforeTodoPositions[5],
      ],
    );

    done();
  });
  it('user can successfully un-archive todos to which he has access', async (done) => {
    const user = await helper.createUser(defaultUser);
    const column = user.getRandomColumn();
    const headingId = column.getRandomHeadingId();
    const token = user.getToken();

    await helper.createTodos({
      headingId,
      token,
      todos: [{
        title: 'default-todo-1',
      }, {
        title: 'default-todo-2',
      }, {
        title: 'default-todo-3',
      }, {
        title: 'default-todo-4',
      }, {
        title: 'default-todo-5',
      }, {
        title: 'default-todo-6',
      }],
    });

    const resHeadings = await request()
      .get(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .query({ columnId: column.id })
      .send();

    const defaultHeadingId = resHeadings.body.data.headings.entities
      .find((heading) => heading.type === HeadingType.default).id;

    const resBeforeTodosRes = await request()
      .get(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const beforeTodoPositions = resBeforeTodosRes.body.data.todos.positions[headingId];
    const secondTodoIdForArchive = beforeTodoPositions[1];

    await request()
      .post(`${routes.todo}/switch-archived`)
      .set('authorization', `Bearer ${token}`)
      .send({ todoId: secondTodoIdForArchive });

    await request()
      .post(`${routes.todo}/switch-archived`)
      .set('authorization', `Bearer ${token}`)
      .send({ todoId: secondTodoIdForArchive });

    const afterTodosRes = await request()
      .get(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const afterTodoPositions = afterTodosRes.body.data.todos.positions;
    const afterTodoPositionsInCustomHeading = afterTodoPositions[headingId];
    const afterTodoPositionsInDefaultHeading = afterTodoPositions[defaultHeadingId];

    expect(afterTodoPositionsInCustomHeading).toEqual(
      [
        beforeTodoPositions[0],
        beforeTodoPositions[2],
        beforeTodoPositions[3],
        beforeTodoPositions[4],
        beforeTodoPositions[5],
      ],
    );

    expect(afterTodoPositionsInDefaultHeading).toEqual(
      [
        beforeTodoPositions[1],
      ],
    );

    done();
  });
});

describe('duplicate', () => {
  it('user can successfully duplicate todo', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    await helper.createTodos({
      token,
      headingId,
      todos: [{
        title: 'default-todo-1',
        subTodos: [{ title: 'default-sub-todo-1' }],
      }, {
        title: 'default-todo-2',
        subTodos: [{ title: 'default-sub-todo-2' }],
      }],
    });

    const resTodos = await request()
      .get(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const beforeTodos = resTodos.body.data.todos;

    const todoIds = beforeTodos.positions[headingId];
    const todoId = todoIds[0];
    const firstTodo = beforeTodos.entities.find((todo) => todo.id === todoIds[0]);
    const secondTodo = beforeTodos.entities.find((todo) => todo.id === todoIds[1]);

    const resDuplicate = await request()
      .post(`${routes.todo}/duplicate`)
      .set('authorization', `Bearer ${token}`)
      .send({
        todoId,
      });

    const resTodoAfterDuplicate = await request()
      .get(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const afterTodos = resTodoAfterDuplicate.body.data.todos;
    const duplicatedTodoId = resDuplicate.body.data.todoId;

    expect(afterTodos.positions[headingId]).toEqual([
      todoIds[0],
      duplicatedTodoId,
      todoIds[1],
    ]);

    expect(afterTodos.entities).toEqual(expect.arrayContaining([
      firstTodo,
      secondTodo, {
        ...firstTodo,
        id: duplicatedTodoId,
      },
    ]));

    done();
  });
  it('user can\'t duplicate todo without access to todo', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const secondUser = await helper.createUser(defaultUser);
    const secondUserToken = secondUser.getToken();
    const headingIdWithoutAccess = secondUser.getRandomHeadingId();

    await helper.createTodos({
      token,
      headingId,
      todos: [{
        title: 'default-todo-1',
        subTodos: [{ title: 'default-sub-todo-1' }],
      }, {
        title: 'default-todo-2',
        subTodos: [{ title: 'default-sub-todo-2' }],
      }],
    });

    await helper.createTodos({
      token: secondUserToken,
      headingId: headingIdWithoutAccess,
      todos: [{
        title: 'default-todo-1',
        subTodos: [{ title: 'default-sub-todo-1' }],
      }, {
        title: 'default-todo-2',
        subTodos: [{ title: 'default-sub-todo-2' }],
      }],
    });

    const resTodosWithoutAccess = await request()
      .get(`${routes.todo}/`)
      .set('authorization', `Bearer ${secondUserToken}`)
      .send();

    const todoIdWithoutAccess = resTodosWithoutAccess.body.data.todos.positions[headingIdWithoutAccess][0];

    const res = await request()
      .post(`${routes.todo}/duplicate`)
      .set('authorization', `Bearer ${token}`)
      .send({
        todoId: todoIdWithoutAccess,
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});
