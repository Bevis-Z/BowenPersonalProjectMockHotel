import React from 'react';
import { Form, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

type RegisterModalProps = {
  show: boolean;
  onHide: () => void; // Assuming no parameters are passed to this function
}
function RegisterModal ({ show, onHide }: RegisterModalProps) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Register to Airbnb</Modal.Title>
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
          <Link to={'/login'}>Click to Login</Link>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
export default RegisterModal;
