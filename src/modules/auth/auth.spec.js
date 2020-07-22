const supertest = require('supertest');
const { UserMock, AuthMock } = require('../../../tests/data');
const app = require('../../server');

const request = supertest(app);
const baseRoute = '/api/v1/auth';

afterAll(async (done) => {
  await knex.destroy();
  done();
});

describe('registration', () => {
  it('user can successfully register', async (done) => {
    const user = UserMock.get();
    const res = await request
      .post(`${baseRoute}/register`)
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
    const uniqueUser = UserMock.getUnique();
    const user = UserMock.get();
    const res = await request
      .post(`${baseRoute}/register`)
      .send({
        ...uniqueUser,
        username: user.username,
      });

    expect(res.statusCode).toEqual(409);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t register with a non-unique email', async (done) => {
    const uniqueUser = UserMock.getUnique();
    const user = UserMock.get();
    const res = await request
      .post(`${baseRoute}/register`)
      .send({
        ...uniqueUser,
        email: user.email,
      });

    expect(res.statusCode).toEqual(409);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t register without email', async (done) => {
    const uniqueUser = UserMock.getUnique();
    delete uniqueUser.email;
    const res = await request
      .post(`${baseRoute}/register`)
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
    const uniqueUser = UserMock.getUnique();
    delete uniqueUser.password;
    const res = await request
      .post(`${baseRoute}/register`)
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
    const uniqueUser = UserMock.getUnique();
    delete uniqueUser.name;
    const res = await request
      .post(`${baseRoute}/register`)
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
    const uniqueUser = UserMock.getUnique();
    delete uniqueUser.surname;
    const res = await request
      .post(`${baseRoute}/register`)
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
    const uniqueUser = UserMock.getUnique();
    delete uniqueUser.username;
    const res = await request
      .post(`${baseRoute}/register`)
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
    const uniqueUser = UserMock.getUnique();
    delete uniqueUser.username;
    const res = await request
      .post(`${baseRoute}/register`)
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
    const uniqueUser = UserMock.getUnique();
    const res = await request
      .post(`${baseRoute}/register`)
      .send({
        ...uniqueUser,
        email: UserMock.getInvalidEmail(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t register with long email', async (done) => {
    const uniqueUser = UserMock.getUnique();
    const res = await request
      .post(`${baseRoute}/register`)
      .send({
        ...uniqueUser,
        email: UserMock.getLongEmail(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t register with long username', async (done) => {
    const uniqueUser = UserMock.getUnique();
    const res = await request
      .post(`${baseRoute}/register`)
      .send({
        ...uniqueUser,
        username: UserMock.getLongUsername(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t register with short username', async (done) => {
    const uniqueUser = UserMock.getUnique();
    const res = await request
      .post(`${baseRoute}/register`)
      .send({
        ...uniqueUser,
        username: UserMock.getShortUsername(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t register with long name', async (done) => {
    const uniqueUser = UserMock.getUnique();
    const res = await request
      .post(`${baseRoute}/register`)
      .send({
        ...uniqueUser,
        name: UserMock.getLongName(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t register with short name', async (done) => {
    const uniqueUser = UserMock.getUnique();
    const res = await request
      .post(`${baseRoute}/register`)
      .send({
        ...uniqueUser,
        name: UserMock.getShortName(),
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
    const user = UserMock.getUnique();
    await request
      .post(`${baseRoute}/register`)
      .send(user);
    const res = await request
      .post(`${baseRoute}/login`)
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
    const user = UserMock.getUnique();
    await request
      .post(`${baseRoute}/register`)
      .send(user);
    const res = await request
      .post(`${baseRoute}/login`)
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
    const user = UserMock.getUnique();
    await request
      .post(`${baseRoute}/register`)
      .send({
        password: user.password,
      });
    const res = await request
      .post(`${baseRoute}/login`)
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
    const user = UserMock.getUnique();
    await request
      .post(`${baseRoute}/register`)
      .send(user);
    const res = await request
      .post(`${baseRoute}/login`)
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
    const user = UserMock.getUnique();
    await request
      .post(`${baseRoute}/register`)
      .send(user);
    const res = await request
      .post(`${baseRoute}/login`)
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
    const user = UserMock.getUnique();
    await request
      .post(`${baseRoute}/register`)
      .send(user);
    const res = await request
      .post(`${baseRoute}/login`)
      .send({
        username: user.username,
        password: UserMock.getInvalidPassword(),
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
    const user = UserMock.getUnique();
    await request
      .post(`${baseRoute}/register`)
      .send(user);
    const resLogin = await request
      .post(`${baseRoute}/login`)
      .send({
        email: user.email,
        password: user.password,
      });
    const { refreshToken } = resLogin.body.data;

    const res = await request
      .post(`${baseRoute}/refresh`)
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
    const user = UserMock.getUnique();
    await request
      .post(`${baseRoute}/register`)
      .send(user);
    const resLogin = await request
      .post(`${baseRoute}/login`)
      .send({
        email: user.email,
        password: user.password,
      });
    const { refreshToken } = resLogin.body.data;

    const resFirst = await request
      .post(`${baseRoute}/refresh`)
      .send({
        refreshToken,
      });

    const res = await request
      .post(`${baseRoute}/refresh`)
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
    const res = await request
      .post(`${baseRoute}/refresh`)
      .send({
        refreshToken: AuthMock.getInvalidRefreshToken(),
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t refresh tokens without refresh token', async (done) => {
    const res = await request
      .post(`${baseRoute}/refresh`)
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
    const user = UserMock.getUnique();
    await request
      .post(`${baseRoute}/register`)
      .send(user);
    const resLogin = await request
      .post(`${baseRoute}/login`)
      .send({
        email: user.email,
        password: user.password,
      });
    const { token } = resLogin.body.data;
    const res = await request
      .post(`${baseRoute}/logout`)
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
    const res = await request
      .post(`${baseRoute}/logout`)
      .send();

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.any(Object),
    }));

    done();
  });
  it('user can`t logout with authorization headers without Bearer', async (done) => {
    const user = UserMock.getUnique();
    await request
      .post(`${baseRoute}/register`)
      .send(user);
    const resLogin = await request
      .post(`${baseRoute}/login`)
      .send({
        email: user.email,
        password: user.password,
      });
    const { token } = resLogin.body.data;
    const res = await request
      .post(`${baseRoute}/logout`)
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
    const user = UserMock.getUnique();
    await request
      .post(`${baseRoute}/register`)
      .send(user);
    const resLogin = await request
      .post(`${baseRoute}/login`)
      .send({
        email: user.email,
        password: user.password,
      });
    const { token } = resLogin.body.data;
    const res = await request
      .post(`${baseRoute}/logout`)
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
    const { token } = await AuthMock.getExpiredTokenPair({
      userId: 1,
      ip: 'test.test.test.test',
    });
    const res = await request
      .post(`${baseRoute}/logout`)
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
    const user = UserMock.getUnique();
    await request
      .post(`${baseRoute}/register`)
      .send(user);
    const resLogin = await request
      .post(`${baseRoute}/login`)
      .send({
        email: user.email,
        password: user.password,
      });
    const { token, refreshToken } = resLogin.body.data;
    await request
      .post(`${baseRoute}/logout`)
      .set('authorization', `Bearer ${token}`)
      .send();
    const res = await request
      .post(`${baseRoute}/refresh`)
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
    const user = UserMock.getUnique();
    const resRegister = await request
      .post(`${baseRoute}/register`)
      .send(user);
    const { token } = resRegister.body.data;
    const res = await request
      .get(`${baseRoute}/me`)
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
    const user = UserMock.getUnique();
    await request
      .post(`${baseRoute}/register`)
      .send(user);
    const resLogin = await request
      .post(`${baseRoute}/login`)
      .send({
        email: user.email,
        password: user.password,
      });
    const { token } = resLogin.body.data;
    const res = await request
      .get(`${baseRoute}/me`)
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
    const token = AuthMock.getInvalidToken();
    const res = await request
      .get(`${baseRoute}/me`)
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
    const { token } = await AuthMock.getTokenPairWithInvalidSignature({
      userId: 1,
      ip: 'test.test.test.test',
    });
    const res = await request
      .get(`${baseRoute}/me`)
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
    const { token } = await AuthMock.getExpiredTokenPair({
      userId: 1,
      ip: 'test.test.test.test',
    });
    const res = await request
      .get(`${baseRoute}/me`)
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
