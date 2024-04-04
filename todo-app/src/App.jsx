import { useState } from "react";
import "./styles.css";

const App = () => {
  const [newItem, setNewItem] = useState("test");
  const [todos, setTodos] = useState([]);

  const handleSubmit = e => {
    e.preventDefault();
    // this adds a new todo object to the end of the array
    setTodos(currentTodos => {
      return [
        ...currentTodos,
        {
          id: crypto.randomUUID(),
          title: newItem,
          completed: false
        }
      ]
    });
    setNewItem(""); //clear out input
  };

  return (
    <>
      <form className="new-item-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="item">New Item</label>
          <input value={newItem} onChange={e => setNewItem(e.target.value)} type="text" id="item" />
        </div>
        <button className="btn">Add</button>
      </form>

      <h1 className="header">Todo List</h1>

      <ul className="list">
        {todos.map(todo => {
          return <li key={todo.id}>
            <label>
              <input type="checkbox" checked={todo.completed} />
              {todo.title}
            </label>
            <button className="btn btn-danger">Delete</button>
          </li>
        })}
      </ul>
    </>
  )
};

export default App;