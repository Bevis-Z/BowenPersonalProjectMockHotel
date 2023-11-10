import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DatePicker, Button, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import HostingListImage from '../HostingList/HostingListImage/HostingListImage';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { RangeValue } from 'rc-picker/lib/interface';

const { RangePicker } = DatePicker;
const ListingDetail: React.FC = () => {
  const location = useLocation();
  const listing = location.state?.listing;
  const searchFilters = location.state?.searchFilters;
  const [bookingDates, setBookingDates] = useState<RangePickerProps['value']>(null);
  if (!listing) {
    return <div>Loading...</div>;
  }
  console.log('Listing Details', listing);
  const handleBookingConfirm = async () => {
    if (!bookingDates || !bookingDates[0] || !bookingDates[1]) {
      message.error('Please select the booking dates.');
      return;
    }
    const totalPrice = calculatePriceForStay(
      listing.price,
      bookingDates[0].toDate(),
      bookingDates[1].toDate()
    );

    // 发送请求
    try {
      const response = await fetch(`http://localhost:5005/bookings/new/${listing.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ dateRange: bookingDates, totalPrice })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send booking request');
      }
      message.success('Booking confirmed!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      message.error(errorMessage);
    }
  };
  const handleBookingDatesChange = (
    dates: RangeValue<Dayjs>,
  ) => {
    setBookingDates(dates);
    console.log('Booking dates:', dates);
  };
  const priceDisplay = searchFilters && searchFilters.startDate && searchFilters.endDate
    ? `Price for Stay: ${calculatePriceForStay(listing.price, searchFilters.startDate, searchFilters.endDate)}`
    : `Price per Night: ${listing.price}`;

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:5005/bookings/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send booking request');
      }
      message.success('Fetch Success');
      console.log('Bookings:', await response.json());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      message.error(errorMessage);
    }
  }
  fetchBookings();
  return (
    <div>
      <h1>{listing.title}</h1>
      <HostingListImage thumbnails={listing.thumbnail} />
      <p>Address: {listing.address}</p>
      <p>{priceDisplay}</p>
      <p>Type: {listing.metadata.propertyType}</p>
      <p>Reviews: {/* ... */}</p>
      <p>Rating: {listing.averageRating}</p>
      <p>Bedrooms: {listing.metadata.bedrooms.length}</p>
      <p>Beds: {listing.totalBeds}</p>
      <p>Bathrooms: {listing.metadata.bathroomNumber}</p>
      <RangePicker
        format="YYYY-MM-DD"
        onChange={handleBookingDatesChange}
      />
      <Button
        type="primary"
        onClick={handleBookingConfirm}
        disabled={!bookingDates || !bookingDates[0] || !bookingDates[1]}
      >
        Confirm Booking
      </Button>
    </div>
  );
};

export default ListingDetail;

// 辅助函数：计算总住宿价格
function calculatePriceForStay (pricePerNight: number, startDate: Date, endDate: Date) {
  const days = dayjs(endDate).diff(dayjs(startDate), 'day');
  return pricePerNight * days;
}
