import React from 'react';
import { Form, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

type RegisterModalProps = {
  show: boolean;
  onHide: () => void; // Assuming no parameters are passed to this function
}
function RegisterModal ({ show, onHide }: RegisterModalProps) {
  const [userEmail, setUserEmail] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [userPassword, setUserPassword] = React.useState('');
  const [checkUserPassword, setCheckUserPassword] = React.useState('');
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  const defaultUserRegisterRequest = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    if (userPassword !== checkUserPassword) {
      alert('Password is not same');
      return;
    }
    const response = await fetch('http://localhost:5005/user/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: userEmail, name: userName, password: userPassword })
    });
    const data = await response.json();
    console.log(data);
    if (data.error) {
      alert(data.error);
    } else {
      alert('Register successfully');
      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
      onHide();
    }
  }
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Register to Airbnb</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div>
            <label>Email</label>
            <Form.Control type="text" className="form-control" id="inputUserEmail" onChange={(event) => setUserEmail(event.target.value)} value={userEmail}/>
          </div>
          <div>
            <label>UserName</label>
            <Form.Control type="text" className="form-control" id="inputUserName" onChange={(event) => setUserName(event.target.value)} value={userName}/>
          </div>
          <div>
            <label>Password</label>
            <Form.Control type="password" className="form-control" id="inputUserPassword" onChange={(event) => setUserPassword(event.target.value)} value={userPassword}/>
          </div>
          <div>
            <label>Check Password</label>
            <Form.Control type="password" className="form-control" id="checkUserPassword" onChange={(event) => setCheckUserPassword(event.target.value)} value={checkUserPassword}/>
          </div>
          <div>
            <button type="submit" className="btn btn-primary mb-3" onClick={ defaultUserRegisterRequest }>Register</button>
          </div>
          <Link to={'/login'}>Click to Login</Link>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
export default RegisterModal;
