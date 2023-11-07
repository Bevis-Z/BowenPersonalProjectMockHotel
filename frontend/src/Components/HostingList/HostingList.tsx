import React, { useEffect, useState } from 'react';
import { StarOutlined } from '@ant-design/icons';
import { List, Space } from 'antd';
import HostingListImage from './HostingListImage';
import './index.css';

interface Review {
  comment: string;
  start: number;
}
interface Listing {
  id: number;
  title: string;
  owner: string;
  address: string;
  thumbnail: string[];
  price: number;
  reviews: Review[];
}

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const HostingList: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const fetchListings = async () => {
    try {
      const response = await fetch('http://localhost:5005/listings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        setListings(data.listings); // Assuming the JSON has a `listings` field
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error);
      alert('Failed to load listings.');
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);
  return (
    <>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 3,
        }}
        dataSource={listings}
        footer={
          <div>
            <b>ant design</b> footer part
          </div>
        }
        renderItem={(item) => (
          <List.Item
            key={item.title}
            actions={[
              <IconText icon={StarOutlined} text={`${item.reviews.length} reviews`} key="list-vertical-star-o" />,
            ]}
            extra={<HostingListImage thumbnails={item.thumbnail}/>}
          >
            <List.Item.Meta
              title={<a href={`/listings/${item.id}`}>{item.title}</a>}
              description={
                <>
                  <div>Price per night: ${item.price}</div>
                  <div>Address: {item.address}</div>
                </>
              }
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default HostingList;
