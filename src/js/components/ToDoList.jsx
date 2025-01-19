import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

export const ToDoList = () => {
  const [toDoItem, setToDoItem] = useState([]); // Task list
  const [newItem, setNewItem] = useState(""); // New task input
  const username = "alynnet";

  // Creating a new to-do item
  const addNewTask = async () => {
    try { // starts a try..catch block to handle potential errs that could occur during the op
      const response = await fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: newItem, // the content of the new to do item
          is_done: false, // boolean that indicates the task has not been completed??
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add new to-do: ${response}`);
      }
      const data = await response.json(); // extracts the JSON data from the res.
      setToDoItem([...toDoItem, data]); // updates the local state with the new to do, uses the spread op to copy the existing items into a new array and appends the new item at the end. 
      setNewItem("");
    } catch (error) {
      console.error("Error adding new to-do:", error);
    }
  };

  // func to create new list when one is not already made
  const createNewList = async () => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/users/${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to create new list: ${response}`);
      }
      const data = await response.json();
      console.log("New list was created :", data);
      retrieveAllToDos();
    } catch (error) {
      console.error("Error creating new list:");
    }
  };

  // Func to GET all to-dos
  const retrieveAllToDos = async () => {
    try {
    const response = await fetch(`https://playground.4geeks.com/todo/users/${username}`);
      console.log(response);
      
    if (!response.ok) {
      throw new Error(`Failed to retrieve to-dos: ${response.statusText}`); // Improved error handling
    } 
    const data = await response.json();
    console.log(data);
    
    setToDoItem(data.todos || []);
    } catch (error) {
    console.log("Error retrieving all to dos", error)
    createNewList();
    }
  };

  // Add task on Enter key press
  const handlePressKey = async (e) => {
    if (e.key === "Enter") {
      addNewTask();
    }
  };
// func to DELETE only ONE
  const deleteOneItem = async (id) => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Contact could not be deleted: ${response}`);
      }
      setToDoItem(toDoItem.filter((item) => item.id !== id));
    } catch (error) {
      console.log("Error deleting", error);
    }
  };

  // func to DELETE all
  const deleteAllItems = async (username) => {
    console.log(username);
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/users/${username}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      retrieveAllToDos();
    } catch (error) {
      console.log("Error deleting all to dos", error);
    }
  };

 // display them all 
  useEffect(() => {
    retrieveAllToDos();
  }, []);

  return (
    <div>
      <div className="container">
        <h1 className="row justify-content-center">To Do List</h1>
        <div className="row justify-content-center my-3">
          <div>
            {toDoItem.length === 0 ? (
              <div>No items available</div>
            ) : (
              <ul>
                {toDoItem.map((task, index) => (
                  <li key={index} className="list-group-item">
                    {task.label}
                    <button
                      className="btn btn-danger-emphasis"
                      onClick={() => deleteOneItem(task.id)}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Add new to-do"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={handlePressKey}
            />
            <button className="btn btn-danger-emphasis" onClick={addNewTask}>
              Add
            </button>
          </div>
          <button
            className="btn btn-danger-emphasis mt-3" // had username as "id", but not sure which one goes on line 153.. 
            onClick={() => deleteAllItems(username)}> 
            Clear All Tasks
          </button>
        </div>
      </div>
    </div>
  );
};


// DELETE ALL FROM LIST, but NOT API
// NOT DELETING INDIVIDUAL TASKS
// INPUT DOESNT CLEAR WHEN I HIT ENTER OR PRESS THE ADD BUTTON