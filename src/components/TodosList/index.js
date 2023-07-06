import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc, getFirestore } from "firebase/firestore";
import { Checkbox, Button, Modal } from 'antd';


import classNames from "classnames/bind";
import styles from "./TodosList.module.scss";
import { app } from "../../firebase";
import { useEffect, useState } from "react";
import img from "../../img/icon.png";

const cx = classNames.bind(styles);
const plainOptions = ['Apple', 'Pear', 'Orange'];

const dataExample = [
    {
        id: 1,
        title: "Create Plan",
        creator: "tanpnz@nec.vn",
        timeCreate: "07/04/2023",
        deadline: "07/06/2023",
        assignNames: ["tanpnz@nec.vn", "baonmz@nec.vn"],
        status: true,
    },

    {
        id: 2,
        title: "Design FE",
        creator: "tanpnz@nec.vn",
        timeCreate: "07/04/2023",
        deadline: "07/05/2023",
        assignNames: ["tanpnz@nec.vn"],
        status: false,
    },

    {
        id: 3,
        title: "Test3",
        creator: "tanpnz@nec.vn",
        timeCreate: "07/04/2023",
        deadline: "07/05/2023",
        assignNames: ["baonmz@nec.vn"],
        status: false,
    },
]

function TodosList() {
    const [content, setContent] = useState("");
    const [deadline, setDeadline] = useState("");
    const [assign, setAssign] = useState([]);

    const [todo, setTodo] = useState("");
    const [todos, setTodos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();
    const auth = getAuth(app);
    const db = getFirestore(app);

    const [user, loading, error] = useAuthState(auth);
    if (!loading) {
        if (!user) {
            navigate("/");
        }
    }

    const onChange = (checkedValues) => {
        setAssign(checkedValues);
    };

    const fetchData = async () => {

        await getDocs(collection(db, `todos`))
            .then((querySnapshot) => {
                const newTodos = querySnapshot.docs.map((doc) => doc.data())
                console.log("newTodos:", newTodos);
                setTodos(newTodos);
            })
            .catch(error => console.log(error))
    }

    useEffect(() => {
        fetchData();
        console.log("todos1: ", todos);
    }, [])

    const Logout = () => {
        signOut(auth);
        navigate("/")
    }

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        console.log(assign)
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    
    const handleChangeContent = (e) => {
        setContent(e.target.value);
    }

    const handleChangeDeadline = (e) => {
        const dl = new Date(e.target.value);
        setDeadline(`${dl.getDate()}-${dl.getMonth() + 1}-${dl.getFullYear()}`);
    }

    const handleAddTodo = () => {
        const date = new Date();

        console.log("Add todo:");
        console.log("content:", !!content);
        console.log("deadline: ", !!deadline);
        console.log("creatorDate: ", `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`);
        console.log("creator:", user.email);
    }

    return (
        <div className={cx("wrapper")}>
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Checkbox.Group options={plainOptions} onChange={onChange} />
            </Modal>
            <div className={cx("todo-app")}>
                <h1 className={cx("title")}>Todos List of the Internship Programing <img className={cx("img-icon")} src={img} /></h1>

                <div className={cx("form-input")}>
                    <div className={cx("item-input-content", "item-input")}>
                        <label className={cx("label-input", "label-input-content")}>Content</label>
                        <input onChange={(e) => handleChangeContent(e)}  type="text" className={cx("input")} placeholder="Enter your work" />
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

                {/* <ul className={cx("list-task")}>
                    <li className={cx("task", "unchecked")}>Task 1</li>
                    <li className={cx("task", "unchecked")}>Task 2</li>
                    <li className={cx("task")}>Task 3</li>

                </ul> */}
            </div>

            {/* <div>
                {
                    todos?.map((todo, i) => (
                        (todo.assignNames.includes(user.email) || (user.email === todo.creator)) ?
                            (<p key={i}>
                                STT: {todo?.id} - Title:{todo?.title} - Creator: {todo?.creator} - Assign: {todo?.assignNames}
                                {console.log("Assign:", todo.assignNames)}
                            </p>)
                            : 
                            ""
                    ))
                }
            </div> */}

            {/* <div className={cx("detail")}>
                <div className={cx("form-task")}>
                    <ul className={cx("form-task-list")}>
                        <ul className={cx("form-inform-task")}>
                            <li className={cx("item-inform-task")}>STT</li>
                            <li className={cx("item-inform-task")}>Content</li>
                            <li className={cx("item-inform-task")}>Assign</li>
                            <li className={cx("item-inform-task")}>Action</li>
                        </ul>
                        <div className={cx("form-task-item")}>
                            <li className={cx("item")}>
                                Task1: Create Plan
                            </li>
                            <button>Edit</button>
                            <button>Detail</button>
                            <button>Delete</button>
                        </div>



                        <div className={cx("form-task-item")}>
                            <li className={cx("item")}>
                                Task1: Create Plan
                            </li>
                            <button>Edit</button>
                            <button>Detail</button>
                            <button>Delete</button>
                        </div>

                    </ul>
                </div>

                <button className={cx("button-done-task")}>Finish</button>
                <button className={cx("button-yet-task")}>Yet</button>
                
            </div> */}
            <button onClick={() => Logout()}>Logout</button>
        </div >

    )
}

export default TodosList;