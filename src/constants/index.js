module.exports = {
  RequestPart: {
    body: 'body',
    query: 'query',
    params: 'params',
  },
  Transport: {
    rest: 0,
    socket: 1,
  },
  CardType: {
    checkboxes: 0,
    arrows: 1,
    dots: 2,
    dashes: 3,
    nothing: 4,
  },
  Color: {
    red: 0,
    yellow: 1,
    green: 2,
    turquoise: 3,
    blue: 4,
    gray: 5,
  },
  TodoStatus: {
    todo: 0,
    doing: 1,
    done: 2,
    canceled: 3,
  },
  Operations: {
    insert: 0,
    update: 1,
    delete: 2,
  },
  HeadingType: {
    default: 0,
    archived: 1,
    removed: 2,
    custom: 3,
  },
};
