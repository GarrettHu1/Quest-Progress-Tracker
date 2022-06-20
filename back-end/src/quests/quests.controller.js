const service = require("./quests.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

async function list(req, res) {
    const data = await service.list();
    console.log("========list all quests result:", data)
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

    const data = await service.create(newQuest);
    res.json({ data: data })
};

async function update(req, res) {
    const { quest_id } = req.params;
    // const values = req.body.data
    const updatedQuest = {
        ...req.body.data,
        quest_id: quest_id
    };

    const data = await service.update(updatedQuest);

    res.status(200).json({ data: data })
};

async function destroy(req, res) {
    const { quest_id } = req.params;
    await service.delete(quest_id);

    res.status(200);
};

module.exports = {
    list,
    create: [ asyncErrorBoundary(hasReqProperties), create ],
    update,
    delete: destroy
}