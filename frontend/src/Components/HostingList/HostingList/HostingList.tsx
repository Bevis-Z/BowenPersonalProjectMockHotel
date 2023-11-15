import React, { useEffect, useState } from 'react';
import StarOutlined from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { List, Space, Button, message, Empty } from 'antd';
import HostingListImage from '../HostingListImage/HostingListImage';
import { BiSolidBath, BiSolidBed } from 'react-icons/bi';
import './index.css';
import CreateHosting from '../../CreateHosting/CreateHosting';
import { HostingListProps, Listing } from './HostingListInterface';
import PublishModal from '../PublishModal';
import fetchListings from '../fetchListings';

export const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const HostingList: React.FC<HostingListProps> = ({ refreshList, onHostCreated }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditingHost, setCurrentEditingHost] = useState<Listing | null>(null);
  const currentUserEmail = localStorage.getItem('currentUserEmail');
  const currentUserListings = listings.filter((item) => item.owner === currentUserEmail);

  const navigate = useNavigate();

  const handleTitleClick = (hostData: Listing) => {
    setCurrentEditingHost(hostData);
    setShowEditModal(true);
    navigate(`/edit-hosting/${hostData.id}`);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setCurrentEditingHost(null);
    navigate('/hosting/');
  };
  const handleDelete = async (listingId: number) => {
    try {
      await fetch(`http://localhost:5005/listings/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });

      // Filter out the deleted listing from the state
      const updatedListings = listings.filter(listing => listing.id !== listingId);
      setListings(updatedListings);
      message.success('Listing deleted successfully');
    } catch (error) {
      console.error('Failed to delete listing:', error);
      message.error('Failed to delete listing.');
    }
  };

  useEffect(() => {
    fetchListings({ setIsLoading, setListings });
  }, []);
  useEffect(() => {
    fetchListings({ setIsLoading, setListings });
  }, [refreshList]);
  const [publishModalVisible, setPublishModalVisible] = useState(false);
  const [currentListingId, setCurrentListingId] = useState<number>(0);

  const handlePublish = (id: number) => {
    setCurrentListingId(id);
    setPublishModalVisible(true);
  };

  const handleUnpublish = async (id: number) => {
    try {
      await fetch(`http://localhost:5005/listings/unpublish/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });
      message.success('Unpublish successfully');
      fetchListings({ setIsLoading, setListings });
    } catch (error) {
      message.error('Failed to unpublish listing.');
    }
  };

  const listLocale = {
    emptyText: (
      <div className="custom-empty-data">
        <Empty />
      </div>
    ),
  };
  const handleModalOk = (selectedDates: string[]) => {
    if (!currentListingId || !selectedDates) return;
    setPublishModalVisible(false);
    fetchListings({ setIsLoading, setListings });
  };

  const handleModalCancel = () => {
    setPublishModalVisible(false);
  };
  return (
    <>
      {isLoading
        ? <div>Loading...</div>
        : (
            <List
              itemLayout="vertical"
              size="large"
              pagination={
                currentUserListings.length > 0
                  ? {
                      pageSize: 3,
                    }
                  : false
              }
              dataSource={currentUserListings}
              renderItem={(item: Listing) => {
                if (item.owner !== currentUserEmail) {
                  return null;
                }
                return (
                <>
                  <List.Item
                    key={item.id}
                    actions={[
                      <IconText icon={StarOutlined} text={`${item.averageRating?.toFixed(1) || 'N/A'} (${item.reviews.length} reviews)`} key="list-vertical-star-o" />,
                    ]}
                    extra={<HostingListImage thumbnails={item.thumbnail}/>}
                  >
                    <List.Item.Meta
                      title={<a onClick={() => handleTitleClick(item)}>{item.title} ({item.metadata.propertyType})</a>}
                      description={
                        <>
                          <div>Price per night: ${item.price}</div>
                          <div>Address: {item.address}</div>
                          <div className={'bedBathBox'}>
                            <div><BiSolidBed/> {item.totalBeds}</div>
                            <div><BiSolidBath/> {item.metadata.bathroomNumber}</div>
                          </div>
                        </>
                      }
                    />
                    <Button danger onClick={() => handleDelete(item.id)}>Delete</Button> {/* 删除按钮 */}
                    {item.published
                      ? <Button className={'publishBtn'} onClick={() => handleUnpublish(item.id)}>Unpublish</Button>
                      : <Button className={'publishBtn'} onClick={() => handlePublish(item.id)}>Publish</Button>
                    }
                    <Button
                      type="primary"
                      onClick={() => navigate(`/bookings/${item.id}`, { state: { listing: item } })}
                      id="viewBooking"
                    >
                      View History
                    </Button>
                  </List.Item>
                  <PublishModal
                    visible={publishModalVisible}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                    currentHostId={currentListingId}
                  />
                </>
                );
              }}
              locale={listLocale}
            />
          )}
      {showEditModal && currentEditingHost && (
        <CreateHosting
          show={showEditModal}
          onHide={ handleCloseEditModal }
          editing={true}
          initialData={currentEditingHost}
          onHostCreated={onHostCreated}
        />
      )}
    </>
  );
};

export default HostingList;
