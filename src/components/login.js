import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Login = props => {

    //-- we set the initial name and id fields to be empty
    const [name, setName] = useState("");
    const [id, setId] = useState("");

    //-- binds the 'name' field value to the 'name' state variable
    const onChangeName = e => {
        const name = e.target.value;
        setName(name);
    }

    //-- binds the 'id' field value to the 'id' state variable
    const onChangeId = e => {
        const id = e.target.value;
        setId(id);
    }

    //-- this method calls 'login'
    //   App.js has a method of the same name that is called in turn through props.login
    //-- in other words, from the Login component, we call the login function in App.js and set App.js's 'user' state
    //   we are then able to pass on the logged-in 'user' to other components
    const login = () => {
        props.login({
            name: name, 
            id: id
        });
        props.history.push('/');
    }

    return (
        <div>
            <Form>
                <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter Username'
                        value={name}
                        onChange={onChangeName}>
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>ID</Form.Label>
                    <Form.Control
                        tupe='text'
                        placeholder='Enter ID'
                        value={id}
                        onChange={onChangeId}>
                    </Form.Control>
                </Form.Group>
                <Button variant='primary' onClick={login}>Submit</Button>
            </Form>
        </div>
    )

}

export default Login;