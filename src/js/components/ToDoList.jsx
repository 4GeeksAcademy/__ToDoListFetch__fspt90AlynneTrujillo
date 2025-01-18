import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

export const ToDoList = () => {
  const [toDoItem, setToDoItem] = useState([]); // Task list
  const [newItem, setNewItem] = useState(""); // New task input
  const username = "alynne_t";

  // Creating a new to-do item
  const addNewTask = async () => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: newItem,
          is_done: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add new to-do: ${response}`);
      }

      const data = await response.json();
      setToDoItem([...toDoItem, data]); // Add new item to the list
      setNewItem("");
    } catch (error) {
      console.error("Error adding new to-do:", error); // Improved error handling
    }
  };

  // Function to get all to-dos
  const retrieveAllToDos = async () => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/users/${username}`);

      if (!response.ok) {
        throw new Error(`Failed to retrieve to-dos: ${response.statusText}`); // Improved error handling
      }

      const data = await response.json();
      setToDoItem(data.toDoItem || []);
    } catch (error) {
      console.error("Error retrieving to-dos:", error);
    }
  };

  // Fetch tasks when the component loads
  useEffect(() => {
    retrieveAllToDos();
  }, []);

  // Add task on Enter key press
  const handlePressKey = async (e) => {
    if (e.key === "Enter") {
      addNewTask();
    }
  };
};


/* const handleDeleteAnyItem = (index) => {
  const updatedTasks = toDoItem.filter((_, i) => i !== index);
  updateTasksOnServer(updatedTasks);
};
*/

// Clear all tasks
const deleteAllItems = async (id) => {
  try {
    const response = await fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete all items: ${response}`);
    }
    setToDoItem([]);
  } catch (error) {
    console.log("Error deleting all to dos", error);
  }
};

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
                    onClick={() => deleteOneItem(index)}
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
          className="btn btn-danger-emphasis mt-3"
          onClick={() => deleteAllItems(toDoItem.id)}> 
          Clear All Tasks
        </button>
      </div>
    </div>
  </div>
);
}