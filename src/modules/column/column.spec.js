const supertest = require('supertest');
const { UserMock, BoardMock, ColumnMock } = require('../../../tests/data');
const app = require('../../server');

const request = supertest(app);
const baseAuthRoute = '/api/v1/auth';
const baseBoardRoute = '/api/v1/board';
const baseColumnRoute = '/api/v1/column';

const users = [];

const registerUser = async () => {
  const user = UserMock.getUnique();
  const resRegister = await request
    .post(`${baseAuthRoute}/register`)
    .send(user);
  users.push({
    pseudoId: users.length,
    token: resRegister.body.data.token,
  });
  return users[users.length - 1];
};

const createBoard = async (userId) => {
  const board = BoardMock.getUnique();
  const resRegister = await request
    .post(`${baseBoardRoute}/`)
    .set('authorization', `Bearer ${users[userId].token}`)
    .send(board);
  const { boardIds = [] } = users[userId];
  boardIds.push(resRegister.body.data.boardId);
  users[userId] = {
    ...users[userId],
    boardIds,
  };
  return {
    ...board,
    id: resRegister.body.data.boardId,
  };
};

beforeAll(async (done) => {
  const { pseudoId: firstUserId } = await registerUser();
  const { pseudoId: secondUserId } = await registerUser();
  await createBoard(firstUserId);
  await createBoard(secondUserId);
  done();
});

afterAll(async (done) => {
  await knex.destroy();
  done();
});

