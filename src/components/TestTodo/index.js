/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, getFirestore } from "firebase/firestore";
import { app } from "../../firebase";
import "./test.css";
import { List, Skeleton, Button } from "antd";
const Todo = () => {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);

  const db = getFirestore(app);

  const fetchPost = async () => {
    // await getDocs(collection(db, `users`))
    //     .then((querySnapshot) => {
    //         const newUsers = querySnapshot.docs.map((doc) => doc.data())
    //         setTodos(newUsers[0].userEmails)
    //     })
    //     .catch(error => console.log(error))

    // await getDocs(collection(db, "todos")).then((querySnapshot) => {
    //   const newData = querySnapshot.docs.map((doc) => ({
    //     ...doc.data(),
    //     id: doc.id,
    //   }));
    //   setTodos(newData);
    //   console.log("newData:", newData);
    // });
  };

  useEffect(() => {
    // fetchPost();
    setList(["Task name", "Task name", "Task name", "Task name"])
    console.log("todos1:", todos);

  }, []);

  const addTodo = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, "todos"), {
        todo: todo,
      });
      console.log("Document written with ID:", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <section className="todo-container">
      <div className="todo">
        <h1 className="header">Todo-App</h1>

        <div>
          <div>
            <input
              type="text"
              placeholder="What do you have to do today?"
              onChange={(e) => setTodo(e.target.value)}
            />
          </div>

        </div>

        <List
          itemLayout="horizontal"
          dataSource={[""]}
          renderItem={() => (
            <List.Item
              actions={[
                <div>
                  
                  <Button className="hi" onClick={() => {
                  alert("Edit Deadline")
                }} key="edit-deadline">Edit Deadline</Button>
                <Button onClick={() => {
                  alert("Edit Assign")
                }} key="edit-assign">Edit Assign</Button>
                </div>,
                <div>Creator</div>,
                <h5 onClick={() => {
                  alert("handle Check")
                }} key="check">Done</h5>,
              ]}
            >

              <List.Item.Meta
                title={`Taskname`}
              />
              <div>Status</div>
            </List.Item>
          )}
        />
      </div>
    </section>
  );
};

export default Todo;
