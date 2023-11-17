import React, { useState } from 'react';
import styles from './index.module.css';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateHosting from '../../Components/CreateHosting/CreateHosting';
import HostingList from '../../Components/HostingList/HostingList/HostingList';

// This component is used for user to manage their listings
function Hosting () {
  const [show, setShow] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleRefresh = () => {
    setRefreshList(prev => !prev);
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div className={styles.hosting}>
      <header className={styles.header}>
        <h1>Hostings</h1>
        <Button id={'createHost'} variant="btn btn-outline-primary" onClick={handleShow}>
          Airbnb Setup
        </Button>
      </header>
      <HostingList refreshList={refreshList} onHostCreated={handleRefresh} />
      <CreateHosting show={show} onHide={handleClose} onHostCreated={handleRefresh} />
    </div>);
}

export default Hosting;
