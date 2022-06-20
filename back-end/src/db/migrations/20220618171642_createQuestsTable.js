
exports.up = function (knex) {
    return knex.schema.createTable("quests", (table) => {
      table.increments("quest_id").primary();
      table.timestamps(true, true);
      table.string("game").notNullable();
      table.string("quest_name").notNullable();
      table.string("quest_step").notNullable();
      table.string("quest_reward").notNullable();
    });
  };

exports.down = function (knex) {
    return knex.schema.dropTable("quests");
  };
