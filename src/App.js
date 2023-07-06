import React from 'react';
import { Routes, Route } from "react-router-dom";
import Login from './components/Login/index.js';
import Register from './components/Register/index.js';
import TodosList from './components/TodosList/index.js';
import Todo from './components/TestTodo/index.js';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path='/' element={<Login />}></Route>
        <Route exact path='/register' element={<Register />}></Route>
        <Route exact path='/todos-list' element={<TodosList />}></Route>
        <Route exact path='/todo' element={<Todo />}></Route>
      </Routes>
    </div>
  );
}

export default App;
