const supertest = require('supertest');
const app = require('../../server');
const { Generator } = require('../../../tests/generator');
const { Helper } = require('../../../tests/helper');
const { routes } = require('../../../tests/routes');

const request = supertest(app);
const helper = new Helper(request);

afterAll(async (done) => {
  await knex.destroy();
  done();
});

describe('create', () => {
  it('user can successfully create board with all fields', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const res = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
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
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    delete board.description;
    const res = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
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
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    delete board.color;
    const res = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
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
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    delete board.description;
    delete board.color;
    const res = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
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
    const board = Generator.Board.getUnique();
    const res = await request
      .post(`${routes.board}/`)
      .send(board);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create board without title', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    delete board.title;
    const res = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send(board);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create board without position', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    delete board.position;
    const res = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send(board);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create board without card type', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    delete board.cardType;
    const res = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send(board);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create board with empty title', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const res = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
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
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const res = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...board,
        title: Generator.Board.getLongTitle(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create board with negative position', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const res = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...board,
        position: Generator.Board.getNegativePosition(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create board with string position', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const res = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...board,
        position: Generator.Board.getStringPosition(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create board with negative card type', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const res = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...board,
        cardType: Generator.Board.getNegativeCardType(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create board with string card type', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const res = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...board,
        cardType: Generator.Board.getNegativeCardType(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create board with card type which is not included in the enum', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const res = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...board,
        cardType: Generator.Board.getInvalidCardType(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create board with negative color', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const res = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...board,
        color: Generator.Board.getNegativeColor(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create board with string color', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const res = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...board,
        color: Generator.Board.getNegativeColor(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t create board with color which is not included in the enum', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const res = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...board,
        color: Generator.Board.getInvalidColor(),
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
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const { body: { data: { boardId } } } = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send(board);

    const res = await request
      .get(`${routes.board}/${boardId}`)
      .set('authorization', `Bearer ${token}`)
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
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const { body: { data: { boardId } } } = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send(board);

    const res = await request
      .get(`${routes.board}/${boardId}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t access to the board if he does not have access to it', async (done) => {
    const { token: tokenFirst } = await helper.createUser();
    const { token: tokenSecond } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const { body: { data: { boardId } } } = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${tokenFirst}`)
      .send(board);

    const res = await request
      .get(`${routes.board}/${boardId}`)
      .set('authorization', `Bearer ${tokenSecond}`)
      .send();

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t access to the board by string id', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const { body: { data: { boardId } } } = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send(board);

    const res = await request
      .get(`${routes.board}/string_${boardId}`)
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
    const { token: tokenFirst } = await helper.createUser();
    const { token: tokenSecond } = await helper.createUser();

    const boardOne = Generator.Board.getUnique();
    await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${tokenFirst}`)
      .send(boardOne);

    const boardTwo = Generator.Board.getUnique();
    const { body: { data: { boardId: boardIdTwo } } } = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${tokenSecond}`)
      .send(boardTwo);

    const boardThree = Generator.Board.getUnique();
    const { body: { data: { boardId: boardIdThree } } } = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${tokenSecond}`)
      .send(boardThree);

    const res = await request
      .get(`${routes.board}/`)
      .set('authorization', `Bearer ${tokenSecond}`)
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
    const { token: tokenFirst } = await helper.createUser();
    const { token: tokenSecond } = await helper.createUser();

    const boardOne = Generator.Board.getUnique();
    await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${tokenFirst}`)
      .send(boardOne);

    const res = await request
      .get(`${routes.board}/`)
      .set('authorization', `Bearer ${tokenSecond}`)
      .send();

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));
    done();
  });
  it('user can`t get all boards without authorization header', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const { body: { data: { boardId } } } = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send(board);

    const res = await request
      .get(`${routes.board}/${boardId}`)
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
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const { body: { data: { boardId } } } = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send(board);

    const res = await request
      .delete(`${routes.board}/${boardId}`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t remove board without authorization header', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const { body: { data: { boardId } } } = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send(board);

    const res = await request
      .delete(`${routes.board}/${boardId}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t remove board if he does not have access to it', async (done) => {
    const { token: tokenFirst } = await helper.createUser();
    const { token: tokenSecond } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const { body: { data: { boardId } } } = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${tokenFirst}`)
      .send(board);

    const res = await request
      .delete(`${routes.board}/${boardId}`)
      .set('authorization', `Bearer ${tokenSecond}`)
      .send();

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t remove board by string id', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const { body: { data: { boardId } } } = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send(board);

    const res = await request
      .delete(`${routes.board}/string_${boardId}`)
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
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const { body: { data: { boardId } } } = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send(board);

    const newBoard = Generator.Board.getUnique();
    const resUpdate = await request
      .patch(`${routes.board}/${boardId}`)
      .set('authorization', `Bearer ${token}`)
      .send(newBoard);

    const res = await request
      .get(`${routes.board}/${boardId}`)
      .set('authorization', `Bearer ${token}`)
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
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const { body: { data: { boardId } } } = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send(board);

    const newBoard = Generator.Board.getUnique();
    const res = await request
      .patch(`${routes.board}/${boardId}`)
      .send(newBoard);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t update board if he does not have access to it', async (done) => {
    const { token: tokenFirst } = await helper.createUser();
    const { token: tokenSecond } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const { body: { data: { boardId } } } = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${tokenFirst}`)
      .send(board);

    const newBoard = Generator.Board.getUnique();
    const res = await request
      .patch(`${routes.board}/${boardId}`)
      .set('authorization', `Bearer ${tokenSecond}`)
      .send(newBoard);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t update board by string id', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const { body: { data: { boardId } } } = await request
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send(board);

    const newBoard = Generator.Board.getUnique();
    const res = await request
      .patch(`${routes.board}/string_${boardId}`)
      .send(newBoard);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});
