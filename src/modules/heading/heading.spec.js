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
  }, {
    title: 'default-board-2',
  }, {
    title: 'default-board-3',
  }, {
    title: 'default-board-4',
  }],
};

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
