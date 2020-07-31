const path = require('path');
const { build } = require('../../server');
const { Knex } = require('../../knex');
const { Subscriber } = require('../../events/subscriber');
const { Helper } = require('../../../tests/helper');
const { routes } = require('../../../tests/routes');
const { Request } = require('../../../tests/request');

let knex;
let app;

const request = () => new Request(app);

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
      .get(`${routes.comment}/${comment.id}`)
      .set('authorization', `Bearer ${token}`)
      .send();
    expect(res.statusCode).toEqual(200);

    expect(res.body).toEqual(expect.objectContaining({
      message: expect.any(String),
      data: expect.objectContaining({
        id: expect.any(Number),
        todoId: expect.any(Number),
        text: expect.any(String),
        replyCommentId: null,
        isEdited: expect.any(Boolean),
        attachedFiles: expect.arrayContaining([{
          ...resAttach.body.data,
        }]),
      }),
    }));

    done();
  });
  it('user can`t attach file to comment without comment id', async (done) => {
    const user = await helper.createUser(defaultUser);
    const token = user.getToken();

    const res = await request()
      .post(`${routes.commentAttachment}/`)
      .set('authorization', `Bearer ${token}`)
      .attach('name', pathToAttachment);

    expect(res.statusCode).toEqual(400);

    done();
  });
  it('user can`t attach file to comment without access', async (done) => {
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
  it('user can`t attach file to comment without field in form', async (done) => {
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
  it('user can`t attach file to comment without authorization', async (done) => {
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
  it('user can`t remove attached file from comment without attachment id', async (done) => {
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
  it('user can`t remove attached file from comment without access', async (done) => {
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
  it('user can`t remove attached file from comment without authorization', async (done) => {
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