describe('create', () => {
  it('user can successfully create column with all fields', async (done) => {
    const column = ColumnMock.getUnique(users[0].boardIds[0]);
    const res = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
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
    const column = ColumnMock.getUnique(users[0].boardIds[0]);
    delete column.description;
    const res = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
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
    const column = ColumnMock.getUnique(users[0].boardIds[0]);
    delete column.color;
    const res = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
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
    const column = ColumnMock.getUnique(users[0].boardIds[0]);
    delete column.isCollapsed;
    const res = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
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
  it('user can successfully create column without description, color and is collapsed', async (done) => {
    const column = ColumnMock.getUnique(users[0].boardIds[0]);
    delete column.description;
    delete column.color;
    delete column.isCollapsed;
    const res = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
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
  it('user can`t create column without authorization', async (done) => {
    const column = ColumnMock.getUnique(users[0].boardIds[0]);
    const res = await request
      .post(`${baseColumnRoute}/`)
      .send(column);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create column without title', async (done) => {
    const column = ColumnMock.getUnique(users[0].boardIds[0]);
    delete column.title;
    const res = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(column);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create column without position', async (done) => {
    const column = ColumnMock.getUnique(users[0].boardIds[0]);
    delete column.position;
    const res = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(column);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create column with empty title', async (done) => {
    const column = ColumnMock.getUnique(users[0].boardIds[0]);
    const res = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
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
  it('user can`t create column with long title', async (done) => {
    const column = ColumnMock.getUnique(users[0].boardIds[0]);
    const res = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send({
        ...column,
        title: BoardMock.getLongTitle(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create column with negative position', async (done) => {
    const column = ColumnMock.getUnique(users[0].boardIds[0]);
    const res = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send({
        ...column,
        position: BoardMock.getNegativePosition(),
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create column with string position', async (done) => {
    const column = ColumnMock.getUnique(users[0].boardIds[0]);
    const res = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send({
        ...column,
        position: BoardMock.getStringPosition(),
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create column with negative color', async (done) => {
    const column = ColumnMock.getUnique(users[0].boardIds[0]);
    const res = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send({
        ...column,
        color: BoardMock.getNegativeColor(),
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create column with string color', async (done) => {
    const column = ColumnMock.getUnique(users[0].boardIds[0]);
    const res = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send({
        ...column,
        color: BoardMock.getNegativeColor(),
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create column with color which is not included in the enum', async (done) => {
    const column = ColumnMock.getUnique(users[0].boardIds[0]);
    const res = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send({
        ...column,
        color: BoardMock.getInvalidColor(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create column with negative board id', async (done) => {
    const column = ColumnMock.getUnique(users[1].boardIds[0]);
    const res = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send({
        ...column,
        boardId: ColumnMock.getNegativeBoardId(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create column with board id without having access to it', async (done) => {
    const boardIdWithoutAccess = users[1].boardIds[0];
    const column = ColumnMock.getUnique(boardIdWithoutAccess);
    const res = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
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
    const column = ColumnMock.getUnique(users[0].boardIds[0]);
    const resCreate = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(column);
    const { columnId } = resCreate.body.data;
    const res = await request
      .get(`${baseColumnRoute}/${columnId}`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));
    expect(res.body.data).toEqual({
      id: columnId,
      ...column,
    });

    done();
  });
  it('user can`t get column without authorization header', async (done) => {
    const column = ColumnMock.getUnique(users[0].boardIds[0]);
    const resCreate = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(column);
    const { columnId } = resCreate.body.data;
    const res = await request
      .get(`${baseColumnRoute}/${columnId}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t access to the column if he does not have access to it', async (done) => {
    const boardIdSecondUser = users[1].boardIds[0];
    const column = ColumnMock.getUnique(boardIdSecondUser);
    const resCreate = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[1].token}`)
      .send(column);
    const { columnId } = resCreate.body.data;

    const res = await request
      .get(`${baseColumnRoute}/${columnId}`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send();

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t access to the column by string id', async (done) => {
    const column = ColumnMock.getUnique(users[0].boardIds[0]);
    const resCreate = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(column);
    const { columnId } = resCreate.body.data;
    const res = await request
      .get(`${baseColumnRoute}/string_${columnId}`)
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
    const { pseudoId: firstUserId } = await registerUser();
    const { pseudoId: secondUserId } = await registerUser();
    await createBoard(firstUserId);
    const boardOne = await createBoard(secondUserId);
    const boardTwo = await createBoard(secondUserId);

    const columnOne = ColumnMock.getUnique(boardOne.id);
    await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[secondUserId].token}`)
      .send(columnOne);
    const columnTwo = ColumnMock.getUnique(boardTwo.id);
    await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[secondUserId].token}`)
      .send(columnTwo);

    const res = await request
      .get(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[secondUserId].token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    const { columns } = res.body.data;
    const [{ id: columnIdOne }, { id: columnIdTwo }] = columns;

    expect(columns).toEqual([{
      id: columnIdOne,
      ...columnOne,
    }, {
      id: columnIdTwo,
      ...columnTwo,
    }]);

    done();
  });
  it('user can`t get columns if he has no columns', async (done) => {
    const { pseudoId: firstUserId } = await registerUser();
    const { pseudoId: secondUserId } = await registerUser();
    await createBoard(firstUserId);
    const boardOne = await createBoard(secondUserId);
    const boardTwo = await createBoard(secondUserId);

    const columnOne = ColumnMock.getUnique(boardOne.id);
    await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[secondUserId].token}`)
      .send(columnOne);
    const columnTwo = ColumnMock.getUnique(boardTwo.id);
    await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[secondUserId].token}`)
      .send(columnTwo);

    const res = await request
      .get(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[firstUserId].token}`)
      .send();

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));
    done();
  });
  it('user can`t get all columns without authorization header', async (done) => {
    const column = ColumnMock.getUnique(users[0].boardIds[0]);
    await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(column);
    const res = await request
      .get(`${baseColumnRoute}/`)
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
    const column = ColumnMock.getUnique(users[0].boardIds[0]);
    const resCreate = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(column);
    const { columnId } = resCreate.body.data;
    const res = await request
      .delete(`${baseColumnRoute}/${columnId}`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t remove column without authorization header', async (done) => {
    const column = ColumnMock.getUnique(users[0].boardIds[0]);
    const resCreate = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(column);
    const { columnId } = resCreate.body.data;
    const res = await request
      .delete(`${baseColumnRoute}/${columnId}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t remove column if he does not have access to it', async (done) => {
    const { pseudoId: firstUserId } = await registerUser();
    const { pseudoId: secondUserId } = await registerUser();
    const boardOne = await createBoard(firstUserId);
    const boardTwo = await createBoard(firstUserId);

    const columnOne = ColumnMock.getUnique(boardOne.id);
    await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[firstUserId].token}`)
      .send(columnOne);
    const columnTwo = ColumnMock.getUnique(boardTwo.id);
    const resCreate = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[firstUserId].token}`)
      .send(columnTwo);

    const { columnId } = resCreate.body.data;

    const res = await request
      .delete(`${baseColumnRoute}/${columnId}`)
      .set('authorization', `Bearer ${users[secondUserId].token}`)
      .send();

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t remove column by string id', async (done) => {
    const column = ColumnMock.getUnique(users[0].boardIds[0]);
    const resCreate = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(column);
    const { columnId } = resCreate.body.data;
    const res = await request
      .delete(`${baseColumnRoute}/string_${columnId}`)
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
    const column = ColumnMock.getUnique(users[0].boardIds[0]);
    const resCreate = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(column);
    const { columnId } = resCreate.body.data;
    const newColumn = ColumnMock.getUnique(users[0].boardIds[0]);
    const resUpdate = await request
      .patch(`${baseColumnRoute}/${columnId}`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(newColumn);

    const res = await request
      .get(`${baseColumnRoute}/${columnId}`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send();

    expect(resUpdate.statusCode).toEqual(200);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    expect(res.body.data).toEqual({
      id: columnId,
      ...newColumn,
    });

    done();
  });
  it('user can`t update column without authorization header', async (done) => {
    const column = ColumnMock.getUnique(users[0].boardIds[0]);
    const resCreate = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(column);
    const { columnId } = resCreate.body.data;
    const newColumn = ColumnMock.getUnique(users[0].boardIds[0]);
    const res = await request
      .patch(`${baseColumnRoute}/${columnId}`)
      .send(newColumn);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t update column if he does not have access to it', async (done) => {
    const { pseudoId: firstUserId } = await registerUser();
    const { pseudoId: secondUserId } = await registerUser();
    const boardOne = await createBoard(firstUserId);

    const column = ColumnMock.getUnique(boardOne.id);
    const resCreate = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[firstUserId].token}`)
      .send(column);
    const { columnId } = resCreate.body.data;

    const newColumn = ColumnMock.getUnique();
    const res = await request
      .patch(`${baseColumnRoute}/${columnId}`)
      .set('authorization', `Bearer ${users[secondUserId].token}`)
      .send(newColumn);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t update column by string id', async (done) => {
    const column = ColumnMock.getUnique(users[0].boardIds[0]);
    const resCreate = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(column);
    const { columnId } = resCreate.body.data;

    const newColumn = ColumnMock.getUnique(users[0].boardIds[0]);
    const res = await request
      .patch(`${baseColumnRoute}/string_${columnId}`)
      .send(newColumn);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t update column if he does not have access to new board id', async (done) => {
    const { pseudoId: firstUserId } = await registerUser();
    const { pseudoId: secondUserId } = await registerUser();
    const boardOne = await createBoard(firstUserId);
    const boardWithoutAccess = await createBoard(secondUserId);

    const column = ColumnMock.getUnique(boardOne.id);
    const resCreate = await request
      .post(`${baseColumnRoute}/`)
      .set('authorization', `Bearer ${users[firstUserId].token}`)
      .send(column);
    const { columnId } = resCreate.body.data;

    const newColumn = ColumnMock.getUnique(boardWithoutAccess.id);
    const res = await request
      .patch(`${baseColumnRoute}/${columnId}`)
      .set('authorization', `Bearer ${users[firstUserId].token}`)
      .send(newColumn);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});
