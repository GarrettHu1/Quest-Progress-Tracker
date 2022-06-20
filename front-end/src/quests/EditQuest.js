import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readQuest, updateQuest } from "../utils/api";
import QuestForm from "./QuestForm"

export default function EditQuest() {
    // load quest using readQuest function with params
    // render form populated with info from quest from params
    // onSubmit, call updateQuest with new form info
    // push user to quests page

    const [ quest, setQuest ] = useState(null);
    const [ errors, setErrors ] = useState([]);
    const [ formData, setFormData ] = useState(null);
    const questId = useParams().quest_id;
    const history = useHistory();
    
    console.log("quest id: ", questId)

    useEffect(loadPage, []);

    async function loadPage() {
        const abortController = new AbortController();
        setErrors(null);
        readQuest(questId, abortController.signal)
        .then((quest) => {
            setQuest(quest);
            setFormData(quest)
            // console.log(quest)
          })
        .catch(setErrors);
      
        return () => abortController.abort();
    };
    console.log("current quest:", quest)
    if (errors) { console.log(errors) };
      
    const handleChange = ({ target }) => {
        setQuest({
      ...quest,
      [target.name]: target.value,
    })
  };
  
const handleSubmit = async (event) => {
    event.preventDefault();
    const ac = new AbortController();
    // call createQuest using form info
    console.log("EDITING")
    await updateQuest(quest, ac.signal);
    // returns user to quests page
    history.push("/quests")
};

const handleCancel = (event) => {
    event.preventDefault();
    // setQuest(initialFormState);
    history.goBack();
};

    return (
        <div>
            temp
            { quest &&
                <QuestForm handleChange={handleChange} handleSubmit={handleSubmit} handleCancel={handleCancel} quest={quest} />
            }
            
        </div>
    )
}