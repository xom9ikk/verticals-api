const migrateRollbackAll = () => knex.migrate.rollback({}, true);

const migrateLatest = () => knex.migrate.latest();

module.exports = {
  migrateRollbackAll,
  migrateLatest,
};
