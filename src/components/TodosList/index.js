import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc, getFirestore } from "firebase/firestore";
import { Checkbox, Button, Modal, Row, Col } from 'antd';


import classNames from "classnames/bind";
import styles from "./TodosList.module.scss";
import { app } from "../../firebase";
import { useEffect, useState } from "react";
import img from "../../img/icon.png";

const cx = classNames.bind(styles);

// const dataExample = [
//     {
//         id: 1,
//         title: "Create Plan",
//         creator: "tanpnz@nec.vn",
//         timeCreate: "07/04/2023",
//         deadline: "07/06/2023",
//         assignNames: ["tanpnz@nec.vn", "baonmz@nec.vn"],
//         status: true,
//     },

//     {
//         id: 2,
//         title: "Design FE",
//         creator: "tanpnz@nec.vn",
//         timeCreate: "07/04/2023",
//         deadline: "07/05/2023",
//         assignNames: ["tanpnz@nec.vn"],
//         status: false,
//     },

//     {
//         id: 3,
//         title: "Test3",
//         creator: "tanpnz@nec.vn",
//         timeCreate: "07/04/2023",
//         deadline: "07/05/2023",
//         assignNames: ["baonmz@nec.vn"],
//         status: false,
//     },
// ]

function TodosList() {
    const [content, setContent] = useState("");
    const [deadline, setDeadline] = useState("");
    const [assign, setAssign] = useState([]);
    const [add, setAdd] = useState(false);

    const [todos, setTodos] = useState([]);
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNotice, setIsNotice] = useState(false);
    const [notice, setNotice] = useState("");
    const [state, setState] = useState(true)

    const navigate = useNavigate();
    const auth = getAuth(app);
    const db = getFirestore(app);

    const [user, loading, error] = useAuthState(auth);
    if (!loading) {
        if (!user) {
            navigate("/");
        }
    }

    // getdata function
    const fetchData = async () => {

        await getDocs(collection(db, `todos`))
            .then((querySnapshot) => {
                const newTodos = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                console.log("newTodos:", newTodos);
                setTodos(newTodos);
                console.log("todos", todos)
            })
            .catch(error => console.log(error))

        await getDocs(collection(db, `users`))
            .then((querySnapshot) => {
                console.log(querySnapshot.docs)
                const newUsers = querySnapshot.docs.map((doc) => doc.data())
                console.log("userEmails:", newUsers[0].userEmails);
                setUsers(newUsers[0].userEmails)
                console.log("users: ", users)
            })
            .catch(error => console.log(error))

    }

    //getdata each update or the first time
    useEffect(() => {
        fetchData();
    }, [add])

    // function log out
    const Logout = () => {
        signOut(auth);
        navigate("/");
    }

    const handleCancelNotice = () => {
        setIsNotice(false);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setAssign(assign)
        setIsModalOpen(false);
    };


    const handleKeyDown = async (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            await handleAddTodo();
        }
    }


    const handleChangeContent = (e) => {
        setContent(e.target.value)
    }

    const handleChangeDeadline = (e) => {
        const dl = new Date(e.target.value);
        setDeadline(`${dl.getDate()}-${dl.getMonth() + 1}-${dl.getFullYear()}`);
    }

    const onChange = (checkedValues) => {
        setAssign(checkedValues);
    };

    const handleCheck = () => {
        setState(!state);
        console.log("click")
    };



    const handleAddTodo = async () => {
        const date = new Date();

        if (!content) {
            setIsNotice(true);
            setNotice("Please enter the content");
        } else {
            if (assign.length === 0) {
                setIsNotice(true);
                setNotice("Please enter the assign this for some people");
            } else {
                if (!deadline) {
                    setIsNotice(true);
                    setNotice("Please enter the deadline");
                } else {
                    console.log("Add todo:");
                    console.log("id:", todos.length + 1);
                    console.log("content:", content);
                    console.log("deadline: ", deadline);
                    console.log("createDate: ", `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`);
                    console.log("creator:", user.email);
                    console.log("assignNames:", assign);
                    console.log("status:", false);

                    await addDoc(collection(db, "todos"), {
                        id: todos.length + 1,
                        title: content,
                        deadline,
                        deadline: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
                        creator: user.email,
                        assignNames: assign,
                        status: false,
                    });
                    setAdd(!add);
                    setContent("");
                    setAssign([]);
                }
            }
        }
    }

    return (
        <div className={cx("wrapper")}>
            <Modal title="Let choice some people for this work" open={isModalOpen} onOk={handleOk} closable={false} cancelButtonProps={{ style: { display: 'none' } }}>
                <Checkbox.Group
                    style={{
                        width: '100%',
                    }}
                    onChange={onChange}
                >
                    <Row>
                        {
                            users.map((user, i) => (
                                <Col key={i} span={8}>
                                    <Checkbox value={user}>{user}</Checkbox>
                                </Col>
                            ))
                        }
                    </Row>
                </Checkbox.Group>
            </Modal>

            <Modal title="Notice" open={isNotice} cancelButtonProps={{ style: { display: 'none' } }} onOk={handleCancelNotice} closable={false}>
                {notice}
            </Modal>

            <div className={cx("todo-app")}>
                <h1 className={cx("title")}>Todos List of the Internship Programing <img className={cx("img-icon")} src={img} /></h1>

                <div className={cx("form-input")}>
                    <div className={cx("item-input-content", "item-input")}>
                        <label className={cx("label-input", "label-input-content")}>Content</label>
                        <input value={content} onChange={(e) => handleChangeContent(e)} onKeyDown={(e) => handleKeyDown(e)} type="text" className={cx("input")} placeholder="Enter your work" />
                    </div>

                    <div className={cx("item-input-date", "item-input")}>
                        <label className={cx("label-input", "label-input-date")}>Deadline</label>
                        <input onChange={(e) => handleChangeDeadline(e)} type="date" className={cx("input", "input-date")} />
                    </div>

                    <div className={cx("item-input-assign", "item-input")}>
                        <Button rootClassName={cx("label-input", "label-input-assign")} type="primary" onClick={showModal}>
                            Assign
                        </Button>
                    </div>

                    <button onClick={handleAddTodo} className={cx("btn-input")}>Add</button>
                </div>

                <div className={cx("container-task")}>
                    <ul className={cx("list-task")}>

                        {
                            todos?.map((todo, i) => (
                                (todo.assignNames.includes(user.email) || (user.email === todo.creator)) ?
                                    todo.status ? ((<li onClick={handleCheck} key={i} className={cx("task", "unchecked")}>
                                        STT: {i} - Title:{todo?.title} - Creator: {todo?.creator} - Assign: {todo?.assignNames}
                                    </li>)) : ((<li key={i} className={cx("task", "checked")}>
                                        STT: {i} - Title:{todo?.title} - Creator: {todo?.creator} - Assign: {todo?.assignNames}
                                    </li>))
                                    :
                                    ""
                            ))
                        }

                    </ul>
                </div>
            </div>
            <button onClick={() => Logout()}>Logout</button>
        </div >

    )
}

export default TodosList;