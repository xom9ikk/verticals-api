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

describe('create', () => {
  it('user can successfully create board with all fields', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const res = await request()
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
    const res = await request()
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
    const res = await request()
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
  it('user can successfully create board without all non-required fields', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    delete board.description;
    delete board.color;
    delete board.cardType;
    const res = await request()
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
  it('user can successfully create board with belowId', async (done) => {
    const { token } = await helper.createUser();

    const firstBoard = Generator.Board.getUnique();
    const firstRes = await request()
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send(firstBoard);

    const secondBoard = Generator.Board.getUnique();
    const secondRes = await request()
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send(secondBoard);

    const firstBoardId = firstRes.body.data.boardId;
    const secondBoardId = secondRes.body.data.boardId;

    const thirdBoard = Generator.Board.getUnique();
    const thirdRes = await request()
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send({
        ...thirdBoard,
        belowId: firstBoardId,
      });
    const thirdBoardId = thirdRes.body.data.boardId;

    const resBoards = await request()
      .get(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(resBoards.statusCode).toEqual(200);
    expect(resBoards.body.data.boards.positions).toEqual(
      [expect.any(Number), firstBoardId, thirdBoardId, secondBoardId],
    );

    done();
  });
  it('user can\'t create board without authorization', async (done) => {
    const board = Generator.Board.getUnique();
    const res = await request()
      .post(`${routes.board}/`)
      .send(board);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t create board without title', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    delete board.title;
    const res = await request()
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
  it('user can\'t create board with empty title', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const res = await request()
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
  it('user can\'t create board with long title', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const res = await request()
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
  it('user can\'t create board with negative card type', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const res = await request()
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
  it('user can\'t create board with string card type', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const res = await request()
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
  it('user can\'t create board with card type which is not included in the enum', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const res = await request()
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
  it('user can\'t create board with negative color', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const res = await request()
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
  it('user can\'t create board with string color', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const res = await request()
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
  it('user can\'t create board with color which is not included in the enum', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const res = await request()
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
  it('user can\'t create board with belowId without access', async (done) => {
    const { token: firstUserToken } = await helper.createUser();
    const { token: secondUserToken } = await helper.createUser();

    const firstBoard = Generator.Board.getUnique();
    const firstRes = await request()
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${firstUserToken}`)
      .send(firstBoard);

    const secondBoard = Generator.Board.getUnique();
    await request()
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${firstUserToken}`)
      .send(secondBoard);

    const firstBoardIdWithoutAccess = firstRes.body.data.boardId;

    const thirdBoard = Generator.Board.getUnique();
    const thirdRes = await request()
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${secondUserToken}`)
      .send({
        ...thirdBoard,
        belowId: firstBoardIdWithoutAccess,
      });

    expect(thirdRes.statusCode).toEqual(403);
    expect(thirdRes.body).toEqual(expect.objectContaining({
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
    const { body: { data: { boardId } } } = await request()
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send(board);

    const res = await request()
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
      position: expect.any(Number),
      ...board,
    });

    done();
  });
  it('user can\'t get board without authorization header', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const { body: { data: { boardId } } } = await request()
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send(board);

    const res = await request()
      .get(`${routes.board}/${boardId}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t access to the board if he does not have access to it', async (done) => {
    const { token: tokenFirst } = await helper.createUser();
    const { token: tokenSecond } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const { body: { data: { boardId } } } = await request()
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${tokenFirst}`)
      .send(board);

    const res = await request()
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
  it('user can\'t access to the board by string id', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const { body: { data: { boardId } } } = await request()
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send(board);

    const res = await request()
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
    await request()
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${tokenFirst}`)
      .send(boardOne);

    const boardTwo = Generator.Board.getUnique();
    const { body: { data: { boardId: boardIdTwo } } } = await request()
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${tokenSecond}`)
      .send(boardTwo);

    const boardThree = Generator.Board.getUnique();
    const { body: { data: { boardId: boardIdThree } } } = await request()
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${tokenSecond}`)
      .send(boardThree);

    const res = await request()
      .get(`${routes.board}/`)
      .set('authorization', `Bearer ${tokenSecond}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    const { boards } = res.body.data;

    expect(boards).toEqual({
      entities: [
        expect.any(Object),
        {
          id: boardIdTwo,
          ...boardTwo,
        }, {
          id: boardIdThree,
          ...boardThree,
        },
      ],
      positions: [expect.any(Number), boardIdTwo, boardIdThree],
    });

    done();
  });
  it('user can successfully get empty list of boards after deleting', async (done) => {
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
      .get(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const { boards } = res.body.data;

    expect(boards).toEqual({
      entities: [],
      positions: [],
    });

    done();
  });
  it('user can\'t get all boards without authorization header', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const { body: { data: { boardId } } } = await request()
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send(board);

    const res = await request()
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
    const { body: { data: { boardId } } } = await request()
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send(board);

    const res = await request()
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
  it('user can\'t remove board without authorization header', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const { body: { data: { boardId } } } = await request()
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send(board);

    const res = await request()
      .delete(`${routes.board}/${boardId}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t remove board if he does not have access to it', async (done) => {
    const { token: tokenFirst } = await helper.createUser();
    const { token: tokenSecond } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const { body: { data: { boardId } } } = await request()
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${tokenFirst}`)
      .send(board);

    const res = await request()
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
  it('user can\'t remove board by string id', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const { body: { data: { boardId } } } = await request()
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send(board);

    const res = await request()
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
    const { body: { data: { boardId } } } = await request()
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send(board);

    const newBoard = Generator.Board.getUnique();
    const resUpdate = await request()
      .patch(`${routes.board}/${boardId}`)
      .set('authorization', `Bearer ${token}`)
      .send(newBoard);

    const res = await request()
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
      position: expect.any(Number),
      ...newBoard,
    });

    done();
  });
  it('user can\'t update board without authorization header', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const { body: { data: { boardId } } } = await request()
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send(board);

    const newBoard = Generator.Board.getUnique();
    const res = await request()
      .patch(`${routes.board}/${boardId}`)
      .send(newBoard);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t update board if he does not have access to it', async (done) => {
    const { token: tokenFirst } = await helper.createUser();
    const { token: tokenSecond } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const { body: { data: { boardId } } } = await request()
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${tokenFirst}`)
      .send(board);

    const newBoard = Generator.Board.getUnique();
    const res = await request()
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
  it('user can\'t update board by string id', async (done) => {
    const { token } = await helper.createUser();

    const board = Generator.Board.getUnique();
    const { body: { data: { boardId } } } = await request()
      .post(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send(board);

    const newBoard = Generator.Board.getUnique();
    const res = await request()
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

describe('update position', () => {
  it('user can successfully update position', async (done) => {
    const { token } = await helper.createUser();
    await helper.createBoards({
      token,
      boards: [{
        title: 'default-board-1',
      }, {
        title: 'default-board-2',
      }, {
        title: 'default-board-3',
      }, {
        title: 'default-board-4',
      }, {
        title: 'default-board-5',
      }, {
        title: 'default-board-6',
      }],
    });

    const resBoardsBeforeUpdate = await request()
      .get(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    await request()
      .patch(`${routes.board}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        sourcePosition: 1,
        destinationPosition: 4,
      });

    const resBoardsAfterUpdate = await request()
      .get(`${routes.board}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    const beforePositions = resBoardsBeforeUpdate.body.data.boards.positions;
    const afterPositions = resBoardsAfterUpdate.body.data.boards.positions;

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
  it('user can\'t update position with wrong source position', async (done) => {
    const { token } = await helper.createUser();
    await helper.createBoards({
      token,
      boards: [{
        title: 'default-board-1',
      }, {
        title: 'default-board-2',
      }, {
        title: 'default-board-3',
      }, {
        title: 'default-board-4',
      }, {
        title: 'default-board-5',
      }, {
        title: 'default-board-6',
      }],
    });

    const res = await request()
      .patch(`${routes.board}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
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
    const { token } = await helper.createUser();
    await helper.createBoards({
      token,
      boards: [{
        title: 'default-board-1',
      }, {
        title: 'default-board-2',
      }, {
        title: 'default-board-3',
      }, {
        title: 'default-board-4',
      }, {
        title: 'default-board-5',
      }, {
        title: 'default-board-5',
      }],
    });

    const res = await request()
      .patch(`${routes.board}/position`)
      .set('authorization', `Bearer ${token}`)
      .send({
        sourcePosition: 1,
        destinationPosition: 7,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});
