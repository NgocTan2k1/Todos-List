import React from 'react';
import { Routes, Route } from "react-router-dom";
import Login from './Login/index.js';
import Register from './Register/index.js';
import TodosList from './TodosList/index.js';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path='/' element={<Login />}></Route>
        <Route exact path='/register' element={<Register />}></Route>
        <Route exact path='/todos-list' element={<TodosList />}></Route>
      </Routes>
    </div>
  );
}

export default App;
