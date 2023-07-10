/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc, getFirestore, updateDoc, setDoc, doc } from "firebase/firestore";
import { Checkbox, Button, Modal, Row, Col, List } from "antd";

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
  // data input
  const [content, setContent] = useState("");
  const [deadline, setDeadline] = useState("");
  const [assign, setAssign] = useState([]);
  const [add, setAdd] = useState(false);

  // data render
  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState([]);

  // modal notice: content, deadline and assignment
  const [isNotice, setIsNotice] = useState(false);
  const [notice, setNotice] = useState("");

  //modal assign
  const [isModalOpen, setIsModalOpen] = useState(false);

  //modal edit deadline
  const [isEditDeadline, setIsEditDeadline] = useState(false);

  //modal edit Assignment
  const [isEditAssignment, setIsEditAssignment] = useState(false);

  // change value of key in data
  const [editTodo, setEditTodo] = useState({});

  // two-way binding
  const [state, setState] = useState(true);

  const navigate = useNavigate();
  const auth = getAuth(app);
  const db = getFirestore(app);

  // authentication
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
        const newTodos = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          doc_id: doc.id,
        }));
        setTodos(newTodos.sort((a, b) => {
          return b.id - a.id;
        }));
      })
      .catch((error) => console.log(error));

    await getDocs(collection(db, `users`))
      .then((querySnapshot) => {
        console.log(querySnapshot.docs);
        const newUsers = querySnapshot.docs.map((doc) => doc.data());
        console.log("userEmails:", newUsers[0].userEmails);
        setUsers(newUsers[0].userEmails);
        console.log("users: ", users);
      })
      .catch((error) => console.log(error));
  };

  //getdata each update or the first time
  useEffect(() => {
    fetchData();
  }, [add]);

  // function log out
  const Logout = () => {
    signOut(auth);
    navigate("/");
  };

  // show modal assign
  const showModal = () => {
    setIsModalOpen(true);
  };

  // handle cancel the modal notice
  const handleCancelNotice = () => {
    setIsNotice(false);
  };

  // handle ok the modal assign
  const handleOk = () => {
    setAssign(assign);
    setIsModalOpen(false);
  };

  // handle when press Enter
  const handleKeyDown = async (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      await handleAddTodo();
    }
  };

  // handle enter content
  const handleChangeContent = (e) => {
    setContent(e.target.value);
  };

  // handle enter deadline
  const handleChangeDeadline = (e) => {
    setDeadline(new Date(e.target.value));
  };

  // show modal edit deadline
  const handleEditDeadline = (todo) => {
    setIsEditDeadline(true);
    setEditTodo(todo);
  }

  // handle cancel modal deadline
  const handleCancleEditDeadline = () => {
    setEditTodo({});
    setIsEditDeadline(false);
  }

  // handle Ok modal edit deadline
  const handleOkEditDeadline = async () => {

    // console.log("deadline: ", deadline);
    await updateDoc(doc(db, "todos", `${editTodo.doc_id}`), {
      deadline: deadline.toString(),
    });
    // setDeadline("");
    setEditTodo({});
    setAdd(!add);

    setIsEditDeadline(false);
  }

  // change choice
  const onChange = (checkedValues) => {
    console.log(checkedValues);
    setAssign(checkedValues);
  };


  // show and handle modal Assignment
  const handleEditAssignment = (todo) => {
    setEditTodo(todo);
    console.log("edit:", todo);
    handleChangeAssignment();
    setIsEditAssignment(true);
  }

  // handle choice the someone
  const handleChangeAssignment = (checkedValues) => {
    setAssign(checkedValues);
  }

  // handle cancel assign
  const handleCancleEditAssignment = () => {
    setAssign([]);
    setEditTodo({});
    setIsEditAssignment(false);
  }

  // handle edit assignment
  const handleOkEditAssignment = async () => {

    await updateDoc(doc(db, "todos", `${editTodo.doc_id}`), {
      assignNames: assign,
    });

    setAssign([]);
    setEditTodo({});
    setAdd(!add);
    setIsEditAssignment(false);
  }

  // handle change status 
  const handleChangeStatus = async (todo) => {
    await updateDoc(doc(db, "todos", `${todo.doc_id}`), {
      status: !todo.status,
    });
    setAdd(!add);
  }

  // handle add Todo
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
          // console.log("Add todo:");
          // console.log("id:", todos.length + 1);
          // console.log("content:", content);
          // console.log("deadline: ", deadline.toString());
          // console.log(
          //   "createDate: ",
          //   date.toString()
          // );
          // console.log("creator:", user.email);
          // console.log("assignNames:", assign);
          // console.log("status:", true);

          await addDoc(collection(db, "todos"), {
            id: todos.length + 1,
            title: content,
            createTime: date.toString(),
            deadline: deadline.toString(),
            creator: user.email,
            assignNames: assign,
            status: true,
          });
          setAdd(!add);
          setContent("");
        }
      }
    }
  };

  return (
    <div className={cx("wrapper")}>

      {/* Modal choice assign */}
      <Modal
        title="Let choice some people for this work"
        open={isModalOpen}
        onOk={handleOk}
        closable={false}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <Checkbox.Group
          style={{
            width: "100%",
          }}
          onChange={onChange}
        >
          <Row>
            {users?.map((user, i) => (
              <Col key={i} span={8}>
                <Checkbox value={user}>{user}</Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </Modal>

      {/* Modal show Notice */}
      <Modal
        title="Notice"
        open={isNotice}
        cancelButtonProps={{ style: { display: "none" } }}
        onOk={handleCancelNotice}
        closable={false}
      >
        {notice}
      </Modal>

      {/* Modal Edit Deadline */}
      <Modal
        title="Edit Deadline"
        open={isEditDeadline}
        onCancel={handleCancleEditDeadline}
        onOk={handleOkEditDeadline}
        closable={false}
      >
        <div className={cx("item-input-date", "item-input")}>
          <label className={cx("label-input", "label-input-date")}>
            Deadline
          </label>
          <input
            onChange={(e) => handleChangeDeadline(e)}
            type="date"
            className={cx("edit-deadline")}
          />
        </div>
      </Modal>

      {/* Modal Edit Assignment */}
      <Modal
        title="Edit Assignment"
        open={isEditAssignment}
        onCancel={handleCancleEditAssignment}
        onOk={handleOkEditAssignment}
        closable={false}
      >
        <Checkbox.Group
          style={{
            width: "100%",
          }}
          onChange={handleChangeAssignment}
        >
          <Row>
            {users.map((user, i) => (
              <Col key={i} span={8}>
                <Checkbox checked={false} value={user}>{user}</Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </Modal>



      <div className={cx("todo-app")}>
        {/* Title */}
        <h1 className={cx("title")}>
          Todos List of the Internship Programing{" "}
          <img className={cx("img-icon")} src={img} />{" "}
        </h1>
        {/* Form Input data */}
        <div className={cx("form-input")}>
          {/* content input*/}
          <div className={cx("item-input-content", "item-input")}>
            <label className={cx("label-input", "label-input-content")}>
              Content
            </label>
            <input
              value={content}
              onChange={(e) => handleChangeContent(e)}
              onKeyDown={(e) => handleKeyDown(e)}
              type="text"
              className={cx("input")}
              placeholder="Enter your work"
            />
          </div>
          {/* date input*/}
          <div className={cx("item-input-date", "item-input")}>
            <label className={cx("label-input", "label-input-date")}>
              Deadline
            </label>
            <input
              onChange={(e) => handleChangeDeadline(e)}
              type="date"
              className={cx("input", "input-date")}
            />
          </div>
          {/* assign input */}
          <div className={cx("item-input-assign", "item-input")}>
            <Button style={{
              outline: "none",
            }}
              rootClassName={cx("label-input", "label-input-assign")}
              type="primary"
              onClick={showModal}
            >
              Assign
            </Button>
          </div>

          {/* button add */}
          <button style={{
            outline: "none",
          }} onClick={handleAddTodo} className={cx("btn-input")}>
            Add
          </button>
        </div>

        {/* List data */}
        <div className={cx("container-content")}>
          <List
            itemLayout="horizontal"
            dataSource={[""]}
            renderItem={() => (
              <List.Item
                actions={[
                  <div className={cx("task-action")}>
                    Acction
                  </div>,
                  <div className={cx("tag-creator")}>Creator</div>,
                  <div className={cx("btn-finish")}>Done</div>,
                ]}
              >

                <List.Item.Meta
                  title={`Task Name`}
                />
                <div className={cx("tag-assign")}>Who is responsible person</div>
                <div className={cx("tag-status")}>Status</div>
              </List.Item>
            )}
          />
        </div>
        <div className={cx("container-task")}>
          <ul className={cx("list-task")}>
            <List
              itemLayout="horizontal"
              dataSource={todos.length > 0 ? todos : []}
              renderItem={(todo, index) => (
                <List.Item
                  className={cx(todo.status ? "unchecked" : "checked",)}
                  actions={[
                    <Button style={{
                      outline: "none",
                    }}
                      disabled={!todo.status}
                      onClick={() => handleEditDeadline(todo)}
                      key="edit-deadline">Edit Deadline
                      <div className={cx("deadline")}>
                        {`${new Date(todo.deadline).getDate()}/${new Date(todo.deadline).getMonth() + 1}/${new Date(todo.deadline).getFullYear()}`}
                      </div>
                    </Button>,

                    <Button style={{
                      outline: "none",
                    }}
                      disabled={!todo.status}
                      type="default"
                      onClick={() => handleEditAssignment(todo)}
                    >Edit Assign</Button>,
                    <div className={cx("tag-creator")}>created by: {todo.creator ? todo.creator : "NaN...."}</div>,
                    <Button style={{
                      outline: "none",
                    }}
                      className={cx("btn-finish")}
                      onClick={() => handleChangeStatus(todo)}
                    >
                      {todo.status ? "Done" : "Yet"}</Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={`Task ${todos.length - index}: ${todo.title}`}
                  />

                  <div className={cx("tag-assign")}>{` ${todo.assignNames?.map((item) => (` ${item}`))}`}</div>

                  <div className={cx("tag-status")}>{todo.status ?
                    (new Date(`${(new Date().getMonth() + 1).toString()}/${(new Date().getDate()).toString()}/${(new Date().getFullYear()).toString()}`) - (new Date(todo.deadline)) < 0) ?
                      (new Date(`${(new Date().getMonth() + 1).toString()}/${(new Date().getDate()).toString()}/${(new Date().getFullYear()).toString()}`) - (new Date(todo.createTime)) > 0) ?
                        `posted ${new Date().getDate() - new Date(todo.createTime).getDate()} day(s) ago` : "New" : `${new Date().getDate() - new Date(todo.deadline).getDate()} day(s) over due` : "Finish"}
                  </div>
                </List.Item>
              )}
            >
            </List>

          </ul>
        </div>
        <div className={cx("container-content")}>
          <List
            itemLayout="horizontal"
            dataSource={[""]}
            renderItem={() => (
              <List.Item
                actions={[
                  <Button style={{
                    outline: "none",
                  }} className={cx("btn-finish")} onClick={() => Logout()}>Logout</Button>
                ]}
              >

                <List.Item.Meta
                />
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default TodosList;
