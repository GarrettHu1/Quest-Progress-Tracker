import React, { useEffect, useState } from "react";
import { listAllQuests } from "../utils/api";
// import 'bootstrap/dist/css/bootstrap.css';

export default function Quests() {

    // Different sections for different games
    // load all values from quests table

    const [ questsInfo, setQuestsInfo ] = useState([]);
    const [ questsErrors, setQuestsErrors ] = useState(null);

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
      <th scope="col">Quest Name/Item</th>
      <th scope="col">Required Step</th>
      <th scope="col">Reward</th>
    </tr>
  </thead>
  <tbody>
    {questsInfo.map((quest) => (
    <tr>
      <th scope="row">{quest.quest_name}</th>
      <td>{quest.quest_step}</td>
      <td>{quest.quest_reward}</td>
    </tr>            
        ))}

  </tbody>
</table>
        </div>
    )
}