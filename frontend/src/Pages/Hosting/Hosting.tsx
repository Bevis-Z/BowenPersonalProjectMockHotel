import React, { useState } from 'react';
import './index.css';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateHosting from '../../Components/CreateHosting/CreateHosting';

function Hosting () {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div className={'hosting'}>
      <header>
        <h1>Hosting</h1>
        <Button variant="primary" onClick={handleShow}>
          Airbnb Setup
        </Button>
      </header>
      <CreateHosting show={show} onHide={handleClose}/>
    </div>);
}

export default Hosting;
