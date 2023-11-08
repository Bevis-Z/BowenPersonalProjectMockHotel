import React, { useEffect, useState } from 'react';
import { StarOutlined } from '@ant-design/icons';
import { List, Space } from 'antd';
import HostingListImage from '../HostingListImage/HostingListImage';
import { BiSolidBath, BiSolidBed } from 'react-icons/bi';
import './index.css';
import CreateHosting from '../../CreateHosting/CreateHosting';

interface Review {
  comment: string;
  star: number;
}

type Bed = {
  count: number;
  size: 'queen' | 'king' | 'double' | 'single';
};
type Bedroom = {
  type: string;
  beds: Bed[];
};

interface Metadata {
  propertyType: string;
  bathroomNumber: string;
  bedrooms: Bedroom[];
  amenities: string[];
}
interface Listing {
  error?: string;
  id: number;
  title: string;
  owner: string;
  address: string;
  thumbnail: string[];
  price: string;
  reviews: Review[];
  totalBeds?: number; // 新增字段，床位总数
  averageRating?: number; // 新增字段，平均评分
  metadata: Metadata;
}
interface ListingDetails {
  title: string;
  owner: string;
  address: string;
  price: string;
  thumbnail: string[];
  metadata: Metadata;
  reviews: Review[];
  availability?: boolean; // 根据您的实际数据类型调整
  published: boolean;
  postedOn: string | null;
}

interface HostingListProps {
  refreshList: boolean;
  onHostCreated: () => void;
}
const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
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
  const handleTitleClick = (hostData: Listing) => {
    setCurrentEditingHost(hostData);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setCurrentEditingHost(null);
  };
  const calculateTotalBeds = (bedrooms: Bedroom[]): number => {
    return bedrooms.reduce((total, bedroom) => {
      return total + bedroom.beds.reduce((bedTotal, bed) => bedTotal + bed.count, 0);
    }, 0);
  };

  const calculateAverageRating = (reviews: Review[]): number => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((total, review) => total + review.star, 0);
    return totalRating / reviews.length;
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
  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5005/listings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json() as { listings: Listing[], error?: string };
      if (data.error) {
        throw new Error(data.error);
      } else {
        console.log('Initial data:', data); // 日志输出：初始数据
        const listingsWithDetails: Listing[] = await Promise.all(
          data.listings.map(async (listing): Promise<Listing> => {
            try {
              const detailsResponse = await fetch(`http://localhost:5005/listings/${listing.id}`);
              const detailsJson = await detailsResponse.json();
              if (detailsJson.error) {
                throw new Error(detailsJson.error);
              } else {
                const detailsData = detailsJson.listing as ListingDetails;
                return {
                  ...listing,
                  ...detailsData,
                  totalBeds: calculateTotalBeds(detailsData.metadata.bedrooms),
                  averageRating: calculateAverageRating(detailsData.reviews),
                };
              }
            } catch (error) {
              console.error(`Failed to fetch details for listing ${listing.id}:`, error);
              return listing; // 在这里返回原始列表项，而不是部分填充的对象
            }
          })
        );
        console.log('Listings with details:', listingsWithDetails); // 日志输出：带详细信息的列表
        setListings(listingsWithDetails);
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error);
      alert('Failed to load listings.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);
  useEffect(() => {
    fetchListings();
    console.log('refreshList', refreshList);
  }, [refreshList]);
  return (
    <>
      {isLoading
        ? <div>Loading...</div>
        : (
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
              renderItem={(item: Listing) => (
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
                    <button onClick={() => handleDelete(item.id)}>Delete</button> {/* 删除按钮 */}
                  </List.Item>
                </>
              )}
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
