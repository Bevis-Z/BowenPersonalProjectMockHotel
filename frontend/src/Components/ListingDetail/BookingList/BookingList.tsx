// BookingList.tsx
import React, { useState } from 'react';
import { Booking } from '../../HostingList/HostingList/HostingListInterface';
import { Button, List } from 'antd';
import './index.css';

interface BookingListProps {
  userBookings: Booking[];
}

export const BookingList: React.FC<BookingListProps> = ({ userBookings }) => {
  const [visibleBookings, setVisibleBookings] = useState(5);

  const showMoreBookings = () => {
    setVisibleBookings(prev => prev + 5);
  };

  return (
    <div className='booking-list-container'>
      <h2>Bookings History</h2> {/* Header */}
      <hr /> {/* Horizontal line */}
      <List
        dataSource={userBookings.slice(0, visibleBookings)}
        renderItem={(booking, index) => (
          <List.Item key={index}>
            {/* Display booking details */}
            <p>Booking ID: {booking.id}</p>
            <p><b>Dates:</b> {booking.dateRange[0]} to {booking.dateRange[1]}</p>
            <p><b>Status:</b> {booking.status}</p>
            <p><b>Total Price:</b> ${booking.totalPrice}</p>
          </List.Item>
        )}
      />
      {visibleBookings < userBookings.length && (
        <Button onClick={showMoreBookings}>View More</Button>
      )}
    </div>
  );
};
