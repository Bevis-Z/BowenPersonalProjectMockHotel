import React from 'react';
import { Form, Modal } from 'react-bootstrap';
import './loginmodal.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

// Define a type for the LoginModal props
type LoginModalProps = {
  show: boolean;
  onHide: () => void; // Assuming no parameters are passed to this function
}

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
      alert(data.error);
    } else {
      alert('Login successfully');
      localStorage.setItem('token', data.token);
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
          <div>
            <button type="submit" className="btn btn-primary" onClick={ defaultUserLoginRequest }>Login</button>
          </div>
          <Link to={'/register'}>Register Now</Link>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
export default LoginModal;
