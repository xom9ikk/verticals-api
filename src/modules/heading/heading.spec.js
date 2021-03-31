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

const defaultUser = Helper.configureUser({
  boards: 4,
  columns: 2,
});

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
  it('user can successfully create heading with belowId', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const firstHeading = Generator.Heading.getUnique(columnId);
    const firstRes = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(firstHeading);

    const secondHeading = Generator.Heading.getUnique(columnId);
    const secondRes = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send(secondHeading);

    const firstHeadingId = firstRes.body.data.headingId;
    const secondHeadingId = secondRes.body.data.headingId;

    const thirdHeading = Generator.Heading.getUnique(columnId);
    const thirdRes = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...thirdHeading,
        belowId: firstHeadingId,
      });
    const thirdHeadingId = thirdRes.body.data.headingId;

    const resHeadings = await request()
      .get(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(resHeadings.statusCode).toEqual(200);
    expect(resHeadings.body.data.headings.positions[columnId]).toEqual(
      [expect.any(Number), firstHeadingId, thirdHeadingId, secondHeadingId],
    );

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
  it('user can\'t create heading with belowId without access', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const firstUserToken = firstUser.getToken();
    const columnIdWithoutAccess = firstUser.getRandomColumnId();

    const secondUser = await helper.createUser(defaultUser);
    const secondUserToken = secondUser.getToken();
    const columnIdWithAccess = secondUser.getRandomColumnId();

    const firstHeading = Generator.Heading.getUnique(columnIdWithoutAccess);
    const firstRes = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${firstUserToken}`)
      .send(firstHeading);

    const secondHeading = Generator.Heading.getUnique(columnIdWithAccess);
    await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${firstUserToken}`)
      .send(secondHeading);

    const firstHeadingIdWithoutAccess = firstRes.body.data.headingId;

    const thirdHeading = Generator.Heading.getUnique(columnIdWithAccess);
    const thirdRes = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${secondUserToken}`)
      .send({
        ...thirdHeading,
        belowId: firstHeadingIdWithoutAccess,
      });

    expect(thirdRes.statusCode).toEqual(403);
    expect(thirdRes.body).toEqual(expect.objectContaining({
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

    expect(Object.keys(headings.positions)).toHaveLength(8); // 8 columns create for default user
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
    // eslint-disable-next-line no-unused-vars
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
    const firstUserColumnId = firstUser.getRandomColumnId();

    const secondUser = await helper.createUser(defaultUser);
    const columnIdWithoutAccessForFirstUser = secondUser.getRandomColumnId();

    const heading = Generator.Heading.getUnique(firstUserColumnId);
    const { body: { data: { headingId } } } = await request()
      .post(`${routes.heading}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
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

describe('update position', () => {
  it('user can successfully update position', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    await helper.createHeadings({
      token,
      columnId,
      headings: [{
        title: 'default-heading-1',
      }, {
        title: 'default-heading-2',
      }, {
        title: 'default-heading-3',
      }, {
        title: 'default-heading-4',
      }, {
        title: 'default-heading-5',
      }, {
        title: 'default-heading-6',
      }],
    });

    const resHeadingsBeforeUpdate = await request()
      .get(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    await request()
      .patch(`${routes.heading}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        columnId,
        sourcePosition: 1,
        destinationPosition: 4,
      });

    const resHeadingsAfterUpdate = await request()
      .get(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const beforePositions = resHeadingsBeforeUpdate.body.data.headings.positions[columnId];
    const afterPositions = resHeadingsAfterUpdate.body.data.headings.positions[columnId];

    expect(afterPositions).toEqual([
      beforePositions[0],
      beforePositions[2],
      beforePositions[3],
      beforePositions[4],
      beforePositions[1],
      beforePositions[5],
      beforePositions[6],
    ]);

    done();
  });
  it('user can successfully move heading between columns', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const [firstColumnId, secondColumnId] = user.getColumnIds();

    await helper.createHeadings({
      token,
      columnId: firstColumnId,
      headings: [{
        title: 'default-heading-1',
      }, {
        title: 'default-heading-2',
      }, {
        title: 'default-heading-3',
      }, {
        title: 'default-heading-4',
      }, {
        title: 'default-heading-5',
      }, {
        title: 'default-heading-6',
      }],
    });

    await helper.createHeadings({
      token,
      columnId: secondColumnId,
      headings: [{
        title: 'default-heading-1',
      }, {
        title: 'default-heading-2',
      }, {
        title: 'default-heading-3',
      }, {
        title: 'default-heading-4',
      }, {
        title: 'default-heading-5',
      }, {
        title: 'default-heading-6',
      }],
    });

    const resHeadingsBeforeUpdate = await request()
      .get(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    await request()
      .patch(`${routes.heading}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        columnId: firstColumnId,
        targetColumnId: secondColumnId,
        sourcePosition: 1,
        destinationPosition: 4,
      });

    const resHeadingsAfterUpdate = await request()
      .get(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const beforePositionsForFirstColumn = resHeadingsBeforeUpdate.body.data.headings.positions[firstColumnId];
    const afterPositionsForFirstColumn = resHeadingsAfterUpdate.body.data.headings.positions[firstColumnId];

    expect(afterPositionsForFirstColumn).toEqual([
      beforePositionsForFirstColumn[0],
      beforePositionsForFirstColumn[2],
      beforePositionsForFirstColumn[3],
      beforePositionsForFirstColumn[4],
      beforePositionsForFirstColumn[5],
      beforePositionsForFirstColumn[6],
    ]);

    const beforePositionsForSecondColumn = resHeadingsBeforeUpdate.body.data.headings.positions[secondColumnId];
    const afterPositionsForSecondColumn = resHeadingsAfterUpdate.body.data.headings.positions[secondColumnId];

    expect(afterPositionsForSecondColumn).toEqual([
      beforePositionsForSecondColumn[0],
      beforePositionsForSecondColumn[1],
      beforePositionsForSecondColumn[2],
      beforePositionsForSecondColumn[3],
      beforePositionsForFirstColumn[1],
      beforePositionsForSecondColumn[4],
      beforePositionsForSecondColumn[5],
      beforePositionsForSecondColumn[6],
    ]);

    done();
  });
  it('user can\'t update position with wrong source position', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    await helper.createHeadings({
      token,
      columnId,
      headings: [{
        title: 'default-heading-1',
      }, {
        title: 'default-heading-2',
      }, {
        title: 'default-heading-3',
      }, {
        title: 'default-heading-4',
      }, {
        title: 'default-heading-5',
      }, {
        title: 'default-heading-6',
      }],
    });

    const res = await request()
      .patch(`${routes.heading}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        columnId,
        sourcePosition: 7,
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
    const columnId = user.getRandomColumnId();

    await helper.createHeadings({
      token,
      columnId,
      headings: [{
        title: 'default-heading-1',
      }, {
        title: 'default-heading-2',
      }, {
        title: 'default-heading-3',
      }, {
        title: 'default-heading-4',
      }, {
        title: 'default-heading-5',
      }, {
        title: 'default-heading-6',
      }],
    });

    const res = await request()
      .patch(`${routes.column}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        columnId,
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
  it('user can\'t update position with columnId without access', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const secondUser = await helper.createUser(defaultUser);
    const columnIdWithoutAccess = secondUser.getRandomColumnId();

    await helper.createHeadings({
      token,
      columnId,
      headings: [{
        title: 'default-heading-1',
      }, {
        title: 'default-heading-2',
      }, {
        title: 'default-heading-3',
      }, {
        title: 'default-heading-4',
      }, {
        title: 'default-heading-5',
      }, {
        title: 'default-heading-6',
      }],
    });

    const res = await request()
      .patch(`${routes.heading}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        columnId: columnIdWithoutAccess,
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
  it('user can\'t move heading between columns wrong source position', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const [firstColumnId, secondColumnId] = user.getColumnIds();

    await helper.createHeadings({
      token,
      columnId: firstColumnId,
      headings: [{
        title: 'default-heading-1',
      }, {
        title: 'default-heading-2',
      }, {
        title: 'default-heading-3',
      }, {
        title: 'default-heading-4',
      }, {
        title: 'default-heading-5',
      }, {
        title: 'default-heading-6',
      }],
    });

    await helper.createHeadings({
      token,
      columnId: secondColumnId,
      headings: [{
        title: 'default-heading-1',
      }, {
        title: 'default-heading-2',
      }, {
        title: 'default-heading-3',
      }, {
        title: 'default-heading-4',
      }, {
        title: 'default-heading-5',
      }, {
        title: 'default-heading-6',
      }],
    });

    const res = await request()
      .patch(`${routes.heading}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        columnId: firstColumnId,
        targetColumnId: secondColumnId,
        sourcePosition: 7,
        destinationPosition: 4,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t move heading between columns wrong destination position', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const [firstColumnId, secondColumnId] = user.getColumnIds();

    await helper.createHeadings({
      token,
      columnId: firstColumnId,
      headings: [{
        title: 'default-heading-1',
      }, {
        title: 'default-heading-2',
      }, {
        title: 'default-heading-3',
      }, {
        title: 'default-heading-4',
      }, {
        title: 'default-heading-5',
      }, {
        title: 'default-heading-6',
      }],
    });

    await helper.createHeadings({
      token,
      columnId: secondColumnId,
      headings: [{
        title: 'default-heading-1',
      }, {
        title: 'default-heading-2',
      }, {
        title: 'default-heading-3',
      }, {
        title: 'default-heading-4',
      }, {
        title: 'default-heading-5',
      }, {
        title: 'default-heading-6',
      }],
    });

    const res = await request()
      .patch(`${routes.heading}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        columnId: firstColumnId,
        targetColumnId: secondColumnId,
        sourcePosition: 1,
        destinationPosition: 8, // add entity to new column, can be +2 archived, default
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t move heading between columns with targetColumnId without access', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const secondUser = await helper.createUser(defaultUser);
    const secondUserToken = secondUser.getToken();
    const columnIdWithoutAccess = secondUser.getRandomColumnId();

    await helper.createHeadings({
      token,
      columnId,
      headings: [{
        title: 'default-heading-1',
      }, {
        title: 'default-heading-2',
      }, {
        title: 'default-heading-3',
      }, {
        title: 'default-heading-4',
      }, {
        title: 'default-heading-5',
      }, {
        title: 'default-heading-6',
      }],
    });

    await helper.createHeadings({
      token: secondUserToken,
      columnId: columnIdWithoutAccess,
      headings: [{
        title: 'default-heading-1',
      }, {
        title: 'default-heading-2',
      }, {
        title: 'default-heading-3',
      }, {
        title: 'default-heading-4',
      }, {
        title: 'default-heading-5',
      }, {
        title: 'default-heading-6',
      }],
    });

    const res = await request()
      .patch(`${routes.heading}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        columnId,
        targetColumnId: columnIdWithoutAccess,
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
  it('user can successfully duplicate heading', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    await helper.createHeadings({
      token,
      columnId,
      headings: [{
        title: 'default-heading-1',
        todos: [{ title: 'default-todo-1' }],
      }, {
        title: 'default-heading-2',
        todos: [{ title: 'default-todo-2' }],
      }],
    });

    const resHeadings = await request()
      .get(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const beforeHeadings = resHeadings.body.data.headings;

    const headingIds = beforeHeadings.positions[columnId];
    const headingId = headingIds[1];
    const firstHeading = beforeHeadings.entities.find((heading) => heading.id === headingIds[0]);
    const secondHeading = beforeHeadings.entities.find((heading) => heading.id === headingIds[1]);

    const resDuplicate = await request()
      .post(`${routes.heading}/duplicate`)
      .set('authorization', `Bearer ${token}`)
      .send({
        headingId,
      });

    const resHeadingAfterDuplicate = await request()
      .get(`${routes.heading}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const afterHeadings = resHeadingAfterDuplicate.body.data.headings;
    const duplicatedHeadingId = resDuplicate.body.data.headingId;

    expect(afterHeadings.positions[columnId]).toEqual([
      headingIds[0],
      headingIds[1],
      duplicatedHeadingId,
      headingIds[2],
    ]);

    expect(afterHeadings.entities).toEqual(expect.arrayContaining([
      firstHeading,
      secondHeading, {
        ...secondHeading,
        id: duplicatedHeadingId,
      },
    ]));

    done();
  });
  it('user can\'t duplicate heading without access to heading', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const columnId = user.getRandomColumnId();

    const secondUser = await helper.createUser(defaultUser);
    const secondUserToken = secondUser.getToken();
    const columnIdWithoutAccess = secondUser.getRandomColumnId();

    await helper.createHeadings({
      token,
      columnId,
      headings: [{
        title: 'default-heading-1',
        subHeadings: [{ title: 'default-sub-heading-1' }],
      }, {
        title: 'default-heading-2',
        subHeadings: [{ title: 'default-sub-heading-2' }],
      }],
    });

    await helper.createHeadings({
      token: secondUserToken,
      columnId: columnIdWithoutAccess,
      headings: [{
        title: 'default-heading-1',
        subHeadings: [{ title: 'default-sub-heading-1' }],
      }, {
        title: 'default-heading-2',
        subHeadings: [{ title: 'default-sub-heading-2' }],
      }],
    });

    const resHeadingsWithoutAccess = await request()
      .get(`${routes.heading}/`)
      .set('authorization', `Bearer ${secondUserToken}`)
      .send();

    const headingIdWithoutAccess = resHeadingsWithoutAccess.body.data.headings.positions[columnIdWithoutAccess][0];

    const res = await request()
      .post(`${routes.heading}/duplicate`)
      .set('authorization', `Bearer ${token}`)
      .send({
        headingId: headingIdWithoutAccess,
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});
