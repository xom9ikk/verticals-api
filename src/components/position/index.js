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
    console.log('ids', ids);
    console.log('availableSize', availableSize);
    console.log('positions', positions);
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

  mapEntitiesOnPositions(filteredEntities, positions) {
    const filteredPositions = {};
    const topLvlEntityIds = Object.keys(positions);
    topLvlEntityIds.forEach((topLevelEntityId) => {
      const todoPositions = positions[topLevelEntityId];
      todoPositions.forEach((entityId) => {
        const hasEntity = filteredEntities
          .findIndex((entity) => entity.id === entityId) !== -1;
        if (hasEntity) {
          if (!filteredPositions[topLevelEntityId]) {
            filteredPositions[topLevelEntityId] = [];
          }
          filteredPositions[topLevelEntityId].push(entityId);
        }
      });
    });
    return filteredPositions;
  }
}

module.exports = {
  PositionComponent: new PositionComponent(),
};
