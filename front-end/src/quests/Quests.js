import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listAllQuests, deleteQuest } from "../utils/api";
import Dropdown from "react-bootstrap/Dropdown"
import QuestsList from "./QuestsList";
// import 'bootstrap/dist/css/bootstrap.css';

export default function Quests() {

    // Different sections for different games
    // load all values from quests table

    const [ questsInfo, setQuestsInfo ] = useState([]);
    const [ questsErrors, setQuestsErrors ] = useState(null);
    const [ filterQuery , setFilterQuery ] = useState(null);
    const [ filterStatus , setFilterStatus ] = useState("default");
    const [ filteredQuests , setFilteredQuests ] = useState([]);
    const history = useHistory();

    useEffect(loadPage, []);
    useEffect(filterQuests, [filterQuery]);

    function loadPage() {
      const abortController = new AbortController();
      setQuestsErrors(null);
      listAllQuests(abortController.signal)
        .then(setQuestsInfo)
        .catch(setQuestsErrors);
      return () => abortController.abort();
    };
    // console.log(questsInfo)

    if (questsErrors) console.log(questsErrors);

    function filterQuests() {
      const abortController = new AbortController();
      if (filterQuery != null) {
      const filtered = questsInfo.filter((quest) => quest.game === filterQuery);
        setFilteredQuests(filtered);
        setFilterStatus("notDefault");
      }
      else {
        setFilterStatus("default");
      }
      console.log(questsInfo)
    };

    function onDelete(questId) {
        if (window.confirm("Do you want to delete this item? This cannot be undone.")) {
            deleteQuest(questId);
            history.push(`/quests`);

            // window reload temporary
            window.location.reload();
        };
    };

    questsInfo.sort(function(a, b) {
      const nameA = a.game.toUpperCase(); // ignore upper and lowercase
      const nameB = b.game.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
    
      // names must be equal
      return 0;
    });

    console.log(filterStatus);
    // console.log(filterQ);

    return (
        <div>
            <h1>Quests</h1>
            <div>
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Filter Games
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setFilterQuery(null)} >All</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilterQuery("Destiny 2")} >Destiny 2</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilterQuery("MH Rise")} >MH Rise</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilterQuery("Vermintide 2")} >Vermintide 2</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilterQuery("Test")} >Test</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
            </div>
    <table class="table">
    <thead>
    <tr>
      <th scope="col">Game</th>
      <th scope="col">Quest/Item Name</th>
      <th scope="col">Required Step</th>
      <th scope="col">Reward</th>
      <th scope="col">Edit</th>
      <th scope="col">Delete</th>
    </tr>
  </thead>
  <tbody>

    {/* {questsInfo.map((quest, index) => (
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
        ))} */}

    <QuestsList onDelete={onDelete} questsInfo={questsInfo} filteredQuests={filteredQuests} filterStatus={filterStatus} />
  </tbody>
    </table>
        </div>
    )
}