const supertest = require('supertest');
const { app } = require('../../server');
const { Generator } = require('../../../tests/generator');
const { routes } = require('../../../tests/routes');
const { Knex } = require('../../knex');
const { Subscriber } = require('../../events/subscriber');

const knex = new Knex();
const appInstance = app.build(knex);
const request = () => supertest(appInstance);

beforeEach(async (done) => {
  jest.setTimeout(10000);
  done();
});

beforeAll(async (done) => {
  await Subscriber.subscribeOnPg();
  done();
});

afterAll(async (done) => {
  await Subscriber.unsubscribe();
  await knex.closeConnection();
  done();
});

describe('registration', () => {
  it('user can successfully register', async (done) => {
    const user = Generator.User.getUnique();
    const res = await request()
      .post(`${routes.auth}/register`)
      .send(user);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        token: expect.any(String),
        refreshToken: expect.any(String),
      }),
    }));

    done();
  });
  it('user can successfully register', async (done) => {
    const user = Generator.User.getUnique();
    const res = await request()
      .post(`${routes.auth}/register`)
      .send(user);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        token: expect.any(String),
        refreshToken: expect.any(String),
      }),
    }));

    done();
  });
  it('user can`t register with a non-unique username', async (done) => {
    const firstUser = Generator.User.getUnique();
    const secondUser = Generator.User.getUnique();
    await request()
      .post(`${routes.auth}/register`)
      .send(firstUser);
    const res = await request()
      .post(`${routes.auth}/register`)
      .send({
        ...secondUser,
        username: firstUser.username,
      });

    expect(res.statusCode).toEqual(409);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t register with a non-unique email', async (done) => {
    const firstUser = Generator.User.getUnique();
    const secondUser = Generator.User.getUnique();
    await request()
      .post(`${routes.auth}/register`)
      .send(firstUser);
    const res = await request()
      .post(`${routes.auth}/register`)
      .send({
        ...secondUser,
        email: firstUser.email,
      });

    expect(res.statusCode).toEqual(409);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t register without email', async (done) => {
    const uniqueUser = Generator.User.getUnique();
    delete uniqueUser.email;
    const res = await request()
      .post(`${routes.auth}/register`)
      .send({
        ...uniqueUser,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t register without password', async (done) => {
    const uniqueUser = Generator.User.getUnique();
    delete uniqueUser.password;
    const res = await request()
      .post(`${routes.auth}/register`)
      .send({
        ...uniqueUser,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t register without name', async (done) => {
    const uniqueUser = Generator.User.getUnique();
    delete uniqueUser.name;
    const res = await request()
      .post(`${routes.auth}/register`)
      .send({
        ...uniqueUser,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t register without surname', async (done) => {
    const uniqueUser = Generator.User.getUnique();
    delete uniqueUser.surname;
    const res = await request()
      .post(`${routes.auth}/register`)
      .send({
        ...uniqueUser,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t register without username', async (done) => {
    const uniqueUser = Generator.User.getUnique();
    delete uniqueUser.username;
    const res = await request()
      .post(`${routes.auth}/register`)
      .send({
        ...uniqueUser,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t register without username', async (done) => {
    const uniqueUser = Generator.User.getUnique();
    delete uniqueUser.username;
    const res = await request()
      .post(`${routes.auth}/register`)
      .send({
        ...uniqueUser,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t register with invalid email', async (done) => {
    const uniqueUser = Generator.User.getUnique();
    const res = await request()
      .post(`${routes.auth}/register`)
      .send({
        ...uniqueUser,
        email: Generator.User.getInvalidEmail(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t register with long email', async (done) => {
    const uniqueUser = Generator.User.getUnique();
    const res = await request()
      .post(`${routes.auth}/register`)
      .send({
        ...uniqueUser,
        email: Generator.User.getLongEmail(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t register with long username', async (done) => {
    const uniqueUser = Generator.User.getUnique();
    const res = await request()
      .post(`${routes.auth}/register`)
      .send({
        ...uniqueUser,
        username: Generator.User.getLongUsername(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t register with short username', async (done) => {
    const uniqueUser = Generator.User.getUnique();
    const res = await request()
      .post(`${routes.auth}/register`)
      .send({
        ...uniqueUser,
        username: Generator.User.getShortUsername(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t register with long name', async (done) => {
    const uniqueUser = Generator.User.getUnique();
    const res = await request()
      .post(`${routes.auth}/register`)
      .send({
        ...uniqueUser,
        name: Generator.User.getLongName(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t register with short name', async (done) => {
    const uniqueUser = Generator.User.getUnique();
    const res = await request()
      .post(`${routes.auth}/register`)
      .send({
        ...uniqueUser,
        name: Generator.User.getShortName(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('login', () => {
  it('user can successfully login with email and password', async (done) => {
    const user = Generator.User.getUnique();
    await request()
      .post(`${routes.auth}/register`)
      .send(user);
    const res = await request()
      .post(`${routes.auth}/login`)
      .send({
        email: user.email,
        password: user.password,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        token: expect.any(String),
        refreshToken: expect.any(String),
      }),
    }));

    done();
  });
  it('user can successfully login with username and password', async (done) => {
    const user = Generator.User.getUnique();
    await request()
      .post(`${routes.auth}/register`)
      .send(user);
    const res = await request()
      .post(`${routes.auth}/login`)
      .send({
        username: user.username,
        password: user.password,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        token: expect.any(String),
        refreshToken: expect.any(String),
      }),
    }));

    done();
  });
  it('user can`t login without username and email', async (done) => {
    const user = Generator.User.getUnique();
    await request()
      .post(`${routes.auth}/register`)
      .send({
        password: user.password,
      });
    const res = await request()
      .post(`${routes.auth}/login`)
      .send({
        password: user.password,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t login only with email without password', async (done) => {
    const user = Generator.User.getUnique();
    await request()
      .post(`${routes.auth}/register`)
      .send(user);
    const res = await request()
      .post(`${routes.auth}/login`)
      .send({
        email: user.email,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t login only with username without password', async (done) => {
    const user = Generator.User.getUnique();
    await request()
      .post(`${routes.auth}/register`)
      .send(user);
    const res = await request()
      .post(`${routes.auth}/login`)
      .send({
        username: user.username,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t login only with invalid password', async (done) => {
    const user = Generator.User.getUnique();
    await request()
      .post(`${routes.auth}/register`)
      .send(user);
    const res = await request()
      .post(`${routes.auth}/login`)
      .send({
        username: user.username,
        password: Generator.User.getInvalidPassword(),
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('refresh token', () => {
  it('user can successfully refresh token', async (done) => {
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
    const { refreshToken } = resLogin.body.data;

    const res = await request()
      .post(`${routes.auth}/refresh`)
      .send({
        refreshToken,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        token: expect.any(String),
        refreshToken: expect.any(String),
      }),
    }));

    done();
  });
  it('user can refresh token only once', async (done) => {
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
    const { refreshToken } = resLogin.body.data;

    await request()
      .post(`${routes.auth}/refresh`)
      .send({
        refreshToken,
      });

    const res = await request()
      .post(`${routes.auth}/refresh`)
      .send({
        refreshToken,
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t refresh tokens with invalid refresh token', async (done) => {
    const res = await request()
      .post(`${routes.auth}/refresh`)
      .send({
        refreshToken: Generator.Auth.getInvalidRefreshToken(),
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t refresh tokens without refresh token', async (done) => {
    const res = await request()
      .post(`${routes.auth}/refresh`)
      .send();

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('logout ', () => {
  it('user can successfully logout after login', async (done) => {
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
      .post(`${routes.auth}/logout`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t logout with empty authorization headers', async (done) => {
    const res = await request()
      .post(`${routes.auth}/logout`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t logout with authorization headers without Bearer', async (done) => {
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
      .post(`${routes.auth}/logout`)
      .set('authorization', token)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t logout with invalid authorization headers', async (done) => {
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
      .post(`${routes.auth}/logout`)
      .set('authorization', `Bearer ${token}_invalid`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t logout with expired authorization headers', async (done) => {
    const { token } = await Generator.Auth.getExpiredTokenPair({
      userId: 1,
      ip: 'test.test.test.test',
    });
    const res = await request()
      .post(`${routes.auth}/logout`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t refresh token after logout', async (done) => {
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
    const { token, refreshToken } = resLogin.body.data;
    await request()
      .post(`${routes.auth}/logout`)
      .set('authorization', `Bearer ${token}`)
      .send();
    const res = await request()
      .post(`${routes.auth}/refresh`)
      .send({
        refreshToken,
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
});

describe('me', () => {
  it('user can get information about himself after register', async (done) => {
    const user = Generator.User.getUnique();
    const resRegister = await request()
      .post(`${routes.auth}/register`)
      .send(user);
    const { token } = resRegister.body.data;
    const res = await request()
      .get(`${routes.auth}/me`)
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
      .get(`${routes.auth}/me`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));
    expect(res.body.data).toEqual({
      email: user.email,
      name: user.name,
      surname: user.surname,
      username: user.username,
    });

    done();
  });
  it('user can`t get information about himself with invalid token', async (done) => {
    const token = Generator.Auth.getInvalidToken();
    const res = await request()
      .get(`${routes.auth}/me`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t get information about himself with invalid signature token', async (done) => {
    const { token } = await Generator.Auth.getTokenPairWithInvalidSignature({
      userId: 1,
      ip: 'test.test.test.test',
    });
    const res = await request()
      .get(`${routes.auth}/me`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t get information about himself with expired token', async (done) => {
    const { token } = await Generator.Auth.getExpiredTokenPair({
      userId: 1,
      ip: 'test.test.test.test',
    });
    const res = await request()
      .get(`${routes.auth}/me`)
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
