import React, { useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import { Link } from "react-router-dom";

import classNames from "classnames/bind";
import styles from "./Login.scss";

const cx = classNames.bind(styles);

function Login() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState("Log in isn't success");
    const [detail, setDetail] = useState("");

    const onFinish = (values) => {
        console.log("Success:", values);
        
        // Validation
        if (!values.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            
            // False => email
            // Logic
            setDetail("This isn't an email");
            showModal();
        } else {
            // True
            // Call api
            setTitle("Login is success");
            setDetail("Call Api login");
            showModal();
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
                    rootClassName="form"
                    name="basic"
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
                        <Button type="primary" htmlType="submit">
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