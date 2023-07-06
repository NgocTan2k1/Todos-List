import React, { useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';

import classNames from "classnames/bind";
import styles from "./Register.module.scss";
import { app } from '../../firebase';

const cx = classNames.bind(styles);
const auth = getAuth(app);

function Register() {
    const [title, setTitle] = useState("");
    const [detail, setDetail] = useState("");
    const navigate = useNavigate();
    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useCreateUserWithEmailAndPassword(auth);
    const [isModalOpen, setIsModalOpen] = useState(false);


    async function onFinish(values) {

        // Validation
        if (!values.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            // False => Email
            // Logic => show modal notice.
            setDetail("This isn't an email");
            showModal();
        }
        else {
            if (values.password !== values.confirmpassword) {
                // False => password to register
                // Logic => show modal notice. 
                setTitle("Register isn't success");
                setDetail("Password and Confirm Password don't match");
                showModal();
            } else {
                createUserWithEmailAndPassword(values.email, values.password)
                    .then(res => {
                        if (!res) {
                            setTitle("Register isn't success");
                            setDetail("Please check email or passwork");
                            showModal();
                        } else {
                            console.log(res.user.uid);
                            navigate("/todos-list");
                        }

                    })
            }
        }




    };


    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
        setTitle("Register isn't success");
        setDetail("You must enter fully the information to register");
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

            <h1 className={cx("title")}>Register</h1>
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
                                message: 'Please input your email!',
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
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirmpassword"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your confirm password!',
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
                        <Button rootClassName={cx("btn-register")} type="primary" htmlType="submit">
                            Register
                        </Button>

                        <Link className={cx("link-register")} to="/">You have had account</Link>
                    </Form.Item>
                </Form>
            </div>

        </div>

    )
}

export default Register;