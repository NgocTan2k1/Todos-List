/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, getFirestore } from "firebase/firestore";
import { app } from "../../firebase";
import "./test.css";
import { List, Skeleton } from "antd";
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

    await getDocs(collection(db, "todos")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTodos(newData);
      console.log("newData:", newData);
    });
  };

  useEffect(() => {
    fetchPost();
    fetch(`https://randomuser.me/api/?results=${10}&inc=name,gender,email,nat,picture&noinfo`)
      .then((res) => res.json())
      .then((res) => {
        setData(res.results);
        setList(res.results);
        console.log(res.results)
      });
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

          <div className="btn-container">
            <button type="submit" className="btn" onClick={addTodo}>
              Submit
            </button>
          </div>
        </div>

        {/* <div className="todo-content">
                    {
                        todos?.map((todo, i) => (
                            <p key={i}>
                                STT: {i} - Content: {todo}
                            </p>
                        ))
                    }
                </div> */}

        <div className="todo-content">
          {todos?.map((todo, i) => (
            <p key={i}>{todo.todo}</p>
          ))}
        </div>

        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={list}
          renderItem={(item) => (
            <List.Item
              actions={[
                <button key="list-loadmore-edit">Edit Deadline</button>,
                <button key="list-loadmore-more">Edit Assign</button>,
              ]}
            >
              <Skeleton title={false} loading={item.loading} active>
                <List.Item.Meta
                  title={item.name?.last}
                  description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                />
                <div>New</div>
              </Skeleton>
            </List.Item>
          )}
        />
      </div>
    </section>
  );
};

export default Todo;
