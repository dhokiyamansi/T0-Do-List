// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://t0-do-list-2.onrender.com/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleAddOrUpdateTodo = async (e) => {
    e.preventDefault();
    const todoData = { title, description, completed: false };

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/todos/${editingId}`, todoData);
        setEditingId(null);
      } else {
        await axios.post(`${API_BASE_URL}/todos`, todoData);
      }
      fetchTodos();
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleEditTodo = (todo) => {
    setTitle(todo.title);
    setDescription(todo.description);
    setEditingId(todo._id);
  };

  const toggleCompletion = async (todo) => {
    try {
      await axios.put(`${API_BASE_URL}/todos/${todo._id}`, {
        ...todo,
        completed: !todo.completed,
      });
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
<div className="min-h-screen flex items-center justify-center p-5" style={{ backgroundColor: '#e5eae4' }}>
  <div className="w-full max-w-md p-8 rounded-lg shadow-md" style={{ backgroundColor: '#f0f4f8' }}>
  <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">To-Do List</h1>

        {/* Todo Form */}
        <form onSubmit={handleAddOrUpdateTodo} className="mb-6">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-3 border rounded-md outline-none focus:border-blue-400"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 mb-3 border rounded-md outline-none focus:border-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            {editingId ? 'Update Todo' : 'Add Todo'}
          </button>
        </form>

        {/* Todo List */}
        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo._id}
              className={`flex items-start justify-between p-4 rounded-md shadow-sm ${
                todo.completed ? 'bg-green-100' : 'bg-gray-200'
              }`}
            >
              <div>
                <h3 className={`text-lg font-semibold ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {todo.title}
                </h3>
                <p className={`text-gray-600 ${todo.completed ? 'line-through' : ''}`}>
                  {todo.description}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleCompletion(todo)}
                  className={`${
                    todo.completed ? 'text-green-500 hover:text-green-700' : 'text-gray-500 hover:text-gray-700'
                  } transition`}
                >
                  {todo.completed ? 'Undo' : 'Complete'}
                </button>
                <button
                  onClick={() => handleEditTodo(todo)}
                  className="text-blue-500 hover:text-blue-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTodo(todo._id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
