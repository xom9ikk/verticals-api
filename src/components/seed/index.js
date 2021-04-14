/* eslint-disable no-restricted-syntax */
const fs = require('fs');
const path = require('path');
const { Color, TodoStatus } = require('../../constants');
const { BoardController } = require('../../modules/board/controller');
const { ColumnController } = require('../../modules/column/controller');
const { HeadingController } = require('../../modules/heading/controller');
const { TodoController } = require('../../modules/todo/controller');
const { SubTodoController } = require('../../modules/sub-todo/controller');
const { CommentController } = require('../../modules/comment/controller');
const { CommentAttachmentController } = require('../../modules/comment-attachment/controller');

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(new Date().getDate() + 1);
const inFuture = new Date();
inFuture.setDate(new Date().getDate() + 33);
const expired = new Date();
expired.setDate(new Date().getDate() - 3);

const boardData = {
  icon: '/assets/svg/board/star.svg',
  title: 'Today',
};

const columnsData = [{
  title: 'To do',
  description: 'Things you plan to do',
}, {
  title: 'Watch List',
  description: 'Stuff you want to keep an eye on: reminders, follow ups etc.',
}, {
  title: 'Later',
  description: 'Things you want to do someday',
}, {
  title: 'Done',
  description: 'Drag and drop cards you don\'t need anymore',
}];

const headingsData = [{
  title: 'This week',
}, {
  title: 'Next week',
}];

const todosFromCustomHeadingData1 = [{
  title: 'Call to insurance (NY state of health)',
}, {
  title: 'Email to Mark',
  expirationDate: today,
}, {
  title: 'Change address in the bank',
}, {
  title: 'Cat food',
}];

const todosFromCustomHeadingData2 = [{
  title: 'Create events for A/B test',
  expirationDate: inFuture,
}, {
  title: 'Buy bike',
}, {
  title: 'Check storage speed',
}];

const todosFromColumnData1 = [{
  title: 'Reply to Jason',
}, {
  title: 'Feedback from design',
  expirationDate: expired,
}, {
  title: 'Watch Scarlett vs Serral/GSL\'19',
}];

const todosFromColumnData2 = [{
  title: 'Trevor followup',
}, {
  title: 'Registration flow A/B test',
}, {
  title: 'Check the new season "Money Heist" release date',
}, {
  title: 'Ping Lili',
}, {
  title: 'Documents for the accountant',
  expirationDate: inFuture,
}];

const todosFromColumnData3 = [{
  title: 'Check the Netflix culture deck',
}, {
  title: 'Maya documents',
}, {
  title: 'Pitch deck',
  color: Color.green,
}, {
  title: 'Update info in NY State of Health',
}, {
  title: 'SC2 GSL 2019',
}];

const todosFromColumnData4 = [{
  title: 'Design registration flow',
  status: TodoStatus.done,
}, {
  title: 'Check ST stats',
  status: TodoStatus.done,
}, {
  title: 'Email to Trevor',
  status: TodoStatus.canceled,
}, {
  title: 'Product meeting',
  status: TodoStatus.done,
}, {
  title: 'Call to Lili',
  status: TodoStatus.done,
  expirationDate: tomorrow,
}, {
  title: 'Mouse over for buttons',
  status: TodoStatus.doing,
}, {
  title: 'Call litter',
  status: TodoStatus.done,
}, {
  title: 'Fix lamp',
  status: TodoStatus.doing,
}, {
  title: 'Watch Group A: Dark vs KeeN/GLS\'19',
  status: TodoStatus.done,
}, {
  title: 'Tab bar redesign',
  status: TodoStatus.canceled,
}, {
  title: 'Make a Coub/Matrix + Harry Potter',
  status: TodoStatus.done,
}, {
  title: 'Call to John',
  status: TodoStatus.done,
}, {
  title: 'Reply to brothers',
  status: TodoStatus.done,
}, {
  title: 'Test new tab bar',
  status: TodoStatus.done,
}, {
  title: 'Create boards for screenshots',
  status: TodoStatus.done,
}];

const subTodosFromTodoData1 = [{
  title: 'Bank statement',
  status: TodoStatus.done,
}, {
  title: 'Requisites',
}];

