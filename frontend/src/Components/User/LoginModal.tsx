import React from 'react';
import { Form, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import './loginmodal.css';
import { message } from 'antd';

// Define a type for the LoginModal props
type LoginModalProps = {
  show: boolean;
  onHide: () => void; // Assuming no parameters are passed to this function
}

// This is the LoginModal component that will be rendered in the App component
function LoginModal ({ show, onHide }: LoginModalProps) {
  const [userEmail, setUserEmail] = React.useState('');
  const [userPassword, setUserPassword] = React.useState('');
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const defaultUserLoginRequest = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const response = await fetch('http://localhost:5005/user/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: userEmail, password: userPassword })
    });
    const data = await response.json();
    console.log(data);
    if (data.error) {
      message.error(data.error);
    } else {
      message.success('Login successfully');
      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUserEmail', userEmail);
      setIsLoggedIn(true);
      onHide();
    }
  }
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Welcome to Airbnb</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div>
            <label>Email</label>
            <Form.Control type="text" className="form-control" onChange={(event) => setUserEmail(event.target.value)} id="inputUserEmail" value={userEmail}/>
          </div>
          <div>
            <label>Password</label>
            <Form.Control type="password" onChange={(event) => setUserPassword(event.target.value)} className="form-control" id="inputUserPassword" value={userPassword}/>
          </div>
          <Link to={'/register'}>Register Now</Link>
          <div>
            <button type="submit" id={'loginButton'} className="btn btn-primary" onClick={ defaultUserLoginRequest }>Login</button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
export default LoginModal;
