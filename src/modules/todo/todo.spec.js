const supertest = require('supertest');
const app = require('../../server');
const { Generator } = require('../../../tests/generator');
const { Helper } = require('../../../tests/helper');
const { routes } = require('../../../tests/routes');

const request = supertest(app);
const helper = new Helper(request);

const defaultUser = {
  boards: [{
    title: 'default-column-1',
    columns: [{
      title: 'default-column-1',
    }],
  }, {
    title: 'default-column-2',
    columns: [{
      title: 'default-column-2',
    }],
  }, {
    title: 'default-column-3',
    columns: [{
      title: 'default-column-3',
    }],
  }, {
    title: 'default-column-4',
    columns: [{
      title: 'default-column-4',
    }],
  }],
};

afterAll(async (done) => {
  await knex.destroy();
  done();
});

describe('create', () => {
  it('user can successfully create todo with all fields', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    const res = await request
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
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    delete todo.description;
    const res = await request
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
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    delete todo.status;
    const res = await request
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
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    delete todo.color;
    const res = await request
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
  it('user can successfully create todo without is archived', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    delete todo.isArchived;
    const res = await request
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
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    delete todo.isNotificationsEnabled;
    const res = await request
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
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    delete todo.description;
    delete todo.status;
    delete todo.color;
    delete todo.isArchived;
    delete todo.isNotificationsEnabled;
    const res = await request
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
  it('user can`t create todo without authorization', async (done) => {
    const user = await helper.createUser(defaultUser);
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    const res = await request
      .post(`${routes.todo}/`)
      .send(todo);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create todo without title', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    delete todo.title;
    const res = await request
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
  it('user can`t create todo without position', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    delete todo.position;
    const res = await request
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
  it('user can`t create todo with empty title', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    const res = await request
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
  it('user can`t create todo with long title', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    const res = await request
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...todo,
        title: Generator.Board.getLongTitle(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create todo with negative position', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    const res = await request
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...todo,
        position: Generator.Board.getNegativePosition(),
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create todo with string position', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    const res = await request
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...todo,
        position: Generator.Board.getStringPosition(),
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create todo with negative color', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    const res = await request
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...todo,
        color: Generator.Board.getNegativeColor(),
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create todo with string color', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    const res = await request
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...todo,
        color: Generator.Board.getNegativeColor(),
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create todo with color which is not included in the enum', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    const res = await request
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...todo,
        color: Generator.Board.getInvalidColor(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create todo with negative column id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    const res = await request
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...todo,
        columnId: Generator.Todo.getNegativeColumnId(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create todo with column id without having access to it', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const { token } = firstUser;

    const secondUser = await helper.createUser(defaultUser);
    const columnIdWithoutAccess = secondUser.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnIdWithoutAccess);
    const res = await request
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
});

describe('get todo by id', () => {
  it('user can successfully get todo by id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    const { body: { data: { todoId } } } = await request
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    const res = await request
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
    });

    done();
  });
  it('user can`t get todo without authorization header', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    const { body: { data: { todoId } } } = await request
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    const res = await request
      .get(`${routes.todo}/${todoId}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t access to the todo if he does not have access to it', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const firstUserColumnId = firstUser.getRandomColumnId();

    const secondUser = await helper.createUser(defaultUser);

    const todo = Generator.Todo.getUnique(firstUserColumnId);
    const { body: { data: { todoId } } } = await request
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(todo);

    const res = await request
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
  it('user can`t access to the todo by string id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    const { body: { data: { todoId } } } = await request
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    const res = await request
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
    const firstUser = await helper.createUser(defaultUser);
    const token = firstUser.getToken();
    const [firstBoard, secondBoard] = await helper.createBoards({
      token,
      boards: defaultUser.boards,
    });
    await helper.createUser(defaultUser);

    const todoOne = Generator.Todo.getUnique(firstBoard.id);
    await request
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todoOne);

    const todoTwo = Generator.Todo.getUnique(secondBoard.id);
    await request
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todoTwo);

    const res = await request
      .get(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    const { todos } = res.body.data;
    const [{ id: todoIdOne }, { id: todoIdTwo }] = todos;

    expect(todos).toEqual([{
      id: todoIdOne,
      ...todoOne,
    }, {
      id: todoIdTwo,
      ...todoTwo,
    }]);

    done();
  });
  it('user can`t get todos if he has no todos', async (done) => {
    const firstUser = await helper.createUser();
    const [firstBoard, secondBoard] = await helper.createBoards({
      token: firstUser.getToken(),
      boards: defaultUser.boards,
    });
    const secondUser = await helper.createUser();

    const todoOne = Generator.Todo.getUnique(firstBoard.id);
    await request
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(todoOne);

    const todoTwo = Generator.Todo.getUnique(secondBoard.id);
    await request
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(todoTwo);

    const res = await request
      .get(`${routes.todo}/`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send();

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));
    done();
  });
  it('user can`t get all todos without authorization header', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    await request
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    const res = await request
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
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    const { body: { data: { todoId } } } = await request
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    const res = await request
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
  it('user can`t remove todo without authorization header', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();
    const todo = Generator.Todo.getUnique(columnId);
    const { body: { data: { todoId } } } = await request
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    const res = await request
      .delete(`${routes.todo}/${todoId}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t remove todo if he does not have access to it', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const columnId = firstUser.getRandomColumnId();

    const secondUser = await helper.createUser();

    const todo = Generator.Todo.getUnique(columnId);
    const { body: { data: { todoId } } } = await request
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(todo);

    const res = await request
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
  it('user can`t remove todo by string id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    const { body: { data: { todoId } } } = await request
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    const res = await request
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
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    const { body: { data: { todoId } } } = await request
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    const newTodo = Generator.Todo.getUnique(columnId);
    const resUpdate = await request
      .patch(`${routes.todo}/${todoId}`)
      .set('authorization', `Bearer ${token}`)
      .send(newTodo);

    const res = await request
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
    });

    done();
  });
  it('user can`t update todo without authorization header', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    const { body: { data: { todoId } } } = await request
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    const newTodo = Generator.Todo.getUnique(columnId);
    const res = await request
      .patch(`${routes.todo}/${todoId}`)
      .send(newTodo);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t update todo if he does not have access to it', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const columnId = firstUser.getRandomColumnId();

    const secondUser = await helper.createUser(defaultUser);

    const todo = Generator.Todo.getUnique(columnId);
    const { body: { data: { todoId } } } = await request
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(todo);

    const newTodo = Generator.Todo.getUnique();
    const res = await request
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
  it('user can`t update todo by string id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    const { body: { data: { todoId } } } = await request
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    const newTodo = Generator.Todo.getUnique(columnId);
    const res = await request
      .patch(`${routes.todo}/string_${todoId}`)
      .send(newTodo);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t update todo if he does not have access to new column id', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const firstUserColumnId = firstUser.getRandomColumnId();

    const secondUser = await helper.createUser(defaultUser);
    const columnIdWithoutAccess = secondUser.getRandomColumnId();

    const todo = Generator.Todo.getUnique(firstUserColumnId);
    const { body: { data: { todoId } } } = await request
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(todo);

    const newTodo = Generator.Todo.getUnique(columnIdWithoutAccess);
    const res = await request
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
