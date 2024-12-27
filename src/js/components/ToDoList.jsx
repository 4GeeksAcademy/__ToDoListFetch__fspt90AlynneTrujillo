import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";


const ToDoList = () => {
  const [toDoItem, setToDoItem] = useState([]); // Task list
  const [newItem, setNewItem] = useState(""); // New task input

  // Fetch tasks when the component loads
  useEffect(() => {
    fetch("https://playground.4geeks.com/todo/docs#/")
      .then((response) => response.json())
      .then((data) => setToDoItem(data))
      .catch((error) => console.error(error));
  }, []);

  // Update tasks on the server
  const updateTasksOnServer = (updatedTasks) => {
    fetch("https://playground.4geeks.com/todo/todos/1", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", //this sets the request header to specify that the body of the request contains json data
      },
      body: JSON.stringify(updatedTasks), //the body of the request is set to the updatedTasks arg, converted to a JSON string
    })
      .then((response) => response.json())
      .then(() => setToDoItem(updatedTasks))
      .catch((error) => console.error(error));
  };

/*
Add a new task.. 
the trim is used to check if newItem is not empty 
after removing whitespace. if newItem is only 
whitespace, the function will not proceed 
to add the item.
*/
  const handleAddNewItem = () => {
    if (newItem.trim()) {
      const updatedTasks = [...toDoItem, newItem.trim()];
      updateTasksOnServer(updatedTasks);
      setNewItem("");
    }
  };

  // Add task on Enter key press
  const handlePressKey = (enter) => {
    if (enter.key === "Enter") {
      handleAddNewItem();
    }
  };
/*
Delete a specific task
line #61- the filter method provides 2 args to the 
callback function, the current element(which we don't
 use here, hence the underscore and it's index (i))
*/
  const handleDeleteAnyItem = (index) => {
    const updatedTasks = toDoItem.filter((_, i) => i !== index);
    updateTasksOnServer(updatedTasks);
  };

  // Clear all tasks
  const clearAllTasks = () => {
    fetch("https://playground.4geeks.com/todo/todos/delete_todo", { method: "DELETE" })
      .then(() => setToDoItem([]))
      .catch((error) => console.error(error));
  };

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
                    {task}
                    <button
                      className="btn btn-danger-emphasis"
                      onClick={() => handleDeleteAnyItem(index)}
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
            <button className="btn btn-danger-emphasis" onClick={handleAddNewItem}>
              Add
            </button>
          </div>
          <button
            className="btn btn-danger-emphasis mt-3"
            onClick={clearAllTasks}
          >
            Clear All Tasks
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToDoList;

/* NOTES FOR MAP, KEY & BTN
.map loops through each item in toDoItem
for each item, a <li> is created.
assigns a unique key using the index of the item.
displays the item's text.
adds a delete btn that removes. 
*/
