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

const defaultUser = {
  boards: [{
    title: 'default-board-1',
    columns: [{
      title: 'default-column-1',
      headings: [{
        title: 'default-heading-1',
        todos: [{
          title: 'todo-1',
          comments: [{
            text: 'comment-1',
          }, {
            text: 'comment-2',
          }],
        }, {
          title: 'todo-2',
          comments: [{
            text: 'comment-3',
          }, {
            text: 'comment-4',
          }],
        }],
      }, {
        title: 'default-heading-2',
        todos: [{
          title: 'todo-3',
          comments: [{
            text: 'comment-5',
          }, {
            text: 'comment-6',
          }],
        }, {
          title: 'todo-4',
          comments: [{
            text: 'comment-7',
          }, {
            text: 'comment-8',
          }],
        }],
      }],
    }, {
      title: 'default-column-2',
      headings: [{
        title: 'default-heading-3',
        todos: [{
          title: 'todo-5',
          comments: [{
            text: 'comment-9',
          }, {
            text: 'comment-10',
          }],
        }, {
          title: 'todo-6',
          comments: [{
            text: 'comment-11',
          }, {
            text: 'comment-12',
          }],
        }],
      }, {
        title: 'default-heading-4',
        todos: [{
          title: 'todo-7',
          comments: [{
            text: 'comment-13',
          }, {
            text: 'comment-14',
          }],
        }, {
          title: 'todo-8',
          comments: [{
            text: 'comment-15',
          }, {
            text: 'comment-16',
          }],
        }],
      }, {
        title: 'default-heading-5',
        todos: [{
          title: 'todo-9',
          comments: [{
            text: 'comment-17',
          }, {
            text: 'comment-18',
          }],
        }, {
          title: 'todo-10',
          comments: [{
            text: 'comment-19',
          }, {
            text: 'comment-20',
          }],
        }],
      }],
    }],
  }, {
    title: 'default-board-2',
    columns: [{
      title: 'default-column-3',
      headings: [{
        title: 'default-heading-6',
        todos: [{
          title: 'todo-11',
          comments: [{
            text: 'comment-21',
          }, {
            text: 'comment-22',
          }],
        }, {
          title: 'todo-12',
          comments: [{
            text: 'comment-23',
          }, {
            text: 'comment-24',
          }],
        }],
      }, {
        title: 'default-heading-7',
        todos: [{
          title: 'todo-13',
          comments: [{
            text: 'comment-25',
          }, {
            text: 'comment-26',
          }],
        }, {
          title: 'todo-14',
          comments: [{
            text: 'comment-27',
          }, {
            text: 'comment-28',
          }],
        }],
      }, {
        title: 'default-heading-8',
        todos: [{
          title: 'todo-15',
          comments: [{
            text: 'comment-29',
          }, {
            text: 'comment-30',
          }],
        }, {
          title: 'todo-16',
          comments: [{
            text: 'comment-31',
          }, {
            text: 'comment-32',
          }],
        }],
      }],
    }, {
      title: 'default-column-4',
      headings: [{
        title: 'default-heading-9',
        todos: [{
          title: 'todo-17',
          comments: [{
            text: 'comment-33',
          }, {
            text: 'comment-34',
          }],
        }, {
          title: 'todo-18',
          comments: [{
            text: 'comment-35',
          }, {
            text: 'comment-36',
          }],
        }],
      }, {
        title: 'default-heading-10',
        todos: [{
          title: 'todo-19',
          comments: [{
            text: 'comment-37',
          }, {
            text: 'comment-38',
          }],
        }, {
          title: 'todo-20',
          comments: [{
            text: 'comment-39',
          }, {
            text: 'comment-40',
          }],
        }],
      }, {
        title: 'default-heading-11',
        todos: [{
          title: 'todo-21',
          comments: [{
            text: 'comment-41',
          }, {
            text: 'comment-42',
          }],
        }, {
          title: 'todo-22',
          comments: [{
            text: 'comment-43',
          }, {
            text: 'comment-44',
          }],
        }],
      }],
    }],
  }, {
    title: 'default-board-3',
    columns: [{
      title: 'default-column-5',
      headings: [{
        title: 'default-heading-12',
        todos: [{
          title: 'todo-23',
          comments: [{
            text: 'comment-45',
          }, {
            text: 'comment-46',
          }],
        }, {
          title: 'todo-24',
          comments: [{
            text: 'comment-47',
          }, {
            text: 'comment-48',
          }],
        }],
      }, {
        title: 'default-heading-13',
        todos: [{
          title: 'todo-25',
          comments: [{
            text: 'comment-49',
          }, {
            text: 'comment-50',
          }],
        }, {
          title: 'todo-26',
          comments: [{
            text: 'comment-51',
          }, {
            text: 'comment-52',
          }],
        }],
      }, {
        title: 'default-heading-14',
        todos: [{
          title: 'todo-27',
          comments: [{
            text: 'comment-53',
          }, {
            text: 'comment-54',
          }],
        }, {
          title: 'todo-28',
          comments: [{
            text: 'comment-55',
          }, {
            text: 'comment-56',
          }],
        }],
      }],
    }, {
      title: 'default-column-6',
      headings: [{
        title: 'default-heading-15',
        todos: [{
          title: 'todo-29',
          comments: [{
            text: 'comment-57',
          }, {
            text: 'comment-58',
          }],
        }, {
          title: 'todo-30',
          comments: [{
            text: 'comment-59',
          }, {
            text: 'comment-60',
          }],
        }],
      }, {
        title: 'default-heading-16',
        todos: [{
          title: 'todo-31',
          comments: [{
            text: 'comment-61',
          }, {
            text: 'comment-62',
          }],
        }, {
          title: 'todo-32',
          comments: [{
            text: 'comment-63',
          }, {
            text: 'comment-64',
          }],
        }],
      }, {
        title: 'default-heading-17',
        todos: [{
          title: 'todo-33',
          comments: [{
            text: 'comment-65',
          }, {
            text: 'comment-66',
          }],
        }, {
          title: 'todo-34',
          comments: [{
            text: 'comment-67',
          }, {
            text: 'comment-68',
          }],
        }],
      }],
    }],
  }, {
    title: 'default-board-4',
    columns: [{
      title: 'default-column-7',
      headings: [{
        title: 'default-heading-18',
        todos: [{
          title: 'todo-35',
          comments: [{
            text: 'comment-69',
          }, {
            text: 'comment-70',
          }],
        }, {
          title: 'todo-36',
          comments: [{
            text: 'comment-71',
          }, {
            text: 'comment-72',
          }],
        }],
      }, {
        title: 'default-heading-19',
        todos: [{
          title: 'todo-37',
          comments: [{
            text: 'comment-73',
          }, {
            text: 'comment-74',
          }],
        }, {
          title: 'todo-38',
          comments: [{
            text: 'comment-75',
          }, {
            text: 'comment-76',
          }],
        }],
      }, {
        title: 'default-heading-20',
        todos: [{
          title: 'todo-39',
          comments: [{
            text: 'comment-77',
          }, {
            text: 'comment-78',
          }],
        }, {
          title: 'todo-40',
          comments: [{
            text: 'comment-79',
          }, {
            text: 'comment-80',
          }],
        }],
      }],
    }, {
      title: 'default-column-8',
      headings: [{
        title: 'default-heading-21',
        todos: [{
          title: 'todo-41',
          comments: [{
            text: 'comment-81',
          }, {
            text: 'comment-82',
          }],
        }, {
          title: 'todo-42',
          comments: [{
            text: 'comment-83',
          }, {
            text: 'comment-84',
          }],
        }],
      }, {
        title: 'default-heading-22',
        todos: [{
          title: 'todo-43',
          comments: [{
            text: 'comment-85',
          }, {
            text: 'comment-86',
          }],
        }, {
          title: 'todo-44',
          comments: [{
            text: 'comment-87',
          }, {
            text: 'comment-88',
          }],
        }],
      }, {
        title: 'default-heading-23',
        todos: [{
          title: 'todo-45',
          comments: [{
            text: 'comment-89',
          }, {
            text: 'comment-90',
          }],
        }, {
          title: 'todo-46',
          comments: [{
            text: 'comment-91',
          }, {
            text: 'comment-92',
          }],
        }],
      }],
    }],
  }],
};

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
