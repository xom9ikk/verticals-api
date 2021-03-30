const path = require('path');
const { build } = require('../../server');
const { Knex } = require('../../knex');
const { Generator } = require('../../../tests/generator');
const { routes } = require('../../../tests/routes');
const { FastifyRequest } = require('../../../tests/request');

let knex;
let app;

const request = () => new FastifyRequest(app);

beforeAll(async (done) => {
  knex = new Knex();
  app = build(knex);
  done();
});

afterAll(async (done) => {
  await knex.closeConnection();
  done();
});

const pathToAvatar = path.resolve('tests', 'files', 'node.jpg');

describe('me', () => {
  it('user can get information about himself after register', async (done) => {
    const user = Generator.User.getUnique();
    const resRegister = await request()
      .post(`${routes.auth}/register`)
      .send(user);
    const { token } = resRegister.body.data;
    const res = await request()
      .get(`${routes.user}/me`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        email: expect.any(String),
        name: expect.any(String),
        surname: expect.any(String),
        username: expect.any(String),
      }),
    }));

    done();
  });
  it('user can get information about himself after login', async (done) => {
    const user = Generator.User.getUnique();
    await request()
      .post(`${routes.auth}/register`)
      .send(user);
    const resLogin = await request()
      .post(`${routes.auth}/login`)
      .send({
        email: user.email,
        password: user.password,
      });
    const { token } = resLogin.body.data;
    const res = await request()
      .get(`${routes.user}/me`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));
    expect(res.body.data).toEqual({
      avatar: null,
      bio: null,
      email: user.email,
      name: user.name,
      surname: user.surname,
      username: user.username,
    });

    done();
  });
  it('user can\'t get information about himself with invalid token', async (done) => {
    const token = Generator.Auth.getInvalidToken();
    const res = await request()
      .get(`${routes.user}/me`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t get information about himself with invalid signature token', async (done) => {
    const { token } = await Generator.Auth.getTokenPairWithInvalidSignature({
      userId: 1,
      ip: 'test.test.test.test',
    });
    const res = await request()
      .get(`${routes.user}/me`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can\'t get information about himself with expired token', async (done) => {
    const { token } = await Generator.Auth.getExpiredTokenPair(1);
    const res = await request()
      .get(`${routes.user}/me`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('update', () => {
  it('user can update information about himself', async (done) => {
    const user = Generator.User.getUnique();

    const resRegister = await request()
      .post(`${routes.auth}/register`)
      .send(user);

    const { token } = resRegister.body.data;

    const newUserData = Generator.User.getUnique();

    const res = await request()
      .patch(`${routes.user}/`)
      .set('authorization', `Bearer ${token}`)
      .send(newUserData);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('avatar', () => {
  it('user can upload avatar', async (done) => {
    const user = Generator.User.getUnique();

    const resRegister = await request()
      .post(`${routes.auth}/register`)
      .send(user);

    const { token } = resRegister.body.data;

    const res = await request()
      .post(`${routes.user}/avatar`)
      .set('authorization', `Bearer ${token}`)
      .attach('avatar', pathToAvatar);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can remove avatar', async (done) => {
    const user = Generator.User.getUnique();

    const resRegister = await request()
      .post(`${routes.auth}/register`)
      .send(user);

    const { token } = resRegister.body.data;

    await request()
      .post(`${routes.user}/avatar`)
      .set('authorization', `Bearer ${token}`)
      .attach('avatar', pathToAvatar);

    const res = await request()
      .delete(`${routes.user}/avatar`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});
