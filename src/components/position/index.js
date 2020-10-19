class PositionComponent {
  getPositionById(positions, neededId) {
    return positions.findIndex((id) => id === neededId);
  }

  insert(positions, id, belowId) {
    let newPosition = positions.length;
    const newPositions = [...positions];

    if (belowId) {
      const currentPosition = this.getPositionById(positions, belowId);
      newPosition = currentPosition + 1;
      newPositions.splice(newPosition, 0, id);
    } else {
      newPositions.push(id);
    }

    return {
      newPosition,
      newPositions,
    };
  }

  insertInPosition(positions, position, id) {
    const newPositions = [...positions];
    newPositions.splice(position, 0, id);
    return newPositions;
  }

  orderByPosition(positions, data) {
    return data
      .map((el) => {
        const currentPosition = this.getPositionById(positions, el.id);
        return {
          ...el,
          position: currentPosition,
        };
      })
      .sort((a, b) => a.position - b.position);
  }

  move(positions, sourcePosition, destinationPosition) {
    const newPositions = [...positions];
    newPositions.splice(
      destinationPosition,
      0,
      newPositions.splice(sourcePosition, 1)[0],
    );
    return newPositions;
  }

  removeById(positions, removedId) {
    return positions.filter((id) => id !== removedId);
  }

  removeByPosition(positions, position) {
    const newPositions = [...positions];
    newPositions.splice(position, 1);
    return newPositions;
  }

  static isValid(ids, availableSize, ...positions) {
    const indexes = [...Array(availableSize).keys()].map((i) => i);
    return positions.every((position) => indexes.includes(position));
  }

  isValidSource(ids, ...positions) {
    return PositionComponent.isValid(ids, ids.length, ...positions);
  }

  isValidDestination(ids, ...positions) {
    return PositionComponent.isValid(ids, ids.length + 1, ...positions);
  }

  reverse(ids) {
    return ids.reverse();
  }
}

module.exports = {
  PositionComponent: new PositionComponent(),
};
