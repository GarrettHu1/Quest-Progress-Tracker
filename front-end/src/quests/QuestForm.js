import React from "react";

export default function ResForm({ handleChange, handleSubmit, handleCancel, errors, quest }) {

  return (
    <main>
        {errors.length > 0 &&
        <div className="alert alert-danger" role="alert" >
            Please fix the following errors:
            {errors.map((error)=> <li>{error}</li>)}
        </div>
        }
        <form>
    <label>
        Game:
        <input type="text" name="game" onChange={handleChange} defaultValue={quest.game} placeholder={"Game Name"} />
    </label>
    <label>
        Quest/Item Name:
        <input type="text" name="quest_name" onChange={handleChange} defaultValue={quest.quest_name} placeholder={"Quest/Item Name"} />
    </label>
    <label>
        Required Steps:
        <input type="text" name="quest_step" onChange={handleChange} defaultValue={quest.quest_step} placeholder={"Required Steps"} />
    </label>
    <label>
        Reward:
        <input type="text" name="quest_reward" onChange={handleChange} defaultValue={quest.quest_reward} placeholder={"Reward"} />
    </label>
    <button type="submit" onClick={handleSubmit} className="btn btn-primary">Submit</button>
    <button onClick={handleCancel} className="btn btn-danger">Cancel</button>
    </form>
    </main> 
)  
}