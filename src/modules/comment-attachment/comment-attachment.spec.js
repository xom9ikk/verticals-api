const path = require('path');
const { build } = require('../../server');
const { Knex } = require('../../knex');
const { Subscriber } = require('../../events/subscriber');
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
  await Subscriber.subscribe();
  done();
});

afterAll(async (done) => {
  await Subscriber.unsubscribe();
  await knex.closeConnection();
  done();
});

const pathToAttachment = path.resolve('tests', 'files', 'node.jpg');

const defaultUser = Helper.configureUser({
  boards: 4,
  columns: 2,
  headings: 2,
  todos: 2,
  subTodos: 2,
  comments: 2,
});

describe('upload attachment', () => {
  it('user can successfully attach file to comment', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const comment = user.getRandomComment();

    const resAttach = await request()
      .post(`${routes.commentAttachment}/${comment.id}`)
      .set('authorization', `Bearer ${token}`)
      .attach('name', pathToAttachment);

    expect(resAttach.statusCode).toEqual(201);

    const res = await request()
      .get(`${routes.commentAttachment}`)
      .query({ commentId: comment.id })
      .set('authorization', `Bearer ${token}`)
      .send();
    expect(res.statusCode).toEqual(200);

    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        attachments: [{
          ...resAttach.body.data,
          subTodoId: null,
        }],
      }),
    }));

    done();
  });
  it('user can\'t attach file to comment without comment id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();

    const res = await request()
      .post(`${routes.commentAttachment}/`)
      .set('authorization', `Bearer ${token}`)
      .attach('name', pathToAttachment);

    expect(res.statusCode).toEqual(400);

    done();
  });
  it('user can\'t attach file to comment without access', async (done) => {
    const firstUser = await helper.createUser(defaultUser);

    const secondUser = await helper.createUser(defaultUser);
    const commentIdWithoutAccess = secondUser.getRandomCommentId();

    const res = await request()
      .post(`${routes.commentAttachment}/${commentIdWithoutAccess}`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .attach('name', pathToAttachment);

    expect(res.statusCode).toEqual(403);

    done();
  });
  it('user can\'t attach file to comment without field in form', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const commentId = user.getRandomCommentId();

    const res = await request()
      .post(`${routes.commentAttachment}/${commentId}`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(422);

    done();
  });
  it('user can\'t attach file to comment without authorization', async (done) => {
    const user = await helper.createUser(defaultUser);
    const commentId = user.getRandomCommentId();

    const res = await request()
      .post(`${routes.commentAttachment}/${commentId}`)
      .attach('name', pathToAttachment);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('remove attachment', () => {
  it('user can successfully remove attached file from comment', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const commentId = user.getRandomCommentId();

    const resAttach = await request()
      .post(`${routes.commentAttachment}/${commentId}`)
      .set('authorization', `Bearer ${token}`)
      .attach('name', pathToAttachment);

    expect(resAttach.statusCode).toEqual(201);

    const { id: attachmentId } = resAttach.body.data;

    const res = await request()
      .delete(`${routes.commentAttachment}/${attachmentId}`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);

    done();
  });
  it('user can\'t remove attached file from comment without attachment id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const commentId = user.getRandomCommentId();

    await request()
      .post(`${routes.commentAttachment}/${commentId}`)
      .set('authorization', `Bearer ${token}`)
      .attach('name', pathToAttachment);

    const res = await request()
      .delete(`${routes.commentAttachment}`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(404);

    done();
  });
  it('user can\'t remove attached file from comment without access', async (done) => {
    const firstUser = await helper.createUser(defaultUser);

    const secondUser = await helper.createUser(defaultUser);
    const commentId = secondUser.getRandomCommentId();

    const resAttach = await request()
      .post(`${routes.commentAttachment}/${commentId}`)
      .set('authorization', `Bearer ${secondUser.getToken()}`)
      .attach('name', pathToAttachment);

    const { id: attachmentIdWithoutAccess } = resAttach.body.data;
    const res = await request()
      .delete(`${routes.commentAttachment}/${attachmentIdWithoutAccess}`)
      .set('authorization', `Bearer ${firstUser.getToken()}`)
      .send();

    expect(res.statusCode).toEqual(403);

    done();
  });
  it('user can\'t remove attached file from comment without authorization', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const commentId = user.getRandomCommentId();

    const resAttach = await request()
      .post(`${routes.commentAttachment}/${commentId}`)
      .set('authorization', `Bearer ${token}`)
      .attach('name', pathToAttachment);

    const { id: attachmentIdWithoutAccess } = resAttach.body.data;

    const res = await request()
      .delete(`${routes.commentAttachment}/${attachmentIdWithoutAccess}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('get all attachments', () => {
  it('user can successfully gets all attachments to which he has access', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const [firstCommentId, secondCommentId] = user.getCommentIds();

    const secondUser = await helper.createUser(defaultUser);
    const secondUserToken = secondUser.getToken();
    const commentIdWithoutAccess = user.getRandomCommentId();

    await request()
      .post(`${routes.commentAttachment}/${firstCommentId}`)
      .set('authorization', `Bearer ${token}`)
      .attach('name', pathToAttachment);

    await request()
      .post(`${routes.commentAttachment}/${secondCommentId}`)
      .set('authorization', `Bearer ${token}`)
      .attach('name', pathToAttachment);

    await request()
      .post(`${routes.commentAttachment}/${commentIdWithoutAccess}`)
      .set('authorization', `Bearer ${secondUserToken}`)
      .attach('name', pathToAttachment);

    const res = await request()
      .get(`${routes.commentAttachment}/`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: {
        attachments: expect.arrayContaining([expect.objectContaining({
          commentId: firstCommentId,
        }), expect.objectContaining({
          commentId: secondCommentId,
        })]),
      },
    }));

    done();
  });
  it('user can successfully gets all attachments to which he has access by board id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const [firstBoardId, secondBoardId] = user.getBoardIds();
    const commentIdFromFirstBoard = user.getRandomCommentIdFromBoard(firstBoardId);
    const commentIdFromSecondBoard = user.getRandomCommentIdFromBoard(secondBoardId);

    const secondUser = await helper.createUser(defaultUser);
    const secondUserToken = secondUser.getToken();
    const commentIdWithoutAccess = user.getRandomCommentId();

    await request()
      .post(`${routes.commentAttachment}/${commentIdFromFirstBoard}`)
      .set('authorization', `Bearer ${token}`)
      .attach('name', pathToAttachment);

    await request()
      .post(`${routes.commentAttachment}/${commentIdFromSecondBoard}`)
      .set('authorization', `Bearer ${token}`)
      .attach('name', pathToAttachment);

    await request()
      .post(`${routes.commentAttachment}/${commentIdWithoutAccess}`)
      .set('authorization', `Bearer ${secondUserToken}`)
      .attach('name', pathToAttachment);

    const res = await request()
      .get(`${routes.commentAttachment}/`)
      .set('authorization', `Bearer ${token}`)
      .query({ boardId: firstBoardId })
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: {
        attachments: expect.arrayContaining([expect.objectContaining({
          commentId: commentIdFromFirstBoard,
        })]),
      },
    }));

    done();
  });
  it('user can successfully gets all attachments to which he has access by column id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const [firstBoardId, secondBoardId] = user.getBoardIds();

    const columnFromFirstBoard = user.getRandomColumnFromBoard(firstBoardId);
    const columnIdFromFirstBoard = columnFromFirstBoard.id;

    const commentIdFromFirstBoard = columnFromFirstBoard.getRandomCommentId();
    const commentIdFromSecondBoard = user.getRandomCommentIdFromBoard(secondBoardId);

    await request()
      .post(`${routes.commentAttachment}/${commentIdFromFirstBoard}`)
      .set('authorization', `Bearer ${token}`)
      .attach('name', pathToAttachment);

    await request()
      .post(`${routes.commentAttachment}/${commentIdFromFirstBoard}`)
      .set('authorization', `Bearer ${token}`)
      .attach('name', pathToAttachment);

    await request()
      .post(`${routes.commentAttachment}/${commentIdFromSecondBoard}`)
      .set('authorization', `Bearer ${token}`)
      .attach('name', pathToAttachment);

    const res = await request()
      .get(`${routes.commentAttachment}/`)
      .set('authorization', `Bearer ${token}`)
      .query({ columnId: columnIdFromFirstBoard })
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: {
        attachments: expect.arrayContaining([expect.objectContaining({
          commentId: commentIdFromFirstBoard,
        }), expect.objectContaining({
          commentId: commentIdFromFirstBoard,
        })]),
      },
    }));

    done();
  });
  it('user can successfully gets all attachments to which he has access by todo id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const [firstBoardId, secondBoardId] = user.getBoardIds();

    const todoFromFirstBoard = user.getRandomTodoFromBoard(firstBoardId);
    const todoIdFromFirstBoard = todoFromFirstBoard.id;

    const commentIdFromFirstBoard = todoFromFirstBoard.getRandomComment().id;
    const commentIdFromSecondBoard = user.getRandomCommentIdFromBoard(secondBoardId);

    await request()
      .post(`${routes.commentAttachment}/${commentIdFromFirstBoard}`)
      .set('authorization', `Bearer ${token}`)
      .attach('name', pathToAttachment);

    await request()
      .post(`${routes.commentAttachment}/${commentIdFromFirstBoard}`)
      .set('authorization', `Bearer ${token}`)
      .attach('name', pathToAttachment);

    await request()
      .post(`${routes.commentAttachment}/${commentIdFromSecondBoard}`)
      .set('authorization', `Bearer ${token}`)
      .attach('name', pathToAttachment);

    const res = await request()
      .get(`${routes.commentAttachment}/`)
      .set('authorization', `Bearer ${token}`)
      .query({ todoId: todoIdFromFirstBoard })
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: {
        attachments: expect.arrayContaining([expect.objectContaining({
          commentId: commentIdFromFirstBoard,
        }), expect.objectContaining({
          commentId: commentIdFromFirstBoard,
        })]),
      },
    }));

    done();
  });
  it('user can successfully gets all attachments to which he has access by sub todo id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const [firstBoardId, secondBoardId] = user.getBoardIds();

    const subTodoFromFirstBoard = user.getRandomSubTodoFromBoard(firstBoardId);
    const subTodoIdFromFirstBoard = subTodoFromFirstBoard.id;

    const commentIdFromFirstBoard = subTodoFromFirstBoard.getRandomComment().id;
    const commentIdFromSecondBoard = user.getRandomCommentIdFromBoard(secondBoardId);

    await request()
      .post(`${routes.commentAttachment}/${commentIdFromFirstBoard}`)
      .set('authorization', `Bearer ${token}`)
      .attach('name', pathToAttachment);

    await request()
      .post(`${routes.commentAttachment}/${commentIdFromFirstBoard}`)
      .set('authorization', `Bearer ${token}`)
      .attach('name', pathToAttachment);

    await request()
      .post(`${routes.commentAttachment}/${commentIdFromSecondBoard}`)
      .set('authorization', `Bearer ${token}`)
      .attach('name', pathToAttachment);

    const res = await request()
      .get(`${routes.commentAttachment}/`)
      .set('authorization', `Bearer ${token}`)
      .query({ subTodoId: subTodoIdFromFirstBoard })
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: {
        attachments: expect.arrayContaining([expect.objectContaining({
          commentId: commentIdFromFirstBoard,
        }), expect.objectContaining({
          commentId: commentIdFromFirstBoard,
        })]),
      },
    }));

    done();
  });
});
