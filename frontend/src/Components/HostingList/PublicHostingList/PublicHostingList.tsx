import React, { useEffect, useState } from 'react';
import { Booking, Listing } from '../HostingList/HostingListInterface';
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
  const [userBookings, setUserBookings] = useState<Booking[]>([]);

  const currentUserEmail = localStorage.getItem('currentUserEmail');
  const token = localStorage.getItem('token');

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:5005/bookings/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch bookings');
      }
      const bookingData = await response.json();
      const userBookings = bookingData.bookings.filter((booking: Booking) =>
        booking.owner === currentUserEmail && (booking.status === 'accepted' || booking.status === 'pending')
      );
      setUserBookings(userBookings); // Update the state with the user's relevant bookings
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Handle error (e.g., display a message to the user)
    }
  };

  useEffect(() => {
    if (token) {
      fetchBookings(); // Fetch bookings only if user is logged in
    }
  }, [token]);
  const navigate = useNavigate();
  const handleListingClick = (listing:Listing) => {
    navigate(`/listing/${listing.id}`, { state: { listing, searchFilters } });
  };

  useEffect(() => {
    const fetchAndSortListings = async () => {
      await fetchListings({ setIsLoading, setListings });

      setListings(prevListings => {
        const userBookingIds = userBookings.map(booking => booking.listingId);
        const userBookingListings = prevListings.filter(listing => userBookingIds.includes(listing.id.toString()));
        const otherListings = prevListings.filter(listing => !userBookingIds.includes(listing.id.toString()));

        return [
          ...userBookingListings.sort((a, b) => a.title.localeCompare(b.title)),
          ...otherListings.sort((a, b) => a.title.localeCompare(b.title))
        ];
      });
    };
    fetchAndSortListings();
  }, [searchFilters, userBookings]);

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
      {filtered.map((item) => {
        const hasUserBooking = userBookings.some(booking =>
          booking.listingId === item.id.toString() &&
          (booking.status === 'accepted' || booking.status === 'pending')
        );

        // Append '(Booking)' to the title if the above condition is true
        const listingTitle = hasUserBooking ? `${item.title} (Booking)` : item.title;

        return (
        <div key={item.id} className={'publicHost'} onClick={() => handleListingClick(item)}>
          <Card
            hoverable
            cover={
              <HostingListImage thumbnails={item.thumbnail}/>
            }
          >
          </Card>
          <h4>{listingTitle}</h4>
          <IconText icon={StarOutlined}
                    text={`${item.averageRating?.toFixed(1) || 'N/A'} (${item.reviews.length} reviews)`}
                    key="list-vertical-star-o"/>
        </div>
        );
      })}
    </div>
  );
}

export default PublicHostingList;
