import React, { useState } from 'react';
import './index.css';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateHosting from '../../Components/CreateHosting/CreateHosting';
import HostingList from '../../Components/HostingList/HostingList/HostingList';

function Hosting () {
  const [show, setShow] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleRefresh = () => {
    setRefreshList(prev => !prev);
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div className={'hosting'}>
      <header>
        <h1>Hosting</h1>
        <Button variant="btn btn-outline-primary" onClick={handleShow}>
          Airbnb Setup
        </Button>
      </header>
      <HostingList refreshList={refreshList} onHostCreated={handleRefresh} />
      <CreateHosting show={show} onHide={handleClose} onHostCreated={handleRefresh} />
    </div>);
}

export default Hosting;
