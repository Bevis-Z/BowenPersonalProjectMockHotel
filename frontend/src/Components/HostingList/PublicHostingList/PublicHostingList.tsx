import React, { useEffect, useState } from 'react';
import { Listing } from '../HostingList/HostingListInterface';
import fetchListings from '../fetchListings';
import { Card, Spin } from 'antd';
import HostingListImage from '../HostingListImage/HostingListImage';
import './index.css';
import { StarOutlined } from '@ant-design/icons';
import { IconText } from '../HostingList/HostingList';
import { SearchFilters } from '../../../App';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';

interface PublicHostingListProps {
  searchFilters: SearchFilters;
}
function enumerateDaysBetweenDates (startDate: Dayjs, endDate: Dayjs): string[] {
  const dates: string[] = [];
  let currentDate = dayjs(startDate);

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
    dates.push(currentDate.format('YYYY-MM-DD'));
    currentDate = currentDate.add(1, 'day');
  }

  return dates;
}
function PublicHostingList ({ searchFilters }: PublicHostingListProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtered, setFiltered] = useState<Listing[]>([]);

  const navigate = useNavigate(); // 使用 react-router-dom 的 useNavigate 钩子

  const handleListingClick = (listing:Listing) => {
    navigate(`/listing/${listing.id}`, { state: { listing, searchFilters } });
  };

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

  useEffect(() => {
    // 筛选逻辑
    const filteredListings = listings.filter(listing => {
      const searchTextLower = searchFilters.searchText.toLowerCase(); // 转为小写
      const withinBedroomRange = (searchFilters.minBedrooms == null || listing.totalBeds >= searchFilters.minBedrooms) &&
        (searchFilters.maxBedrooms == null || listing.totalBeds <= searchFilters.maxBedrooms);
      // 检查日期范围是否满足条件
      let withinDateRange = true;
      if (searchFilters.startDate && searchFilters.endDate) {
        const startDay = searchFilters.startDate ? dayjs(searchFilters.startDate) : null;
        const endDay = searchFilters.endDate ? dayjs(searchFilters.endDate) : null;
        if (startDay && endDay) {
          const dates = enumerateDaysBetweenDates(startDay, endDay);
          withinDateRange = dates.every(date =>
            listing.availability.map(availDate => dayjs(availDate).format('YYYY-MM-DD')).includes(date)
          );
        }
      }
      const withinPriceRange = (searchFilters.minPrice == null || listing.price >= searchFilters.minPrice) &&
        (searchFilters.maxPrice == null || listing.price <= searchFilters.maxPrice);
      const withinRatingRange = (searchFilters.minRating == null || listing.averageRating >= searchFilters.minRating) &&
        (searchFilters.maxRating == null || listing.averageRating <= searchFilters.maxRating);
      const isPublished = listing.published;

      return (
        (searchFilters.searchText ? listing.title.toLowerCase().includes(searchTextLower) || listing.address.toLowerCase().includes(searchTextLower) : true) &&
        withinBedroomRange &&
        withinDateRange &&
        withinPriceRange &&
        withinRatingRange &&
        isPublished
      );
    });
    setFiltered(filteredListings);
  }, [listings, searchFilters]);
  if (isLoading) {
    return <Spin tip="Loading..."></Spin>;
  }

  return (
    <div className={'publicListing'}>
      {filtered.map((item) => (
        <div key={item.id} className={'publicHost'} onClick={() => handleListingClick(item)}>
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
