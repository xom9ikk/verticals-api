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
