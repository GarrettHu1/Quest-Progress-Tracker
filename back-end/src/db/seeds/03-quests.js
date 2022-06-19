const quests = require("../fixtures/quests");

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex
    .raw("TRUNCATE TABLE quests RESTART IDENTITY CASCADE")
    .then(function () {
      // Inserts seed entries
      return knex("quests").insert(quests);
    });
};