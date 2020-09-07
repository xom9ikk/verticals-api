class PositionComponent {
  calculatePosition(positions, neededId) {
    return positions.findIndex((id) => id === neededId);
  }

  insert(positions, id, belowId) {
    let newPosition = positions.length;
    const newPositions = [...positions];

    if (belowId) {
      const currentPosition = this.calculatePosition(positions, belowId);
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

  orderByPosition(positions, data) {
    return data
      .map((el) => {
        const currentPosition = this.calculatePosition(positions, el.id);
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

  remove(positions, removedId) {
    return positions.filter((id) => id !== removedId);
  }
}

module.exports = {
  PositionComponent: new PositionComponent(),
};
