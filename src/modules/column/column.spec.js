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
});

describe('create', () => {
  it('user can successfully create column with all fields', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const column = Generator.Column.getUnique(boardId);
    const res = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send(column);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        columnId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create column without description', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const column = Generator.Column.getUnique(boardId);
    delete column.description;
    const res = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send(column);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        columnId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create column without color', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const column = Generator.Column.getUnique(boardId);
    delete column.color;
    const res = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send(column);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        columnId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create column without is collapsed', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const column = Generator.Column.getUnique(boardId);
    delete column.isCollapsed;
    const res = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send(column);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        columnId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create column without all non-required fields', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const column = Generator.Column.getUnique(boardId);
    delete column.description;
    delete column.color;
    delete column.isCollapsed;
    const res = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send(column);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        columnId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create column with belowId', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const firstColumn = Generator.Column.getUnique(boardId);
    const firstRes = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send(firstColumn);

    const secondColumn = Generator.Column.getUnique(boardId);
    const secondRes = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send(secondColumn);

    const firstColumnId = firstRes.body.data.columnId;
    const secondColumnId = secondRes.body.data.columnId;

    const thirdColumn = Generator.Column.getUnique(boardId);
    const thirdRes = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...thirdColumn,
        belowId: firstColumnId,
      });
    const thirdColumnId = thirdRes.body.data.columnId;

    const resColumns = await request()
      .get(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(resColumns.statusCode).toEqual(200);
    expect(resColumns.body.data.columns.positions[boardId]).toEqual(
      [firstColumnId, thirdColumnId, secondColumnId],
    );

    done();
  });
  it('user can\'t create column without authorization', async (done) => {
    const user = await helper.createUser(defaultUser);
    const boardId = user.getRandomBoardId();

    const column = Generator.Column.getUnique(boardId);
    const res = await request()
      .post(`${routes.column}/`)
      .send(column);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create column without board id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const column = Generator.Column.getUnique(boardId);
    delete column.boardId;
    const res = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send(column);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create column without title', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const column = Generator.Column.getUnique(boardId);
    delete column.title;
    const res = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send(column);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create column with empty title', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const column = Generator.Column.getUnique(boardId);
    const res = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...column,
        title: '',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create column with long title', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const column = Generator.Column.getUnique(boardId);
    const res = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...column,
        title: Generator.Column.getLongTitle(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create column with negative color', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const column = Generator.Column.getUnique(boardId);
    const res = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...column,
        color: Generator.Column.getNegativeColor(),
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create column with string color', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const column = Generator.Column.getUnique(boardId);
    const res = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...column,
        color: Generator.Column.getNegativeColor(),
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create column with color which is not included in the enum', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const column = Generator.Column.getUnique(boardId);
    const res = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...column,
        color: Generator.Column.getInvalidColor(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create column with negative board id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const column = Generator.Column.getUnique(boardId);
    const res = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...column,
        boardId: Generator.Column.getNegativeBoardId(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create column with board id without having access to it', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const { token } = firstUser;

    const secondUser = await helper.createUser(defaultUser);
    const boardIdWithoutAccess = secondUser.getRandomBoardId();

    const column = Generator.Column.getUnique(boardIdWithoutAccess);
    const res = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send(column);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create column with belowId without access', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const firstUserToken = firstUser.getToken();
    const boardIdWithoutAccess = firstUser.getRandomBoardId();

    const secondUser = await helper.createUser(defaultUser);
    const secondUserToken = secondUser.getToken();
    const boardIdWithAccess = secondUser.getRandomBoardId();

    const firstColumn = Generator.Column.getUnique(boardIdWithoutAccess);
    const firstRes = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${firstUserToken}`)
      .send(firstColumn);

    const secondColumn = Generator.Column.getUnique(boardIdWithAccess);
    await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${firstUserToken}`)
      .send(secondColumn);

    const firstColumnIdWithoutAccess = firstRes.body.data.columnId;

    const thirdColumn = Generator.Column.getUnique(boardIdWithAccess);
    const thirdRes = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${secondUserToken}`)
      .send({
        ...thirdColumn,
        belowId: firstColumnIdWithoutAccess,
      });

    expect(thirdRes.statusCode).toEqual(403);
    expect(thirdRes.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));
    done();
  });
});

describe('get column by id', () => {
  it('user can successfully get column by id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const column = Generator.Column.getUnique(boardId);
    const { body: { data: { columnId } } } = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send(column);

    const res = await request()
      .get(`${routes.column}/${columnId}`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));
    expect(res.body.data).toEqual({
      id: columnId,
      position: expect.any(Number),
      ...column,
    });

    done();
  });
  it('user can\'t get column without authorization header', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const column = Generator.Column.getUnique(boardId);
    const { body: { data: { columnId } } } = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send(column);

    const res = await request()
      .get(`${routes.column}/${columnId}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t access to the column by string id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const column = Generator.Column.getUnique(boardId);
    const { body: { data: { columnId } } } = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send(column);

    const res = await request()
      .get(`${routes.column}/string_${columnId}`)
      .send();

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t access to the column if he does not have access to it', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const firstUserBoardId = firstUser.getRandomBoardId();

    const secondUser = await helper.createUser(defaultUser);

    const column = Generator.Column.getUnique(firstUserBoardId);
    const { body: { data: { columnId } } } = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(column);

    const res = await request()
      .get(`${routes.column}/${columnId}`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send();

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('get all columns', () => {
  it('user can successfully gets all columns to which he has access', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const token = firstUser.getToken();
    const [firstBoard, secondBoard] = await helper.createBoards({
      token,
      boards: defaultUser.boards,
    });
    await helper.createUser(defaultUser);

    const columnOne = Generator.Column.getUnique(firstBoard.id);
    await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send(columnOne);

    const columnTwo = Generator.Column.getUnique(secondBoard.id);
    await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send(columnTwo);

    const res = await request()
      .get(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    const { columns } = res.body.data;
    const [{ id: columnIdOne }, { id: columnIdTwo }] = columns.entities;

    expect(columns.entities).toEqual([{
      id: columnIdOne,
      ...columnOne,
    }, {
      id: columnIdTwo,
      ...columnTwo,
    }]);
    expect(columns.positions).toMatchObject({
      [firstBoard.id]: [columnIdOne],
      [secondBoard.id]: [columnIdTwo],
    });

    done();
  });
  it('user can successfully gets all columns to which he has access by board id', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const token = firstUser.getToken();
    const [firstBoardId, secondBoardId] = firstUser.getBoardIds();

    await helper.createUser(defaultUser);

    const columnOne = Generator.Column.getUnique(firstBoardId);
    await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send(columnOne);

    const columnTwo = Generator.Column.getUnique(secondBoardId);
    await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send(columnTwo);

    const res = await request()
      .get(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .query({ boardId: firstBoardId })
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    const { columns } = res.body.data;
    const [{ id: columnIdOne }] = columns.entities;

    expect(columns.entities).toEqual([{
      id: columnIdOne,
      ...columnOne,
    }]);
    expect(columns.positions).toMatchObject({
      [firstBoardId]: [columnIdOne],
    });

    done();
  });
  it('user can successfully get empty list of columns after deleting all', async (done) => {
    const { token } = await helper.createUser();

    const resWithDefaultBoard = await request()
      .get(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const [defaultBoardIdForDelete] = resWithDefaultBoard.body.data.boards.positions;

    await request()
      .delete(`${routes.board}/${defaultBoardIdForDelete}`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const res = await request()
      .get(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const { columns } = res.body.data;

    expect(columns).toEqual({
      entities: [],
      positions: {},
    });

    done();
  });
  it('user can\'t get all columns if he does not have access to board id', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const token = firstUser.getToken();
    const [firstBoardId, secondBoardId] = firstUser.getBoardIds();

    const secondUser = await helper.createUser(defaultUser);
    const [boardIdWithoutAccess] = secondUser.getBoardIds();

    const columnOne = Generator.Column.getUnique(firstBoardId);
    await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send(columnOne);

    const columnTwo = Generator.Column.getUnique(secondBoardId);
    await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send(columnTwo);

    const res = await request()
      .get(`${routes.column}/`)
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
  it('user can\'t get columns if he has no columns', async (done) => {
    const firstUser = await helper.createUser();
    const [firstBoard, secondBoard] = await helper.createBoards({
      token: firstUser.getToken(),
      boards: defaultUser.boards,
    });
    const secondUser = await helper.createUser();

    const columnOne = Generator.Column.getUnique(firstBoard.id);
    await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(columnOne);

    const columnTwo = Generator.Column.getUnique(secondBoard.id);
    await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(columnTwo);

    const res = await request()
      .get(`${routes.column}/`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: {
        columns: {
          entities: [],
          positions: expect.any(Object),
        },
      },
    }));
    done();
  });
  it('user can\'t get all columns without authorization header', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const column = Generator.Column.getUnique(boardId);
    await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send(column);

    const res = await request()
      .get(`${routes.column}/`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('remove column', () => {
  it('user can successfully remove column by id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const column = Generator.Column.getUnique(boardId);
    const { body: { data: { columnId } } } = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send(column);

    const res = await request()
      .delete(`${routes.column}/${columnId}`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t remove column without authorization header', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const column = Generator.Column.getUnique(boardId);
    const { body: { data: { columnId } } } = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send(column);

    const res = await request()
      .delete(`${routes.column}/${columnId}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t remove column if he does not have access to it', async (done) => {
    const firstUser = await helper.createUser();
    const [firstBoard, secondBoard] = await helper.createBoards({
      token: firstUser.getToken(),
      boards: defaultUser.boards,
    });
    const secondUser = await helper.createUser();

    const columnOne = Generator.Column.getUnique(firstBoard.id);
    await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(columnOne);

    const columnTwo = Generator.Column.getUnique(secondBoard.id);
    const { body: { data: { columnId } } } = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(columnTwo);

    const res = await request()
      .delete(`${routes.column}/${columnId}`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send();

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t remove column by string id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const column = Generator.Column.getUnique(boardId);
    const { body: { data: { columnId } } } = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send(column);

    const res = await request()
      .delete(`${routes.column}/string_${columnId}`)
      .send();

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('update column', () => {
  it('user can successfully update column by id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const column = Generator.Column.getUnique(boardId);
    const { body: { data: { columnId } } } = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send(column);

    const newColumn = Generator.Column.getUnique(boardId);
    const resUpdate = await request()
      .patch(`${routes.column}/${columnId}`)
      .set('authorization', `Bearer ${token}`)
      .send(newColumn);

    const res = await request()
      .get(`${routes.column}/${columnId}`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(resUpdate.statusCode).toEqual(200);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    expect(res.body.data).toEqual({
      id: columnId,
      position: 0,
      ...newColumn,
    });

    done();
  });
  it('user can\'t update column without authorization header', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const column = Generator.Column.getUnique(boardId);
    const { body: { data: { columnId } } } = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send(column);

    const newColumn = Generator.Column.getUnique(boardId);
    const res = await request()
      .patch(`${routes.column}/${columnId}`)
      .send(newColumn);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t update column if he does not have access to it', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const boardId = firstUser.getRandomBoardId();

    const secondUser = await helper.createUser(defaultUser);

    const column = Generator.Column.getUnique(boardId);
    const { body: { data: { columnId } } } = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(column);

    const newColumn = Generator.Column.getUnique();
    const res = await request()
      .patch(`${routes.column}/${columnId}`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .send(newColumn);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t update column by string id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const column = Generator.Column.getUnique(boardId);
    const { body: { data: { columnId } } } = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send(column);

    const newColumn = Generator.Column.getUnique(boardId);
    const res = await request()
      .patch(`${routes.column}/string_${columnId}`)
      .send(newColumn);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t update column if he does not have access to new board id', async (done) => {
    const firstUser = await helper.createUser(defaultUser);
    const firstUserBoardId = firstUser.getRandomBoardId();

    const secondUser = await helper.createUser(defaultUser);
    const boardIdWithoutAccess = secondUser.getRandomBoardId();

    const column = Generator.Column.getUnique(firstUserBoardId);
    const { body: { data: { columnId } } } = await request()
      .post(`${routes.column}/`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(column);

    const newColumn = Generator.Column.getUnique(boardIdWithoutAccess);
    const res = await request()
      .patch(`${routes.column}/${columnId}`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send(newColumn);

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
    const boardId = user.getRandomBoardId();

    await helper.createColumns({
      token,
      boardId,
      columns: [{
        title: 'default-column-1',
      }, {
        title: 'default-column-2',
      }, {
        title: 'default-column-3',
      }, {
        title: 'default-column-4',
      }, {
        title: 'default-column-5',
      }, {
        title: 'default-column-6',
      }],
    });

    const resColumnsBeforeUpdate = await request()
      .get(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    await request()
      .patch(`${routes.column}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        boardId,
        sourcePosition: 1,
        destinationPosition: 4,
      });

    const resColumnAfterUpdate = await request()
      .get(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const beforePositions = resColumnsBeforeUpdate.body.data.columns.positions[boardId];
    const afterPositions = resColumnAfterUpdate.body.data.columns.positions[boardId];

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
  it('user can\'t update position with wrong source position', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    await helper.createColumns({
      token,
      boardId,
      columns: [{
        title: 'default-column-1',
      }, {
        title: 'default-column-2',
      }, {
        title: 'default-column-3',
      }, {
        title: 'default-column-4',
      }, {
        title: 'default-column-5',
      }, {
        title: 'default-column-6',
      }],
    });

    const res = await request()
      .patch(`${routes.column}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        boardId,
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
    const boardId = user.getRandomBoardId();

    await helper.createColumns({
      token,
      boardId,
      columns: [{
        title: 'default-column-1',
      }, {
        title: 'default-column-2',
      }, {
        title: 'default-column-3',
      }, {
        title: 'default-column-4',
      }, {
        title: 'default-column-5',
      }, {
        title: 'default-column-6',
      }],
    });

    const res = await request()
      .patch(`${routes.column}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        boardId,
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
  it('user can\'t update position with boardId without access', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const secondUser = await helper.createUser(defaultUser);
    const boardIdWithoutAccess = secondUser.getRandomBoardId();

    await helper.createColumns({
      token,
      boardId,
      columns: [{
        title: 'default-column-1',
      }, {
        title: 'default-column-2',
      }, {
        title: 'default-column-3',
      }, {
        title: 'default-column-4',
      }, {
        title: 'default-column-5',
      }, {
        title: 'default-column-6',
      }],
    });

    const res = await request()
      .patch(`${routes.column}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        boardId: boardIdWithoutAccess,
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
});

describe('reverse order', () => {
  it('user can successfully reverse columns order by boardId', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    await helper.createColumns({
      token,
      boardId,
      columns: [{
        title: 'default-column-1',
      }, {
        title: 'default-column-2',
      }, {
        title: 'default-column-3',
      }, {
        title: 'default-column-4',
      }, {
        title: 'default-column-5',
      }, {
        title: 'default-column-6',
      }],
    });

    const resColumnsBeforeReverse = await request()
      .get(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    await request()
      .post(`${routes.column}/reverse`)
      .set('authorization', `Bearer ${token}`)
      .send({
        boardId,
      });

    const resColumnAfterReverse = await request()
      .get(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const beforePositions = resColumnsBeforeReverse.body.data.columns.positions[boardId];
    const afterPositions = resColumnAfterReverse.body.data.columns.positions[boardId];

    expect(afterPositions).toEqual([
      beforePositions[5],
      beforePositions[4],
      beforePositions[3],
      beforePositions[2],
      beforePositions[1],
      beforePositions[0],
    ]);

    done();
  });
  it('user can\'t reverse columns order without access to boardId', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const secondUser = await helper.createUser(defaultUser);
    const boardIdWithoutAccess = secondUser.getRandomBoardId();

    await helper.createColumns({
      token,
      boardId,
      columns: [{
        title: 'default-column-1',
      }, {
        title: 'default-column-2',
      }, {
        title: 'default-column-3',
      }, {
        title: 'default-column-4',
      }, {
        title: 'default-column-5',
      }, {
        title: 'default-column-6',
      }],
    });

    const res = await request()
      .post(`${routes.column}/reverse`)
      .set('authorization', `Bearer ${token}`)
      .send({
        boardId: boardIdWithoutAccess,
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
  it('user can successfully duplicate column', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    await helper.createColumns({
      token,
      boardId,
      columns: [{
        title: 'default-column-1',
        headings: [{ title: 'custom-heading-1' }],
      }, {
        title: 'default-column-2',
        headings: [{ title: 'custom-heading-2' }],
      }],
    });

    const resColumns = await request()
      .get(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const beforeColumns = resColumns.body.data.columns;

    const columnIds = beforeColumns.positions[boardId];
    const columnId = columnIds[0];
    const firstColumn = beforeColumns.entities.find((column) => column.id === columnIds[0]);
    const secondColumn = beforeColumns.entities.find((column) => column.id === columnIds[1]);

    const resDuplicate = await request()
      .post(`${routes.column}/duplicate`)
      .set('authorization', `Bearer ${token}`)
      .send({
        columnId,
      });

    const resColumnAfterDuplicate = await request()
      .get(`${routes.column}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const afterColumns = resColumnAfterDuplicate.body.data.columns;
    const duplicatedColumnId = resDuplicate.body.data.columnId;

    expect(afterColumns.positions[boardId]).toEqual([
      columnIds[0],
      duplicatedColumnId,
      columnIds[1],
    ]);

    expect(afterColumns.entities).toEqual(expect.arrayContaining([
      firstColumn,
      secondColumn, {
        ...firstColumn,
        id: duplicatedColumnId,
      },
    ]));

    done();
  });
  it('user can\'t duplicate column without access to column', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const boardId = user.getRandomBoardId();

    const secondUser = await helper.createUser(defaultUser);
    const secondUserToken = secondUser.getToken();
    const boardIdWithoutAccess = secondUser.getRandomBoardId();

    await helper.createColumns({
      token,
      boardId,
      columns: [{
        title: 'default-column-1',
        headings: [{ title: 'custom-heading-1' }],
      }, {
        title: 'default-column-2',
        headings: [{ title: 'custom-heading-2' }],
      }],
    });

    await helper.createColumns({
      token: secondUserToken,
      boardId: boardIdWithoutAccess,
      columns: [{
        title: 'default-column-1',
        headings: [{ title: 'custom-heading-1' }],
      }, {
        title: 'default-column-2',
        headings: [{ title: 'custom-heading-2' }],
      }],
    });

    const resColumnsWithoutAccess = await request()
      .get(`${routes.column}/`)
      .set('authorization', `Bearer ${secondUserToken}`)
      .send();

    const columnIdWithoutAccess = resColumnsWithoutAccess.body.data.columns.positions[boardIdWithoutAccess][0];

    const res = await request()
      .post(`${routes.column}/duplicate`)
      .set('authorization', `Bearer ${token}`)
      .send({
        columnId: columnIdWithoutAccess,
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});
