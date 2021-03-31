const { build } = require('../../server');
const { Knex } = require('../../knex');
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
  todos: 2,
  comments: 2,
});

describe('likes', () => {
  it('user can successfully like comment', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const commentId = user.getRandomCommentId();

    const res = await request()
      .post(`${routes.commentLike}`)
      .set('authorization', `Bearer ${token}`)
      .send({ commentId });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: {},
    }));

    done();
  });
  it('user can successfully unlike comment', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const commentId = user.getRandomCommentId();

    await request()
      .post(`${routes.commentLike}`)
      .set('authorization', `Bearer ${token}`)
      .send({ commentId });

    const resUnlike = await request()
      .delete(`${routes.commentLike}/${commentId}`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(resUnlike.statusCode).toEqual(200);
    expect(resUnlike.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: {},
    }));

    done();
  });
  it('user can\'t like comment where comment doesn\'t exist', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();

    const resLike = await request()
      .post(`${routes.commentLike}`)
      .set('authorization', `Bearer ${token}`)
      .send({ commentId: 999999999 });

    expect(resLike.statusCode).toEqual(403);
    expect(resLike.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: {},
    }));

    done();
  });
  it('user can\'t like comment twice', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const commentId = user.getRandomCommentId();

    await request()
      .post(`${routes.commentLike}`)
      .set('authorization', `Bearer ${token}`)
      .send({ commentId });

    const resSecondLike = await request()
      .post(`${routes.commentLike}`)
      .set('authorization', `Bearer ${token}`)
      .send({ commentId });

    expect(resSecondLike.statusCode).toEqual(400);
    expect(resSecondLike.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: {},
    }));

    done();
  });
  it('user can\'t unlike comment where comment doesn\'t exist', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();

    const resUnlike = await request()
      .delete(`${routes.commentLike}/${999999999}`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(resUnlike.statusCode).toEqual(403);
    expect(resUnlike.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: {},
    }));

    done();
  });
  it('user can\'t unlike comment where comment like doesn\'t exist', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();
    const commentId = user.getRandomCommentId();

    const resUnlike = await request()
      .delete(`${routes.commentLike}/${commentId}`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(resUnlike.statusCode).toEqual(400);
    expect(resUnlike.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: {},
    }));

    done();
  });
});
