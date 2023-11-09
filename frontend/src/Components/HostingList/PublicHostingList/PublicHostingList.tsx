import React, { useEffect, useState } from 'react';
import { Listing } from '../HostingList/HostingListInterface';
import fetchListings from '../fetchListings';
import { Card, Spin } from 'antd';
import HostingListImage from '../HostingListImage/HostingListImage';
import './index.css';
import { StarOutlined } from '@ant-design/icons';
import { IconText } from '../HostingList/HostingList';
import { SearchFilters } from '../../../App';

interface PublicHostingListProps {
  searchFilters: SearchFilters;
}
function PublicHostingList ({ searchFilters }: PublicHostingListProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndSortListings = async () => {
      await fetchListings({ setIsLoading, setListings });
      setListings(prevListings =>
        [...prevListings].sort((a, b) =>
          a.title.localeCompare(b.title)
        )
      );
    };

    fetchAndSortListings();
  }, [searchFilters]);

  if (isLoading) {
    return <Spin tip="Loading..."></Spin>;
  }

  return (
    <div className={'publicListing'}>
      {listings.map((item) => (
        <div key={item.id} className={'publicHost'}>
          <Card
            hoverable
            cover={
              <HostingListImage thumbnails={item.thumbnail} />
            }
          >
          </Card>
          <h4>{item.title}</h4>
          <IconText icon={StarOutlined} text={`${item.averageRating?.toFixed(1) || 'N/A'} (${item.reviews.length} reviews)`} key="list-vertical-star-o" />
        </div>
      ))}
    </div>
  );
}

export default PublicHostingList;
