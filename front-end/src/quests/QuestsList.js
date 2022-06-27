import React from "react";
import { useHistory } from "react-router-dom";

export default function QuestsList({ questsInfo, onDelete, filteredQuests, filterStatus }) {
  const history = useHistory();
  let quests;
  console.log(filterStatus)
  filterStatus === "default" ? quests = questsInfo : quests = filteredQuests;

    return (
      quests.map((quest, index) => (
            <tr key={index}>
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
                ))
    )
}