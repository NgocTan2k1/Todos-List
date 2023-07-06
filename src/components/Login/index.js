import React, { useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { getAuth } from 'firebase/auth';
import { useAuthState, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { app } from '../../firebase';


import classNames from "classnames/bind";
import styles from "./Login.module.scss";

const cx = classNames.bind(styles);

function Login() {
    const navigate = useNavigate();
    const auth = getAuth(app);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [detail, setDetail] = useState("");
    const [
        signInWithEmailAndPassword,
    ] = useSignInWithEmailAndPassword(auth);

    const [user, loading, error] = useAuthState(auth);
    if(!loading) {
        if(user) {
            navigate("/todos-list");
        }
    }

    const onFinish = (values) => {
        console.log("Success:", values);

        // Validation
        if (!values.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            // False => email
            // Logic
            setTitle("Log in isn't success");
            setDetail("This isn't an email");
            showModal();
        } else {
            // True
            // Call api
            signInWithEmailAndPassword(values.email, values.password)
                .then(res => {
                    if (!res) {
                        setTitle("Log in isn't success");
                        setDetail("Email or password is not true");
                        showModal()
                    } else {
                        console.log(res);
                        navigate("/todos-list")
                    }

                })
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
        console.log("ERROR");
        setDetail("You must enter fully the information to login");
        showModal();
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={cx("wrapper")}>
            <Modal title={title} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>{detail}</p>
            </Modal>

            <h1 className={cx("title")}>Login</h1>
            <div className={cx("form-wrapper")}>
                <Form
                    rootClassName={cx("form")}
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Please input your email!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your password!",
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button rootClassName={cx("btn-login")} type="primary" htmlType="submit">
                            Login
                        </Button>
                        <Link className={cx("link-register")} to="/register" >You don't account</Link>
                    </Form.Item>
                </Form>
            </div>
        </div >

    )
}

export default Login;