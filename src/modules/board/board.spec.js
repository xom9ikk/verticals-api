const supertest = require('supertest');
const { UserMock, BoardMock } = require('../../../tests/data');
const app = require('../../server');

const request = supertest(app);
const baseAuthRoute = '/api/v1/auth';
const baseBoardRoute = '/api/v1/board';

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

beforeAll(async (done) => {
  await registerUser();
  await registerUser();
  done();
});

afterAll(async (done) => {
  await knex.destroy();
  done();
});

describe('create', () => {
  it('user can successfully create board with all fields', async (done) => {
    const board = BoardMock.getUnique();
    const res = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(board);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        boardId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create board without description', async (done) => {
    const board = BoardMock.getUnique();
    delete board.description;
    const res = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(board);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        boardId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create board without color', async (done) => {
    const board = BoardMock.getUnique();
    delete board.color;
    const res = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(board);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        boardId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can successfully create board without description and color', async (done) => {
    const board = BoardMock.getUnique();
    delete board.description;
    delete board.color;
    const res = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(board);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        boardId: expect.any(Number),
      }),
    }));

    done();
  });
  it('user can`t create board without authorization', async (done) => {
    const board = BoardMock.getUnique();
    const res = await request
      .post(`${baseBoardRoute}/`)
      .send(board);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create board without title', async (done) => {
    const board = BoardMock.getUnique();
    delete board.title;
    const res = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(board);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create board without position', async (done) => {
    const board = BoardMock.getUnique();
    delete board.position;
    const res = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(board);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create board without card type', async (done) => {
    const board = BoardMock.getUnique();
    delete board.cardType;
    const res = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(board);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create board with empty title', async (done) => {
    const board = BoardMock.getUnique();
    const res = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send({
        ...board,
        title: '',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create board with long title', async (done) => {
    const board = BoardMock.getUnique();
    const res = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send({
        ...board,
        title: BoardMock.getLongTitle(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create board with negative position', async (done) => {
    const board = BoardMock.getUnique();
    const res = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send({
        ...board,
        position: BoardMock.getNegativePosition(),
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create board with string position', async (done) => {
    const board = BoardMock.getUnique();
    const res = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send({
        ...board,
        position: BoardMock.getStringPosition(),
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create board with negative card type', async (done) => {
    const board = BoardMock.getUnique();
    const res = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send({
        ...board,
        cardType: BoardMock.getNegativeCardType(),
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create board with string card type', async (done) => {
    const board = BoardMock.getUnique();
    const res = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send({
        ...board,
        cardType: BoardMock.getNegativeCardType(),
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create board with card type which is not included in the enum', async (done) => {
    const board = BoardMock.getUnique();
    const res = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send({
        ...board,
        cardType: BoardMock.getInvalidCardType(),
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create board with negative color', async (done) => {
    const board = BoardMock.getUnique();
    const res = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send({
        ...board,
        color: BoardMock.getNegativeColor(),
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create board with string color', async (done) => {
    const board = BoardMock.getUnique();
    const res = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send({
        ...board,
        color: BoardMock.getNegativeColor(),
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create board with color which is not included in the enum', async (done) => {
    const board = BoardMock.getUnique();
    const res = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send({
        ...board,
        color: BoardMock.getInvalidColor(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('get board by id', () => {
  it('user can successfully get board by id', async (done) => {
    const board = BoardMock.getUnique();
    const resCreate = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(board);
    const { boardId } = resCreate.body.data;
    const res = await request
      .get(`${baseBoardRoute}/${boardId}`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));
    expect(res.body.data).toEqual({
      id: boardId,
      ...board,
    });

    done();
  });
  it('user can`t get board without authorization header', async (done) => {
    const board = BoardMock.getUnique();
    const resCreate = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(board);
    const { boardId } = resCreate.body.data;
    const res = await request
      .get(`${baseBoardRoute}/${boardId}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t access to the board if he does not have access to it', async (done) => {
    const board = BoardMock.getUnique();
    const resCreate = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(board);
    const { boardId } = resCreate.body.data;

    const res = await request
      .get(`${baseBoardRoute}/${boardId}`)
      .set('authorization', `Bearer ${users[1].token}`)
      .send();

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t access to the board by string id', async (done) => {
    const board = BoardMock.getUnique();
    const resCreate = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(board);
    const { boardId } = resCreate.body.data;
    const res = await request
      .get(`${baseBoardRoute}/string_${boardId}`)
      .send();

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('get all boards', () => {
  it('user can successfully get all boards to which he has access', async (done) => {
    const userOne = UserMock.getUnique();
    const resRegisterOne = await request
      .post(`${baseAuthRoute}/register`)
      .send(userOne);
    const { token: tokenOne } = resRegisterOne.body.data;
    const boardOne = BoardMock.getUnique();
    await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${tokenOne}`)
      .send(boardOne);

    const userTwo = UserMock.getUnique();
    const resRegisterTwo = await request
      .post(`${baseAuthRoute}/register`)
      .send(userTwo);
    const { token: tokenTwo } = resRegisterTwo.body.data;
    const boardTwo = BoardMock.getUnique();
    const resCreateTwo = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${tokenTwo}`)
      .send(boardTwo);
    const boardThree = BoardMock.getUnique();
    const resCreateThree = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${tokenTwo}`)
      .send(boardThree);
    const { boardId: boardIdTwo } = resCreateTwo.body.data;
    const { boardId: boardIdThree } = resCreateThree.body.data;

    const res = await request
      .get(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${tokenTwo}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    const { boards } = res.body.data;
    expect(boards).toEqual([
      {
        id: boardIdTwo,
        ...boardTwo,
      }, {
        id: boardIdThree,
        ...boardThree,
      },
    ]);

    done();
  });
  it('user can`t get boards if he has no boards', async (done) => {
    const userOne = UserMock.getUnique();
    const resRegisterOne = await request
      .post(`${baseAuthRoute}/register`)
      .send(userOne);
    const { token: tokenOne } = resRegisterOne.body.data;
    const boardOne = BoardMock.getUnique();
    await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${tokenOne}`)
      .send(boardOne);

    const userTwo = UserMock.getUnique();
    const resRegisterTwo = await request
      .post(`${baseAuthRoute}/register`)
      .send(userTwo);
    const { token: tokenTwo } = resRegisterTwo.body.data;

    const res = await request
      .get(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${tokenTwo}`)
      .send();

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));
    done();
  });
  it('user can`t get all boards without authorization header', async (done) => {
    const board = BoardMock.getUnique();
    const resCreate = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(board);
    const { boardId } = resCreate.body.data;
    const res = await request
      .get(`${baseBoardRoute}/${boardId}`)
      .send(board);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('remove board', () => {
  it('user can successfully remove board by id', async (done) => {
    const board = BoardMock.getUnique();
    const resCreate = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(board);
    const { boardId } = resCreate.body.data;
    const res = await request
      .delete(`${baseBoardRoute}/${boardId}`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t remove board without authorization header', async (done) => {
    const board = BoardMock.getUnique();
    const resCreate = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(board);
    const { boardId } = resCreate.body.data;
    const res = await request
      .delete(`${baseBoardRoute}/${boardId}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t remove board if he does not have access to it', async (done) => {
    const userOne = UserMock.getUnique();
    const resRegisterOne = await request
      .post(`${baseAuthRoute}/register`)
      .send(userOne);
    const { token: tokenOne } = resRegisterOne.body.data;

    const userTwo = UserMock.getUnique();
    const resRegisterTwo = await request
      .post(`${baseAuthRoute}/register`)
      .send(userTwo);
    const { token: tokenTwo } = resRegisterTwo.body.data;

    const board = BoardMock.getUnique();
    const resCreate = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${tokenOne}`)
      .send(board);
    const { boardId } = resCreate.body.data;

    const res = await request
      .delete(`${baseBoardRoute}/${boardId}`)
      .set('authorization', `Bearer ${tokenTwo}`)
      .send();

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t remove board by string id', async (done) => {
    const board = BoardMock.getUnique();
    const resCreate = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(board);
    const { boardId } = resCreate.body.data;
    const res = await request
      .delete(`${baseBoardRoute}/string_${boardId}`)
      .send();

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('update board', () => {
  it('user can successfully update board by id', async (done) => {
    const board = BoardMock.getUnique();
    const resCreate = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(board);
    const { boardId } = resCreate.body.data;
    const newBoard = BoardMock.getUnique();
    const resUpdate = await request
      .patch(`${baseBoardRoute}/${boardId}`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(newBoard);

    const res = await request
      .get(`${baseBoardRoute}/${boardId}`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send();

    expect(resUpdate.statusCode).toEqual(200);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    expect(res.body.data).toEqual({
      id: boardId,
      ...newBoard,
    });

    done();
  });
  it('user can`t update board without authorization header', async (done) => {
    const board = BoardMock.getUnique();
    const resCreate = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(board);
    const { boardId } = resCreate.body.data;
    const newBoard = BoardMock.getUnique();
    const res = await request
      .patch(`${baseBoardRoute}/${boardId}`)
      .send(newBoard);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t update board if he does not have access to it', async (done) => {
    const userOne = UserMock.getUnique();
    const resRegisterOne = await request
      .post(`${baseAuthRoute}/register`)
      .send(userOne);
    const { token: tokenOne } = resRegisterOne.body.data;

    const userTwo = UserMock.getUnique();
    const resRegisterTwo = await request
      .post(`${baseAuthRoute}/register`)
      .send(userTwo);
    const { token: tokenTwo } = resRegisterTwo.body.data;

    const board = BoardMock.getUnique();
    const resCreate = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${tokenOne}`)
      .send(board);
    const { boardId } = resCreate.body.data;

    const newBoard = BoardMock.getUnique();
    const res = await request
      .patch(`${baseBoardRoute}/${boardId}`)
      .set('authorization', `Bearer ${tokenTwo}`)
      .send(newBoard);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t update board by string id', async (done) => {
    const board = BoardMock.getUnique();
    const resCreate = await request
      .post(`${baseBoardRoute}/`)
      .set('authorization', `Bearer ${users[0].token}`)
      .send(board);
    const { boardId } = resCreate.body.data;

    const newBoard = BoardMock.getUnique();
    const res = await request
      .patch(`${baseBoardRoute}/string_${boardId}`)
      .send(newBoard);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});
