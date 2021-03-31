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
});

describe('todo title', () => {
  it('user can successfully search by todo title', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const headingId = user.getRandomHeadingId();

    const todo = Generator.Todo.getUnique(headingId);
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
            [headingId]: [todoId],
          },
        },
        headings: {
          entities: expect.any(Array),
          positions: expect.any(Object),
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
