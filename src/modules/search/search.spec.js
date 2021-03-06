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
    }, {
      title: 'default-column-2',
    }],
  }, {
    title: 'default-board-2',
    columns: [{
      title: 'default-column-3',
    }, {
      title: 'default-column-4',
    }, {
      title: 'default-column-5',
    }],
  }, {
    title: 'default-board-3',
    columns: [{
      title: 'default-column-6',
    }],
  }, {
    title: 'default-board-4',
    columns: [{
      title: 'default-column-7',
    }],
  }],
};

describe('todo title', () => {
  it('user can successfully search by todo title', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const todo = Generator.Todo.getUnique(columnId);
    const { body: { data: { todoId } } } = await request()
      .post(`${routes.todo}/`)
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    const searchRes = await request()
      .get(`${routes.search}/todo`)
      .query({ query: todo.title })
      .set('authorization', `Bearer ${token}`)
      .send(todo);

    expect(searchRes.statusCode).toEqual(200);
    expect(searchRes.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        todos: {
          entities: [{
            id: todoId,
            ...todo,
            expirationDate: expect.any(Number),
            commentsCount: 0,
            imagesCount: 0,
            attachmentsCount: 0,
          }],
          positions: {
            [columnId]: [todoId],
          },
        },
        columns: {
          entities: expect.any(Array),
          positions: expect.any(Object),
        },
        boards: {
          entities: expect.any(Array),
          positions: expect.any(Array),
        },
      }),
    }));

    done();
  });
});
