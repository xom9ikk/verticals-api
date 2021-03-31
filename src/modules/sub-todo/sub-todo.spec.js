const { SUB_TODO_ON_TOP } = require('../../constants');
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

const defaultUser = Helper.configureUser({
  boards: 4,
  columns: 2,
  headings: 2,
  todos: 2,
});

const sdvfb = {
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
  it('user can successfully create subTodo with all fields', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(todoId);
    const res = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodo);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        subTodoId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create subTodo without description', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(todoId);
    delete subTodo.description;
    const res = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodo);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        subTodoId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create subTodo without status', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(todoId);
    delete subTodo.status;
    const res = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodo);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        subTodoId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create subTodo without color', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(todoId);
    delete subTodo.color;
    const res = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodo);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        subTodoId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create subTodo without is notifications enabled', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(todoId);
    delete subTodo.isNotificationsEnabled;
    const res = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodo);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        subTodoId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create subTodo without all non-required fields', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(todoId);
    delete subTodo.description;
    delete subTodo.status;
    delete subTodo.color;
    delete subTodo.isNotificationsEnabled;
    const res = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodo);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        subTodoId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create subTodo on top of list', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const firstSubTodo = Generator.SubTodo.getUnique(todoId);
    const firstSubTodoRes = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(firstSubTodo);

    const subTodoOnTop = Generator.SubTodo.getUnique(todoId);
    const subTodoOnTopRes = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...subTodoOnTop,
        belowId: SUB_TODO_ON_TOP,
      });

    const firstCreatedSubTodoId = firstSubTodoRes.body.data.subTodoId;
    const subTodoIdOnTop = subTodoOnTopRes.body.data.subTodoId;

    const res = await request()
      .get(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .query({ todoId })
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.subTodos.positions[todoId]).toEqual(
      expect.arrayContaining([subTodoIdOnTop, firstCreatedSubTodoId]),
    );

    done();
  });
  it('user can successfully create subTodo with belowId', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const firstSubTodo = Generator.SubTodo.getUnique(todoId);
    const firstRes = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(firstSubTodo);

    const secondSubTodo = Generator.SubTodo.getUnique(todoId);
    const secondRes = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(secondSubTodo);

    const firstSubTodoId = firstRes.body.data.subTodoId;
    const secondSubTodoId = secondRes.body.data.subTodoId;

    const thirdSubTodo = Generator.SubTodo.getUnique(todoId);
    const thirdRes = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...thirdSubTodo,
        belowId: firstSubTodoId,
      });
    const thirdSubTodoId = thirdRes.body.data.subTodoId;

    const resSubTodos = await request()
      .get(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(resSubTodos.statusCode).toEqual(200);
    expect(resSubTodos.body.data.subTodos.positions[todoId]).toEqual(
      [firstSubTodoId, thirdSubTodoId, secondSubTodoId],
    );

    done();
  });
  it('user can\'t create subTodo without authorization', async (done) => {
    const user = await helper.createUser(defaultUser);
    const todoId = user.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(todoId);
    const res = await request()
      .post(`${routes.subTodo}/`)
      .send(subTodo);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create subTodo without title', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(todoId);
    delete subTodo.title;
    const res = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodo);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create subTodo without todo id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(todoId);
    delete subTodo.todoId;
    const res = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodo);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create subTodo with empty title', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(todoId);
    const res = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...subTodo,
        title: '',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create subTodo with long title', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(todoId);
    const res = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...subTodo,
        title: Generator.SubTodo.getLongTitle(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create subTodo with negative color', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(todoId);
    const res = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...subTodo,
        color: Generator.SubTodo.getNegativeColor(),
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create subTodo with string color', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(todoId);
    const res = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...subTodo,
        color: Generator.SubTodo.getNegativeColor(),
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create subTodo with color which is not included in the enum', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(todoId);
    const res = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...subTodo,
        color: Generator.SubTodo.getInvalidColor(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create subTodo with negative todo id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(todoId);
    const res = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...subTodo,
        todoId: Generator.SubTodo.getNegativeTodoId(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create subTodo with todo id without having access to it', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const { token } = firstUser;

    const secondUser = await helper.createUser(defaultUser);
    const todoIdWithoutAccess = secondUser.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(todoIdWithoutAccess);
    const res = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodo);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create subTodo with belowId without access', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const firstUserToken = firstUser.getToken();
    const todoIdWithoutAccess = firstUser.getRandomTodoId();

    const secondUser = await helper.createUser(defaultUser);
    const secondUserToken = secondUser.getToken();
    const todoIdWithAccess = secondUser.getRandomTodoId();

    const firstSubTodo = Generator.SubTodo.getUnique(todoIdWithoutAccess);
    const firstRes = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${firstUserToken}`)
      .send(firstSubTodo);

    const secondSubTodo = Generator.SubTodo.getUnique(todoIdWithAccess);
    await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${firstUserToken}`)
      .send(secondSubTodo);

    const firstSubTodoIdWithoutAccess = firstRes.body.data.subTodoId;

    const thirdSubTodo = Generator.SubTodo.getUnique(todoIdWithAccess);
    const thirdRes = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${secondUserToken}`)
      .send({
        ...thirdSubTodo,
        belowId: firstSubTodoIdWithoutAccess,
      });

    expect(thirdRes.statusCode).toEqual(403);
    expect(thirdRes.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));
    done();
  });
});

describe('get subTodo by id', () => {
  it('user can successfully get subTodo by id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(todoId);
    const { body: { data: { subTodoId } } } = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodo);

    const res = await request()
      .get(`${routes.subTodo}/${subTodoId}`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));
    expect(res.body.data).toEqual({
      id: subTodoId,
      ...subTodo,
      expirationDate: expect.any(Number),
      position: expect.any(Number),
    });

    done();
  });
  it('user can\'t get subTodo without authorization header', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(todoId);
    const { body: { data: { subTodoId } } } = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodo);

    const res = await request()
      .get(`${routes.subTodo}/${subTodoId}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t access to the subTodo if he does not have access to it', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const firstUserTodoId = firstUser.getRandomTodoId();

    const secondUser = await helper.createUser(defaultUser);

    const subTodo = Generator.SubTodo.getUnique(firstUserTodoId);
    const { body: { data: { subTodoId } } } = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(subTodo);

    const res = await request()
      .get(`${routes.subTodo}/${subTodoId}`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send();

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t access to the subTodo by string id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(todoId);
    const { body: { data: { subTodoId } } } = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodo);

    const res = await request()
      .get(`${routes.subTodo}/string_${subTodoId}`)
      .send();

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('get all subTodos', () => {
  it('user can successfully gets all subTodos to which he has access', async (done) => {
    const user = await helper.createUser(defaultUser);
    const [firstTodoId, secondTodoId] = user.getTodoIds();
    const token = user.getToken();
    const secondUser = await helper.createUser(defaultUser);
    const secondUserTodoId = secondUser.getRandomTodoId();

    const secondUserTodo = Generator.SubTodo.getUnique(secondUserTodoId);
    await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send(secondUserTodo);

    const subTodoOne = Generator.SubTodo.getUnique(firstTodoId);
    await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodoOne);

    const subTodoTwo = Generator.SubTodo.getUnique(secondTodoId);
    await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodoTwo);

    const res = await request()
      .get(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    const { subTodos } = res.body.data;

    expect(subTodos.entities).toEqual(
      expect.arrayContaining([{
        id: expect.any(Number),
        ...subTodoOne,
        attachmentsCount: 0,
        commentsCount: 0,
        imagesCount: 0,
        expirationDate: expect.any(Number),
      }, {
        id: expect.any(Number),
        ...subTodoTwo,
        attachmentsCount: 0,
        commentsCount: 0,
        imagesCount: 0,
        expirationDate: expect.any(Number),
      }]),
    );

    expect(Object.keys(subTodos.positions[firstTodoId])).toHaveLength(1);
    expect(Object.keys(subTodos.positions[secondTodoId])).toHaveLength(1);

    done();
  });
  it('user can successfully gets all subTodos to which he has access by board id', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const token = firstUser.getToken();
    const [firstBoardId, secondBoardId] = firstUser.getBoardIds();
    const todoIdFromFirstBoard = firstUser.getRandomTodoIdFromBoard(firstBoardId);
    const todoIdFromSecondBoard = firstUser.getRandomTodoIdFromBoard(secondBoardId);

    await helper.createUser(defaultUser);

    const subTodoOne = Generator.SubTodo.getUnique(todoIdFromFirstBoard);
    await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodoOne);

    const subTodoTwo = Generator.SubTodo.getUnique(todoIdFromSecondBoard);
    await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodoTwo);

    const res = await request()
      .get(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .query({ boardId: firstBoardId })
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    const { subTodos } = res.body.data;

    expect(subTodos.entities).toEqual(
      expect.arrayContaining([{
        id: expect.any(Number),
        ...subTodoOne,
        attachmentsCount: 0,
        commentsCount: 0,
        imagesCount: 0,
        expirationDate: expect.any(Number),
      }]),
    );

    expect(Object.keys(subTodos.positions[todoIdFromFirstBoard])).toHaveLength(1);

    done();
  });
  it('user can successfully gets all subTodos to which he has access by column id', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const token = firstUser.getToken();
    const [firstBoardId, secondBoardId] = firstUser.getBoardIds();
    const todoIdFromSecondBoard = firstUser.getRandomTodoIdFromBoard(secondBoardId);
    const columnFromFirstBoard = firstUser.getRandomColumnFromBoard(firstBoardId);
    const columnIdFromFirstBoard = columnFromFirstBoard.id;
    const headingIdFromFirstBoard = columnFromFirstBoard.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingIdFromFirstBoard);
    const response = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    const todoIdFromFirstBoard = response.body.data.todoId;

    await helper.createUser(defaultUser);

    const subTodoOne = Generator.SubTodo.getUnique(todoIdFromFirstBoard);
    await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodoOne);

    const subTodoTwo = Generator.SubTodo.getUnique(todoIdFromSecondBoard);
    await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodoTwo);

    const res = await request()
      .get(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .query({ columnId: columnIdFromFirstBoard })
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    const { subTodos } = res.body.data;

    expect(subTodos.entities).toEqual(
      expect.arrayContaining([{
        id: expect.any(Number),
        ...subTodoOne,
        attachmentsCount: 0,
        commentsCount: 0,
        imagesCount: 0,
        expirationDate: expect.any(Number),
      }]),
    );

    expect(Object.keys(subTodos.positions[todoIdFromFirstBoard])).toHaveLength(1);

    done();
  });
  it('user can\'t get all subTodos if he does not have access to board id', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const token = firstUser.getToken();
    const [firstBoardId, secondBoardId] = firstUser.getBoardIds();
    const todoIdFromFirstBoard = firstUser.getRandomTodoIdFromBoard(firstBoardId);
    const todoIdFromSecondBoard = firstUser.getRandomTodoIdFromBoard(secondBoardId);

    const secondUser = await helper.createUser(defaultUser);
    const boardIdWithoutAccess = secondUser.getRandomBoardId();

    const subTodoOne = Generator.SubTodo.getUnique(todoIdFromFirstBoard);
    await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodoOne);

    const subTodoTwo = Generator.SubTodo.getUnique(todoIdFromSecondBoard);
    await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodoTwo);

    const res = await request()
      .get(`${routes.subTodo}/`)
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
  it('user can\'t get all subTodos if he does not have access to column id', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const token = firstUser.getToken();
    const [firstBoardId, secondBoardId] = firstUser.getBoardIds();
    const todoIdFromFirstBoard = firstUser.getRandomTodoIdFromBoard(firstBoardId);
    const todoIdFromSecondBoard = firstUser.getRandomTodoIdFromBoard(secondBoardId);

    const secondUser = await helper.createUser(defaultUser);
    const columnIdWithoutAccess = secondUser.getRandomColumnId();

    const subTodoOne = Generator.SubTodo.getUnique(todoIdFromFirstBoard);
    await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodoOne);

    const subTodoTwo = Generator.SubTodo.getUnique(todoIdFromSecondBoard);
    await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodoTwo);

    const res = await request()
      .get(`${routes.subTodo}/`)
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
  it('user can\'t get subTodos if he has no subTodos', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const [firstTodoId, secondTodoId] = firstUser.getTodoIds();
    const secondUser = await helper.createUser();

    const subTodoOne = Generator.SubTodo.getUnique(firstTodoId);
    await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(subTodoOne);

    const subTodoTwo = Generator.SubTodo.getUnique(secondTodoId);
    await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(subTodoTwo);

    const res = await request()
      .get(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: {
        subTodos: {
          entities: [],
          positions: {},
        },
      },
    }));
    done();
  });
  it('user can\'t get all subTodos without authorization header', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(todoId);
    await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodo);

    const res = await request()
      .get(`${routes.subTodo}/`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('remove subTodo', () => {
  it('user can successfully remove subTodo by id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(todoId);
    const { body: { data: { subTodoId } } } = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodo);

    const res = await request()
      .delete(`${routes.subTodo}/${subTodoId}`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t remove subTodo without authorization header', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(todoId);
    const { body: { data: { subTodoId } } } = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodo);

    const res = await request()
      .delete(`${routes.subTodo}/${subTodoId}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t remove subTodo if he does not have access to it', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const todoId = firstUser.getRandomTodoId();

    const secondUser = await helper.createUser();

    const subTodo = Generator.SubTodo.getUnique(todoId);
    const { body: { data: { subTodoId } } } = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(subTodo);

    const res = await request()
      .delete(`${routes.subTodo}/${subTodoId}`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send();

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t remove subTodo by string id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(todoId);
    const { body: { data: { subTodoId } } } = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodo);

    const res = await request()
      .delete(`${routes.subTodo}/string_${subTodoId}`)
      .send();

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('update subTodo', () => {
  it('user can successfully update subTodo by id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(todoId);
    const { body: { data: { subTodoId } } } = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodo);

    const newTodo = Generator.SubTodo.getUnique(todoId);
    const resUpdate = await request()
      .patch(`${routes.subTodo}/${subTodoId}`)
      .set('authorization', `Bearer ${token}`)
      .send(newTodo);

    const res = await request()
      .get(`${routes.subTodo}/${subTodoId}`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(resUpdate.statusCode).toEqual(200);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));
    expect(res.body.data).toEqual({
      id: subTodoId,
      ...newTodo,
      expirationDate: expect.any(Number),
      position: expect.any(Number),
    });

    done();
  });
  it('user can\'t update subTodo without authorization header', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(todoId);
    const { body: { data: { subTodoId } } } = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodo);

    const newTodo = Generator.SubTodo.getUnique(todoId);
    const res = await request()
      .patch(`${routes.subTodo}/${subTodoId}`)
      .send(newTodo);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t update subTodo if he does not have access to it', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const todoId = firstUser.getRandomTodoId();

    const secondUser = await helper.createUser(defaultUser);

    const subTodo = Generator.SubTodo.getUnique(todoId);
    const { body: { data: { subTodoId } } } = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(subTodo);

    const newTodo = Generator.SubTodo.getUnique();
    const res = await request()
      .patch(`${routes.subTodo}/${subTodoId}`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send(newTodo);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t update subTodo by string id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(todoId);
    const { body: { data: { subTodoId } } } = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(subTodo);

    const newTodo = Generator.SubTodo.getUnique(todoId);
    const res = await request()
      .patch(`${routes.subTodo}/string_${subTodoId}`)
      .send(newTodo);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t update subTodo if he does not have access to todo id', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const firstUserTodoId = firstUser.getRandomTodoId();

    const secondUser = await helper.createUser(defaultUser);
    const todoIdWithoutAccessForFirstUser = secondUser.getRandomTodoId();

    const subTodo = Generator.SubTodo.getUnique(firstUserTodoId);
    const { body: { data: { subTodoId } } } = await request()
      .post(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(subTodo);

    const newTodo = Generator.SubTodo.getUnique(todoIdWithoutAccessForFirstUser);
    const res = await request()
      .patch(`${routes.subTodo}/${subTodoId}`)
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
    const todoId = user.getRandomTodoId();

    await helper.createSubTodos({
      token,
      todoId,
      subTodos: [{
        title: 'default-sub-todo-1',
      }, {
        title: 'default-sub-todo-2',
      }, {
        title: 'default-sub-todo-3',
      }, {
        title: 'default-sub-todo-4',
      }, {
        title: 'default-sub-todo-5',
      }, {
        title: 'default-sub-todo-6',
      }],
    });

    const resSubTodosBeforeUpdate = await request()
      .get(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    await request()
      .patch(`${routes.subTodo}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        todoId,
        sourcePosition: 1,
        destinationPosition: 4,
      });

    const resSubTodosAfterUpdate = await request()
      .get(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const beforePositions = resSubTodosBeforeUpdate.body.data.subTodos.positions[todoId];
    const afterPositions = resSubTodosAfterUpdate.body.data.subTodos.positions[todoId];

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
  it('user can successfully move subTodo between todos', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const [firstTodoId, secondTodoId] = user.getTodoIds();

    await helper.createSubTodos({
      token,
      todoId: firstTodoId,
      subTodos: [{
        title: 'default-sub-todo-1',
      }, {
        title: 'default-sub-todo-2',
      }, {
        title: 'default-sub-todo-3',
      }, {
        title: 'default-sub-todo-4',
      }, {
        title: 'default-sub-todo-5',
      }, {
        title: 'default-sub-todo-6',
      }],
    });

    await helper.createSubTodos({
      token,
      todoId: secondTodoId,
      subTodos: [{
        title: 'default-sub-todo-1',
      }, {
        title: 'default-sub-todo-2',
      }, {
        title: 'default-sub-todo-3',
      }, {
        title: 'default-sub-todo-4',
      }, {
        title: 'default-sub-todo-5',
      }, {
        title: 'default-sub-todo-6',
      }],
    });

    const resSubTodosBeforeUpdate = await request()
      .get(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    await request()
      .patch(`${routes.subTodo}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        todoId: firstTodoId,
        targetTodoId: secondTodoId,
        sourcePosition: 1,
        destinationPosition: 4,
      });

    const resSubTodosAfterUpdate = await request()
      .get(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const beforePositionsForFirstTodo = resSubTodosBeforeUpdate.body.data.subTodos.positions[firstTodoId];
    const afterPositionsForFirstTodo = resSubTodosAfterUpdate.body.data.subTodos.positions[firstTodoId];

    expect(afterPositionsForFirstTodo).toEqual([
      beforePositionsForFirstTodo[0],
      beforePositionsForFirstTodo[2],
      beforePositionsForFirstTodo[3],
      beforePositionsForFirstTodo[4],
      beforePositionsForFirstTodo[5],
    ]);

    const beforePositionsForSecondTodo = resSubTodosBeforeUpdate.body.data.subTodos.positions[secondTodoId];
    const afterPositionsForSecondTodo = resSubTodosAfterUpdate.body.data.subTodos.positions[secondTodoId];

    expect(afterPositionsForSecondTodo).toEqual([
      beforePositionsForSecondTodo[0],
      beforePositionsForSecondTodo[1],
      beforePositionsForSecondTodo[2],
      beforePositionsForSecondTodo[3],
      beforePositionsForFirstTodo[1],
      beforePositionsForSecondTodo[4],
      beforePositionsForSecondTodo[5],
    ]);

    done();
  });
  it('user can\'t update position with wrong source position', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    await helper.createSubTodos({
      token,
      todoId,
      subTodos: [{
        title: 'default-sub-todo-1',
      }, {
        title: 'default-sub-todo-2',
      }, {
        title: 'default-sub-todo-3',
      }, {
        title: 'default-sub-todo-4',
      }, {
        title: 'default-sub-todo-5',
      }, {
        title: 'default-sub-todo-6',
      }],
    });

    const res = await request()
      .patch(`${routes.subTodo}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        todoId,
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
    const todoId = user.getRandomTodoId();

    await helper.createSubTodos({
      token,
      todoId,
      subTodos: [{
        title: 'default-sub-todo-1',
      }, {
        title: 'default-sub-todo-2',
      }, {
        title: 'default-sub-todo-3',
      }, {
        title: 'default-sub-todo-4',
      }, {
        title: 'default-sub-todo-5',
      }, {
        title: 'default-sub-todo-6',
      }],
    });

    const res = await request()
      .patch(`${routes.column}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        todoId,
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
  it('user can\'t update position with todoId without access', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const secondUser = await helper.createUser(defaultUser);
    const todoIdWithoutAccess = secondUser.getRandomTodoId();

    await helper.createSubTodos({
      token,
      todoId,
      subTodos: [{
        title: 'default-sub-todo-1',
      }, {
        title: 'default-sub-todo-2',
      }, {
        title: 'default-sub-todo-3',
      }, {
        title: 'default-sub-todo-4',
      }, {
        title: 'default-sub-todo-5',
      }, {
        title: 'default-sub-todo-6',
      }],
    });

    const res = await request()
      .patch(`${routes.subTodo}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        todoId: todoIdWithoutAccess,
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
  it('user can\'t move subTodo between todos wrong source position', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const [firstTodoId, secondTodoId] = user.getTodoIds();

    await helper.createSubTodos({
      token,
      todoId: firstTodoId,
      subTodos: [{
        title: 'default-sub-todo-1',
      }, {
        title: 'default-sub-todo-2',
      }, {
        title: 'default-sub-todo-3',
      }, {
        title: 'default-sub-todo-4',
      }, {
        title: 'default-sub-todo-5',
      }, {
        title: 'default-sub-todo-6',
      }],
    });

    await helper.createSubTodos({
      token,
      todoId: secondTodoId,
      subTodos: [{
        title: 'default-sub-todo-1',
      }, {
        title: 'default-sub-todo-2',
      }, {
        title: 'default-sub-todo-3',
      }, {
        title: 'default-sub-todo-4',
      }, {
        title: 'default-sub-todo-5',
      }, {
        title: 'default-sub-todo-6',
      }],
    });

    const res = await request()
      .patch(`${routes.subTodo}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        todoId: firstTodoId,
        targetTodoId: secondTodoId,
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
  it('user can\'t move subTodo between todos wrong destination position', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const [firstTodoId, secondTodoId] = user.getTodoIds();

    await helper.createSubTodos({
      token,
      todoId: firstTodoId,
      subTodos: [{
        title: 'default-sub-todo-1',
      }, {
        title: 'default-sub-todo-2',
      }, {
        title: 'default-sub-todo-3',
      }, {
        title: 'default-sub-todo-4',
      }, {
        title: 'default-sub-todo-5',
      }, {
        title: 'default-sub-todo-6',
      }],
    });

    await helper.createSubTodos({
      token,
      todoId: secondTodoId,
      subTodos: [{
        title: 'default-sub-todo-1',
      }, {
        title: 'default-sub-todo-2',
      }, {
        title: 'default-sub-todo-3',
      }, {
        title: 'default-sub-todo-4',
      }, {
        title: 'default-sub-todo-5',
      }, {
        title: 'default-sub-todo-6',
      }],
    });

    const res = await request()
      .patch(`${routes.subTodo}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        todoId: firstTodoId,
        targetTodoId: secondTodoId,
        sourcePosition: 1,
        destinationPosition: 7, // add entity to new todo, can be +1
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t move subTodo between todos with targetTodoId without access', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const secondUser = await helper.createUser(defaultUser);
    const secondUserToken = secondUser.getToken();
    const todoIdWithoutAccess = secondUser.getRandomTodoId();

    await helper.createSubTodos({
      token,
      todoId,
      subTodos: [{
        title: 'default-sub-todo-1',
      }, {
        title: 'default-sub-todo-2',
      }, {
        title: 'default-sub-todo-3',
      }, {
        title: 'default-sub-todo-4',
      }, {
        title: 'default-sub-todo-5',
      }, {
        title: 'default-sub-todo-6',
      }],
    });

    await helper.createSubTodos({
      token: secondUserToken,
      todoId: todoIdWithoutAccess,
      subTodos: [{
        title: 'default-sub-todo-1',
      }, {
        title: 'default-sub-todo-2',
      }, {
        title: 'default-sub-todo-3',
      }, {
        title: 'default-sub-todo-4',
      }, {
        title: 'default-sub-todo-5',
      }, {
        title: 'default-sub-todo-6',
      }],
    });

    const res = await request()
      .patch(`${routes.subTodo}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        todoId,
        targetTodoId: todoIdWithoutAccess,
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

describe('duplicate', () => {
  it('user can successfully duplicate subTodo', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    await helper.createSubTodos({
      token,
      todoId,
      subTodos: [{
        title: 'default-subTodo-1',
        subSubTodos: [{ title: 'default-sub-subTodo-1' }],
      }, {
        title: 'default-subTodo-2',
        subSubTodos: [{ title: 'default-sub-subTodo-2' }],
      }],
    });

    const resSubTodos = await request()
      .get(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const beforeSubTodos = resSubTodos.body.data.subTodos;

    const subTodoIds = beforeSubTodos.positions[todoId];
    const subTodoId = subTodoIds[0];
    const firstSubTodo = beforeSubTodos.entities.find((subTodo) => subTodo.id === subTodoIds[0]);
    const secondSubTodo = beforeSubTodos.entities.find((subTodo) => subTodo.id === subTodoIds[1]);

    const resDuplicate = await request()
      .post(`${routes.subTodo}/duplicate`)
      .set('authorization', `Bearer ${token}`)
      .send({
        subTodoId,
      });

    const resSubTodoAfterDuplicate = await request()
      .get(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const afterSubTodos = resSubTodoAfterDuplicate.body.data.subTodos;
    const duplicatedSubTodoId = resDuplicate.body.data.subTodoId;

    expect(afterSubTodos.positions[todoId]).toEqual([
      subTodoIds[0],
      duplicatedSubTodoId,
      subTodoIds[1],
    ]);

    expect(afterSubTodos.entities).toEqual(expect.arrayContaining([
      firstSubTodo,
      secondSubTodo, {
        ...firstSubTodo,
        id: duplicatedSubTodoId,
      },
    ]));

    done();
  });
  it('user can\'t duplicate subTodo without access to subTodo', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const todoId = user.getRandomTodoId();

    const secondUser = await helper.createUser(defaultUser);
    const secondUserToken = secondUser.getToken();
    const todoIdWithoutAccess = secondUser.getRandomTodoId();

    await helper.createSubTodos({
      token,
      todoId,
      subTodos: [{
        title: 'default-subTodo-1',
        subSubTodos: [{ title: 'default-sub-subTodo-1' }],
      }, {
        title: 'default-subTodo-2',
        subSubTodos: [{ title: 'default-sub-subTodo-2' }],
      }],
    });

    await helper.createSubTodos({
      token: secondUserToken,
      todoId: todoIdWithoutAccess,
      subTodos: [{
        title: 'default-subTodo-1',
        subSubTodos: [{ title: 'default-sub-subTodo-1' }],
      }, {
        title: 'default-subTodo-2',
        subSubTodos: [{ title: 'default-sub-subTodo-2' }],
      }],
    });

    const resSubTodosWithoutAccess = await request()
      .get(`${routes.subTodo}/`)
      .set('authorization', `Bearer ${secondUserToken}`)
      .send();

    const subTodoIdWithoutAccess = resSubTodosWithoutAccess.body.data.subTodos.positions[todoIdWithoutAccess][0];

    const res = await request()
      .post(`${routes.subTodo}/duplicate`)
      .set('authorization', `Bearer ${token}`)
      .send({
        subTodoId: subTodoIdWithoutAccess,
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});
