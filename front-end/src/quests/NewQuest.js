import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createQuest } from "../utils/api"
import QuestForm from "./QuestForm";

export default function NewQuest() {

    const initialFormState = {
        game: "",
        quest_name: "",
        quest_step: "",
        reward: "",
    };

const [ quest, setQuest ] = useState({ ...initialFormState });
const [ errors, setErrors ] = useState([]);
const history = useHistory();

const handleChange = ({ target }) => {
        setQuest({
      ...quest,
      [target.name]: target.value,
    })
  };
  
const handleSubmit = (event) => {
    event.preventDefault();
    const ac = new AbortController();
    // call createQuest then go to quests page
};

const handleCancel = (event) => {
    event.preventDefault();
    setQuest(initialFormState);
    history.goBack();
  };

    return (
        <div>
            <h1>New Quest Placeholder</h1>
          <QuestForm errors={errors} handleChange={handleChange} handleSubmit={handleSubmit} handleCancel={handleCancel} quest={quest} />  
        </div>
    )
}