const subTodosFromTodoData2 = [{
  title: 'Acceptance certificate for the transfer of works',
}, {
  title: 'Tax statement',
}, {
  title: 'Contract',
  status: TodoStatus.done,
}];

const commentsData = [{
  text: 'Do I need to consult a veterinarian before purchasing a new feed?',
}, {
  text: 'I am thinking to buy food:\n'
    + '- `Purina`\n'
    + '- `Friskies`\n'
    + '- `Whiskas`\n'
    + '- `One`',
}];

const attachmentsData = [{
  file: '0.jpg',
}, {
  file: '1.jpg',
}, {
  file: '2.jpg',
}, {
  file: '3.jpg',
}, {
  file: '4.jpg',
}, {
  file: '5.jpg',
}, {
  file: '6.jpg',
}];

class SeedComponent {
  async setupDefaultBoard(userId) {
    const { boardId } = await BoardController.create(userId, boardData);

    const columns = columnsData.map((column) => ({
      ...column,
      boardId,
    }));

    const columnIds = [];

    for await (const column of columns) {
      const { columnId } = await ColumnController.create(userId, column);
      columnIds.push(columnId);
    }

    const headings = headingsData.map((heading) => ({
      ...heading,
      columnId: columnIds[0],
    }));

    const customHeadingIds = [];

    for await (const heading of headings) {
      const { headingId } = await HeadingController.create(userId, heading);
      customHeadingIds.push(headingId);
    }

    const { positions: headingPositions } = await HeadingController.getAll(userId, boardId);

    const todosFromCustomHeading1 = todosFromCustomHeadingData1.map((todo) => ({
      ...todo,
      headingId: customHeadingIds[0],
    }));

    const todosFromCustomHeading2 = todosFromCustomHeadingData2.map((todo) => ({
      ...todo,
      headingId: customHeadingIds[1],
    }));

    const todosFromColumn1 = todosFromColumnData1.map((todo) => ({
      ...todo,
      headingId: headingPositions[columnIds[0]][0],
    }));

    const todosFromColumn2 = todosFromColumnData2.map((todo) => ({
      ...todo,
      headingId: headingPositions[columnIds[1]][0],
    }));

    const todosFromColumn3 = todosFromColumnData3.map((todo) => ({
      ...todo,
      headingId: headingPositions[columnIds[2]][0],
    }));

    const todosFromColumn4 = todosFromColumnData4.map((todo) => ({
      ...todo,
      headingId: headingPositions[columnIds[3]][0],
    }));

    const todos = [
      ...todosFromCustomHeading1,
      ...todosFromCustomHeading2,
      ...todosFromColumn1,
      ...todosFromColumn2,
      ...todosFromColumn3,
      ...todosFromColumn4,
    ];

    const todoIds = [];

    for await (const todo of todos) {
      const { todoId } = await TodoController.create(userId, todo);
      todoIds.push(todoId);
    }

    const subTodosFromTodo1 = subTodosFromTodoData1.map((subTodo) => ({
      ...subTodo,
      todoId: todoIds[14],
    }));

    const subTodosFromTodo2 = subTodosFromTodoData2.map((subTodo) => ({
      ...subTodo,
      todoId: todoIds[16],
    }));

    const subTodos = [
      ...subTodosFromTodo1,
      ...subTodosFromTodo2,
    ];

    for await (const subTodo of subTodos) {
      await SubTodoController.create(userId, subTodo);
    }

    const comments = commentsData.map((comment) => ({
      ...comment,
      todoId: todoIds[0],
    }));

    comments.push({
      text: '',
      todoId: todoIds[12],
    });

    const commentsIds = [];

    for await (const comment of comments) {
      const commentId = await CommentController.create({
        userId,
        comment,
      });
      commentsIds.push(commentId);
    }

    const attachments = attachmentsData.map((attachment) => ({
      ...attachment,
      commentId: commentsIds[commentsIds.length - 1],
    }));

    for await (const attachment of attachments) {
      await CommentAttachmentController.save({
        userId,
        commentId: attachment.commentId,
        file: {
          fieldName: 'name',
          fileName: attachment.file,
          encoding: '7bit',
          mimeType: 'image/jpeg',
          size: '9983',
          file: fs.createReadStream(path.join(__dirname, 'files', attachment.file)),
        },
      });
    }
  }
}

module.exports = {
  SeedComponent: new SeedComponent(),
};
