import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, getFirestore } from "firebase/firestore";
import { app } from '../../firebase';
import "./test.css"
const Todo = () => {
    const [todo, setTodo] = useState("");
    const [todos, setTodos] = useState([]);

    const db = getFirestore(app);

    const fetchPost = async () => {

        // await getDocs(collection(db, `users`))
        //     .then((querySnapshot) => {
        //         const newUsers = querySnapshot.docs.map((doc) => doc.data())
        //         setTodos(newUsers[0].userEmails)
        //     })
        //     .catch(error => console.log(error))

        await getDocs(collection(db, "todos"))
            .then((querySnapshot) => {
                const newData = querySnapshot.docs
                    .map((doc) => ({ ...doc.data(), id: doc.id }));
                setTodos(newData);
                console.log(todos, newData);
            })


    }

    useEffect(() => {
        fetchPost();
        console.log("todos1:", todos);
    }, [])

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
    }

    return (
        <section className="todo-container">
            <div className="todo">
                <h1 className="header">
                    Todo-App
                </h1>

                <div>

                    <div>
                        <input
                            type="text"
                            placeholder="What do you have to do today?"
                            onChange={(e) => setTodo(e.target.value)}
                        />
                    </div>

                    <div className="btn-container">
                        <button
                            type="submit"
                            className="btn"
                            onClick={addTodo}
                        >
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
                    {
                        todos?.map((todo, i) => (
                            <p key={i}>
                                {todo.todo}
                            </p>
                        ))
                    }
                </div>

            </div>
        </section>
    )
}

export default Todo;