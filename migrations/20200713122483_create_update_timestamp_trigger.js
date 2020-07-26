/* eslint-disable no-return-await */
exports.up = async (knex) => await knex.raw(`
  CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER
  LANGUAGE plpgsql
  AS
  $$
  BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
  END;
  $$;
`);

exports.down = async (knex) => await knex.raw(`
  DROP FUNCTION IF EXISTS update_timestamp() CASCADE;
`);
