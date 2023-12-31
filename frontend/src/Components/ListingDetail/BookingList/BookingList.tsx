// BookingList.tsx
import React, { useState } from 'react';
import { Booking } from '../../HostingList/HostingList/HostingListInterface';
import { Button, List } from 'antd';
import styles from './index.module.css';
import dayjs from 'dayjs';

interface BookingListProps {
  userBookings: Booking[];
}

// This is the BookingList component that will be rendered in the ListingDetail component
export const BookingList: React.FC<BookingListProps> = ({ userBookings }) => {
  const [visibleBookings, setVisibleBookings] = useState(5);

  const showMoreBookings = () => {
    setVisibleBookings(prev => prev + 5);
  };

  const formatDate = (date: string) => {
    return dayjs(date).format('D/MM, YYYY'); // Example: November 27, 2023 10:09 AM
  };

  return (
    <div className={styles.bookingListContainer}>
      <h2 className={styles.h2}>Bookings History</h2> {/* Header */}
      <hr className={styles.hr}/> {/* Horizontal line */}
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
