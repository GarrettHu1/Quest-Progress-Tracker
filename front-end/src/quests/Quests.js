import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listAllQuests, updateQuest, deleteQuest } from "../utils/api";
// import 'bootstrap/dist/css/bootstrap.css';

export default function Quests() {

    // Different sections for different games
    // load all values from quests table

    const [ questsInfo, setQuestsInfo ] = useState([]);
    const [ questsErrors, setQuestsErrors ] = useState(null);
    const history = useHistory();

    useEffect(loadPage, []);

    function loadPage() {
      const abortController = new AbortController();
      setQuestsErrors(null);
      listAllQuests(abortController.signal)
        .then(setQuestsInfo)
        .catch(setQuestsErrors);

      return () => abortController.abort();
    };
    console.log(questsInfo)

    // async function onEdit() {

    // };

    async function onDelete(questId) {
        if (window.confirm("Do you want to delete this item? This cannot be undone.")) {
            await deleteQuest(questId);
            history.push(`/quests`);

            // window reload temporary
            window.location.reload();
        };
    };

    return (
        <div>
            <h1>Quests</h1>

            {/* <table>
        <thead>
          <tr>
            <th>Quest Name</th>
            <th>Quest Step</th>
            <th>Reward</th>
          </tr>
        </thead>
        <tbody>
          {questsInfo.map((quest) => (
            <tr key={quest.quest_id}>
            <td>{quest.quest_name}</td>
            <td>{quest.quest_step}</td>
            <td>{quest.quest_reward}</td>      
            </tr>
          ))}
        </tbody>
        </table> */}

    <table class="table">
    <thead>
    <tr>
      <th scope="col">Game</th>
      <th scope="col">Quest/Item Name</th>
      <th scope="col">Required Step</th>
      <th scope="col">Reward</th>
      <th scope="col"></th>
    </tr>
  </thead>
  <tbody>
    {questsInfo.map((quest) => (
    <tr>
      <th scope="row">{quest.game}</th>
      <th scope="row">{quest.quest_name}</th>
      <td>{quest.quest_step}</td>
      <td>{quest.quest_reward}</td>
      <td>
        {<button className="btn btn-primary" 
              onClick={() => history.push(`/quests/${quest.quest_id}/edit`)}>
                Edit
        </button>}   
      </td>
      <td>
        {<button className="btn btn-danger" 
              onClick={() => onDelete(quest.quest_id)}>
                Delete
        </button>}   
      </td>
    </tr>            
        ))}

  </tbody>
</table>
        </div>
    )
}