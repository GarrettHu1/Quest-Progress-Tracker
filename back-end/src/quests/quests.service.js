const knex = require("../db/connection");

function list() {
    return knex("quests").select("*");
};

function create(newQuest) {
    return knex("quests")
    .insert(newQuest)
    .returning("*")
    .then((newQuest) => newQuest[0])
};

function read(questId) {
    return knex("quests")
    .select("*")
    .where({ quest_id: questId })
    .first()
};

function update(updatedQuest) {
    return knex("quests")
    .select("*")
    .where({ quest_id: updatedQuest.quest_id})
    .update(updatedQuest, "*")
    .then(([quest]) => quest );
};

module.exports = {
    list,
    create,
    read,
    update
}