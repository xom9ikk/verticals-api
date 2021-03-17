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

describe('create', () => {
  it('user can successfully create heading with all fields', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnId);
    const res = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(heading);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        headingId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create heading without description', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnId);
    delete heading.description;
    const res = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(heading);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        headingId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create heading without status', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnId);
    delete heading.status;
    const res = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(heading);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        headingId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create heading without color', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnId);
    delete heading.color;
    const res = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(heading);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        headingId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create heading without is notifications enabled', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnId);
    delete heading.isNotificationsEnabled;
    const res = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(heading);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        headingId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create heading without all non-required fields', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnId);
    delete heading.description;
    delete heading.status;
    delete heading.color;
    const res = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(heading);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        headingId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can\'t create heading without authorization', async (done) => {
    const user = await helper.createUser(defaultUser);
    const columnId = user.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnId);
    const res = await request()
      .post(`${routes.heading}/`)
      .send(heading);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create heading without title', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnId);
    delete heading.title;
    const res = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(heading);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create heading without column id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnId);
    delete heading.columnId;
    const res = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(heading);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create heading with empty title', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnId);
    const res = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...heading,
        title: '',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create heading with long title', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnId);
    const res = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...heading,
        title: Generator.Heading.getLongTitle(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create heading with negative color', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnId);
    const res = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...heading,
        color: Generator.Heading.getNegativeColor(),
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create heading with string color', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnId);
    const res = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...heading,
        color: Generator.Heading.getNegativeColor(),
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create heading with color which is not included in the enum', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnId);
    const res = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...heading,
        color: Generator.Heading.getInvalidColor(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create heading with negative column id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnId);
    const res = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...heading,
        columnId: Generator.Heading.getNegativeColumnId(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create heading with column id without having access to it', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const { token } = firstUser;

    const secondUser = await helper.createUser(defaultUser);
    const columnIdWithoutAccess = secondUser.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnIdWithoutAccess);
    const res = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(heading);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('get heading by id', () => {
  it('user can successfully get heading by id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnId);
    const { body: { data: { headingId } } } = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(heading);

    const res = await request()
      .get(`${routes.heading}/${headingId}`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));
    expect(res.body.data).toEqual({
      id: headingId,
      ...heading,
      type: HeadingType.custom,
      position: expect.any(Number),
    });

    done();
  });
  it('user can\'t get heading without authorization header', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnId);
    const { body: { data: { headingId } } } = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(heading);

    const res = await request()
      .get(`${routes.heading}/${headingId}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t access to the heading if he does not have access to it', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const firstUserColumnId = firstUser.getRandomColumnId();

    const secondUser = await helper.createUser(defaultUser);

    const heading = Generator.Heading.getUnique(firstUserColumnId);
    const { body: { data: { headingId } } } = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(heading);

    const res = await request()
      .get(`${routes.heading}/${headingId}`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send();

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t access to the heading by string id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnId);
    const { body: { data: { headingId } } } = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(heading);

    const res = await request()
      .get(`${routes.heading}/string_${headingId}`)
      .send();

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('get all headings', () => {
  it('user can successfully gets all headings to which he has access', async (done) => {
    const user = await helper.createUser(defaultUser);
    const [firstColumnId, secondColumnId] = user.getColumnIds();
    const token = user.getToken();
    const secondUser = await helper.createUser(defaultUser);
    const secondUserColumnId = secondUser.getRandomColumnId();

    const secondUserHeading = Generator.Heading.getUnique(secondUserColumnId);
    await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send(secondUserHeading);

    const headingOne = Generator.Heading.getUnique(firstColumnId);
    await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(headingOne);

    const headingTwo = Generator.Heading.getUnique(secondColumnId);
    await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(headingTwo);

    const res = await request()
      .get(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    const { headings } = res.body.data;

    expect(headings.entities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: HeadingType.default,
        }),
        expect.objectContaining({
          type: HeadingType.archived,
        }), {
          id: expect.any(Number),
          ...headingOne,
          type: HeadingType.custom,
        }, {
          id: expect.any(Number),
          ...headingTwo,
          type: HeadingType.custom,
        },
      ]),
    );

    expect(Object.keys(headings.positions)).toHaveLength(7); // 7 columns create for default user
    expect(Object.keys(headings.positions[firstColumnId])).toHaveLength(2); // 1 default and 1 custom
    expect(Object.keys(headings.positions[secondColumnId])).toHaveLength(2); // 1 default and 1 custom

    done();
  });
  it('user can successfully gets all headings to which he has access by board id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const [firstBoardId, secondBoardId] = user.getBoardIds();
    const columnIdFromFirstBoard = user.getRandomColumnIdFromBoard(firstBoardId);
    const columnIdFromSecondBoard = user.getRandomColumnIdFromBoard(secondBoardId);

    await helper.createUser(defaultUser);

    const headingOne = Generator.Heading.getUnique(columnIdFromFirstBoard);
    await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(headingOne);

    const headingTwo = Generator.Heading.getUnique(columnIdFromSecondBoard);
    await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(headingTwo);

    const res = await request()
      .get(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .query({ boardId: firstBoardId })
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    const { headings } = res.body.data;

    expect(headings.entities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: HeadingType.default,
        }),
        expect.objectContaining({
          type: HeadingType.archived,
        }), {
          id: expect.any(Number),
          ...headingOne,
          type: HeadingType.custom,
        },
      ]),
    );

    expect(Object.keys(headings.positions)).toHaveLength(2); // 2 columns create for default user in board
    expect(Object.keys(headings.positions[columnIdFromFirstBoard])).toHaveLength(2); // 1 default and 1 custom in column

    done();
  });
  it('user can successfully gets all headings to which he has access by column id', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const token = firstUser.getToken();
    const [firstBoardId, secondBoardId] = firstUser.getBoardIds();
    const columnIdFromFirstBoard = firstUser.getRandomColumnIdFromBoard(firstBoardId);
    const columnIdFromSecondBoard = firstUser.getRandomColumnIdFromBoard(secondBoardId);

    await helper.createUser(defaultUser);

    const headingOne = Generator.Heading.getUnique(columnIdFromFirstBoard);
    await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(headingOne);

    const headingTwo = Generator.Heading.getUnique(columnIdFromSecondBoard);
    await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(headingTwo);

    const res = await request()
      .get(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .query({ columnId: columnIdFromFirstBoard })
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    const { headings } = res.body.data;
    const [{ id: headingIdDefault }, _, { id: headingIdCustom }] = headings.entities;

    expect(headings.entities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: HeadingType.default,
        }),
        expect.objectContaining({
          type: HeadingType.archived,
        }), {
          id: expect.any(Number),
          ...headingOne,
          type: HeadingType.custom,
        },
      ]),
    );
    expect(headings.positions[columnIdFromFirstBoard])
      .toEqual(expect.arrayContaining([headingIdDefault, headingIdCustom]));

    done();
  });
  it('user can\'t get all headings if he does not have access to board id', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const token = firstUser.getToken();
    const [firstBoardId, secondBoardId] = firstUser.getBoardIds();
    const columnIdFromFirstBoard = firstUser.getRandomColumnIdFromBoard(firstBoardId);
    const columnIdFromSecondBoard = firstUser.getRandomColumnIdFromBoard(secondBoardId);

    const secondUser = await helper.createUser(defaultUser);
    const boardIdWithoutAccess = secondUser.getRandomBoardId();

    const headingOne = Generator.Heading.getUnique(columnIdFromFirstBoard);
    await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(headingOne);

    const headingTwo = Generator.Heading.getUnique(columnIdFromSecondBoard);
    await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(headingTwo);

    const res = await request()
      .get(`${routes.heading}/`)
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
  it('user can\'t get all headings if he does not have access to column id', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const token = firstUser.getToken();
    const [firstBoardId, secondBoardId] = firstUser.getBoardIds();
    const columnIdFromFirstBoard = firstUser.getRandomColumnIdFromBoard(firstBoardId);
    const columnIdFromSecondBoard = firstUser.getRandomColumnIdFromBoard(secondBoardId);

    const secondUser = await helper.createUser(defaultUser);
    const columnIdWithoutAccess = secondUser.getRandomColumnId();

    const headingOne = Generator.Heading.getUnique(columnIdFromFirstBoard);
    await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(headingOne);

    const headingTwo = Generator.Heading.getUnique(columnIdFromSecondBoard);
    await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(headingTwo);

    const res = await request()
      .get(`${routes.heading}/`)
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
  it('user can\'t get headings if he has no headings', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const [firstColumnId, secondColumnId] = firstUser.getColumnIds();
    const secondUser = await helper.createUser();

    const headingOne = Generator.Heading.getUnique(firstColumnId);
    await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(headingOne);

    const headingTwo = Generator.Heading.getUnique(secondColumnId);
    await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(headingTwo);

    const res = await request()
      .get(`${routes.heading}/`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: {
        headings: {
          entities: [],
          positions: {},
        },
      },
    }));
    done();
  });
  it('user can\'t get all headings without authorization header', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnId);
    await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(heading);

    const res = await request()
      .get(`${routes.heading}/`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('remove heading', () => {
  it('user can successfully remove heading by id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnId);
    const { body: { data: { headingId } } } = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(heading);

    const res = await request()
      .delete(`${routes.heading}/${headingId}`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t remove heading without authorization header', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnId);
    const { body: { data: { headingId } } } = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(heading);

    const res = await request()
      .delete(`${routes.heading}/${headingId}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t remove heading if he does not have access to it', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const columnId = firstUser.getRandomColumnId();

    const secondUser = await helper.createUser();

    const heading = Generator.Heading.getUnique(columnId);
    const { body: { data: { headingId } } } = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(heading);

    const res = await request()
      .delete(`${routes.heading}/${headingId}`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send();

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t remove heading by string id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnId);
    const { body: { data: { headingId } } } = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(heading);

    const res = await request()
      .delete(`${routes.heading}/string_${headingId}`)
      .send();

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('update heading', () => {
  it('user can successfully update heading by id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnId);
    const { body: { data: { headingId } } } = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(heading);

    const newHeading = Generator.Heading.getUnique(columnId);
    const resUpdate = await request()
      .patch(`${routes.heading}/${headingId}`)
      .set('authorization', `Bearer ${token}`)
      .send(newHeading);

    const res = await request()
      .get(`${routes.heading}/${headingId}`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(resUpdate.statusCode).toEqual(200);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));
    expect(res.body.data).toEqual({
      id: headingId,
      ...newHeading,
      type: HeadingType.custom,
      position: expect.any(Number),
    });

    done();
  });
  it('user can\'t update heading without authorization header', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnId);
    const { body: { data: { headingId } } } = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(heading);

    const newHeading = Generator.Heading.getUnique(columnId);
    const res = await request()
      .patch(`${routes.heading}/${headingId}`)
      .send(newHeading);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t update heading if he does not have access to it', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const columnId = firstUser.getRandomColumnId();

    const secondUser = await helper.createUser(defaultUser);

    const heading = Generator.Heading.getUnique(columnId);
    const { body: { data: { headingId } } } = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(heading);

    const newHeading = Generator.Heading.getUnique();
    const res = await request()
      .patch(`${routes.heading}/${headingId}`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send(newHeading);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t update heading by string id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnId);
    const { body: { data: { headingId } } } = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(heading);

    const newHeading = Generator.Heading.getUnique(columnId);
    const res = await request()
      .patch(`${routes.heading}/string_${headingId}`)
      .send(newHeading);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t update heading if he does not have access to column id', async (done) => {
    const firstUser = await helper.createUser(defaultUser);

    const secondUser = await helper.createUser(defaultUser);
    const columnIdWithoutAccessForFirstUser = secondUser.getRandomColumnId();

    const heading = Generator.Heading.getUnique(columnIdWithoutAccessForFirstUser);
    const { body: { data: { headingId } } } = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send(heading);

    const newHeading = Generator.Heading.getUnique(columnIdWithoutAccessForFirstUser);
    const res = await request()
      .patch(`${routes.heading}/${headingId}`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(newHeading);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});
