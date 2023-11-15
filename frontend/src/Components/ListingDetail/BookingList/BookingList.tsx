// BookingList.tsx
import React, { useState } from 'react';
import { Booking } from '../../HostingList/HostingList/HostingListInterface';
import { Button, List } from 'antd';
import './index.css';
import dayjs from 'dayjs';

interface BookingListProps {
  userBookings: Booking[];
}

export const BookingList: React.FC<BookingListProps> = ({ userBookings }) => {
  const [visibleBookings, setVisibleBookings] = useState(5);

  const showMoreBookings = () => {
    setVisibleBookings(prev => prev + 5);
  };

  const formatDate = (date: string) => {
    return dayjs(date).format('D/MM, YYYY'); // Example: November 27, 2023 10:09 AM
  };

  return (
    <div className='booking-list-container'>
      <h2>Bookings History</h2> {/* Header */}
      <hr /> {/* Horizontal line */}
      <List
        dataSource={userBookings.slice(0, visibleBookings)}
        renderItem={(booking, index) => (
          <List.Item key={index}>
            <p>{formatDate(booking.dateRange[0])} to {formatDate(booking.dateRange[1])}</p>
            <p><b>Status:</b> {booking.status}</p>
            <p><b>Price:</b> ${booking.totalPrice}</p>
          </List.Item>
        )}
      />
      {visibleBookings < userBookings.length && (
        <Button onClick={showMoreBookings}>View More</Button>
      )}
    </div>
  );
};
