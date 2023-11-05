import React from 'react';
import { Form, Modal } from 'react-bootstrap';
import './loginmodal.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link } from 'react-router-dom';

// Define a type for the LoginModal props
type LoginModalProps = {
  show: boolean;
  onHide: () => void; // Assuming no parameters are passed to this function
}

function LoginModal ({ show, onHide }: LoginModalProps) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Welcome to Airbnb</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div>
            <label>Email</label>
            <Form.Control type="text" className="form-control" id="inputUserEmail" placeholder="Email"/>
          </div>
          <div>
            <label>Password</label>
            <Form.Control type="password" className="form-control" id="inputUserPassword" placeholder="Password"/>
          </div>
          <div>
            <button type="submit" className="btn btn-primary mb-3">Login</button>
          </div>
          <Link to={'/register'}>Register Now</Link>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
export default LoginModal;
