const service = require("./quests.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

async function list(req, res) {
    const data = service.list();
    res.json({ data: data })
};

const hasReqProperties = hasProperties(
    "quest_name",
    "quest_step",
    "quest_reward"
);

async function create(req, res) {
    const newQuest = {
        ...req.body.data
    };

    const data = service.create(newQuest);
    res.json({ data: data })
};

module.exports = {
    list,
    create: [ asyncErrorBoundary(hasReqProperties), create ]
}