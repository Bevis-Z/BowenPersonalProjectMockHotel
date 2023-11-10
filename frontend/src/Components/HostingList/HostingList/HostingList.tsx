import React, { useEffect, useState } from 'react';
import { StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { List, Space, Button } from 'antd';
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

  const navigate = useNavigate();

  const handleTitleClick = (hostData: Listing) => {
    setCurrentEditingHost(hostData);
    setShowEditModal(true);
    navigate(`/edit-hosting/${hostData.id}`); // 更新路由
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
      alert('Listing deleted successfully');
    } catch (error) {
      console.error('Failed to delete listing:', error);
      alert('Failed to delete listing.');
    }
  };

  useEffect(() => {
    fetchListings({ setIsLoading, setListings });
  }, []);
  useEffect(() => {
    fetchListings({ setIsLoading, setListings });
  }, [refreshList]);
  console.log('Listings:', listings);
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
      alert('Unpublish successfully');
      fetchListings({ setIsLoading, setListings });
    } catch (error) {
      console.error('Failed to unpublish listing:', error);
      alert('Failed to unpublish listing.');
    }
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
              pagination={{
                pageSize: 3,
              }}
              dataSource={listings}
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
                      ? <Button onClick={() => handleUnpublish(item.id)}>Unpublish</Button>
                      : <Button onClick={() => handlePublish(item.id)}>Publish</Button>
                    }
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
