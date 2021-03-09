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

const defaultUser = {
  boards: [{
    title: 'default-board-1',
    columns: [{
      title: 'default-column-1',
      todos: [{
        title: 'default-todo-1',
        comments: [{
          text: 'comment-1',
        }, {
          text: 'comment-2',
        }],
      }, {
        title: 'default-todo-2',
        comments: [{
          text: 'comment-3',
        }, {
          text: 'comment-4',
        }],
      }],
    }, {
      title: 'default-column-2',
      todos: [{
        title: 'default-todo-3',
        comments: [{
          text: 'comment-5',
        }, {
          text: 'comment-6',
        }],
      }, {
        title: 'default-todo-4',
        comments: [{
          text: 'comment-7',
        }, {
          text: 'comment-8',
        }],
      }, {
        title: 'default-todo-5',
        comments: [{
          text: 'comment-9',
        }, {
          text: 'comment-10',
        }],
      }],
    }],
  }, {
    title: 'default-board-2',
    columns: [{
      title: 'default-column-3',
      todos: [{
        title: 'default-todo-6',
        comments: [{
          text: 'comment-11',
        }, {
          text: 'comment-12',
        }],
      }, {
        title: 'default-todo-7',
        comments: [{
          text: 'comment-13',
        }, {
          text: 'comment-14',
        }],
      }, {
        title: 'default-todo-8',
        comments: [{
          text: 'comment-15',
        }, {
          text: 'comment-16',
        }],
      }],
    }, {
      title: 'default-column-4',
      todos: [{
        title: 'default-todo-9',
        comments: [{
          text: 'comment-17',
        }, {
          text: 'comment-18',
        }],
      }, {
        title: 'default-todo-10',
        comments: [{
          text: 'comment-19',
        }, {
          text: 'comment-20',
        }],
      }, {
        title: 'default-todo-11',
        comments: [{
          text: 'comment-21',
        }, {
          text: 'comment-22',
        }],
      }],
    }],
  }, {
    title: 'default-board-3',
    columns: [{
      title: 'default-column-5',
      todos: [{
        title: 'default-todo-12',
        comments: [{
          text: 'comment-23',
        }, {
          text: 'comment-24',
        }],
      }, {
        title: 'default-todo-13',
        comments: [{
          text: 'comment-25',
        }, {
          text: 'comment-26',
        }],
      }, {
        title: 'default-todo-14',
        comments: [{
          text: 'comment-27',
        }, {
          text: 'comment-28',
        }],
      }],
    }, {
      title: 'default-column-6',
      todos: [{
        title: 'default-todo-15',
        comments: [{
          text: 'comment-29',
        }, {
          text: 'comment-30',
        }],
      }, {
        title: 'default-todo-16',
        comments: [{
          text: 'comment-31',
        }, {
          text: 'comment-32',
        }],
      }, {
        title: 'default-todo-17',
        comments: [{
          text: 'comment-33',
        }, {
          text: 'comment-34',
        }],
      }],
    }],
  }, {
    title: 'default-board-4',
    columns: [{
      title: 'default-column-7',
      todos: [{
        title: 'default-todo-18',
        comments: [{
          text: 'comment-35',
        }, {
          text: 'comment-36',
        }],
      }, {
        title: 'default-todo-19',
        comments: [{
          text: 'comment-37',
        }, {
          text: 'comment-38',
        }],
      }, {
        title: 'default-todo-20',
        comments: [{
          text: 'comment-39',
        }, {
          text: 'comment-40',
        }],
      }],
    }, {
      title: 'default-column-8',
      todos: [{
        title: 'default-todo-21',
        comments: [{
          text: 'comment-41',
        }, {
          text: 'comment-42',
        }],
      }, {
        title: 'default-todo-22',
        comments: [{
          text: 'comment-43',
        }, {
          text: 'comment-44',
        }],
      }, {
        title: 'default-todo-23',
        comments: [{
          text: 'comment-45',
        }, {
          text: 'comment-46',
        }],
      }],
    }],
  }],
};

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
      .send({ commentId });

    expect(resUnlike.statusCode).toEqual(200);
    expect(resUnlike.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: {},
    }));

    done();
  });
});
