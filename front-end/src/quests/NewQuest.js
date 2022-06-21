import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createQuest } from "../utils/api"
import QuestForm from "./QuestForm";

export default function NewQuest() {

    const initialFormState = {
        game: "",
        quest_name: "",
        quest_step: "",
        quest_reward: "",
    };

const [ quest, setQuest ] = useState({ ...initialFormState });
const [ errors, setErrors ] = useState([]);
const history = useHistory();
const handleSubErrors = [];

const handleChange = ({ target }) => {
        setQuest({
      ...quest,
      [target.name]: target.value,
    })
  };
  
const handleSubmit = async (event) => {
    event.preventDefault();
    const ac = new AbortController();
    setErrors(null);

  if (!quest.game || !quest.quest_name || !quest.quest_step|| !quest.quest_reward) {
    handleSubErrors.push(...errors, "Please Fix Input")
  }
  setErrors(handleSubErrors);

    if (handleSubErrors.length === 0) {
    // call createQuest using form info
    await createQuest(quest, ac.signal);
    // returns user to quests page
    history.push("/quests")      
    }

};

const handleCancel = (event) => {
    event.preventDefault();
    setQuest(initialFormState);
    history.goBack();
  };

    return (
        <div>
            <h1>Quest/Item Info</h1>
          <QuestForm errors={errors} handleChange={handleChange} handleSubmit={handleSubmit} handleCancel={handleCancel} quest={quest} />  
        </div>
    )
}