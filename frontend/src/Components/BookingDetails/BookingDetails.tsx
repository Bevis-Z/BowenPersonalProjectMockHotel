// BookingDetails.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { message, List, Button, Card } from 'antd';
import { Booking, Listing } from '../HostingList/HostingList/HostingListInterface';
import dayjs from 'dayjs';
import LiquidChart from './LiquidChart';
import './index.css';

const BookingDetails: React.FC = () => {
  const { listingId } = useParams();
  const location = useLocation();
  const [daysSincePosted, setDaysSincePosted] = useState(0);
  const [listing, setListing] = useState<Listing | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [daysBooked, setDaysBooked] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const maxDaysBooked = 365; // 一年的最大天数

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:5005/bookings/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();
      const bookingsForListing = data.bookings.filter(
        (booking: Booking) => booking.listingId.toString() === listingId
      );
      setBookings(bookingsForListing);

      let totalDays = 0;
      let profit = 0;
      const currentYear = new Date().getFullYear(); // 获取当前年份

      bookingsForListing.forEach((booking: Booking) => {
        const start = new Date(booking.dateRange[0]);
        const end = new Date(booking.dateRange[1]);

        // 检查预订是否在当前年份内
        if (start.getFullYear() === currentYear && booking.status === 'accepted') {
          const days = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
          totalDays += Math.ceil(days); // 向上取整以确保至少计算一天
          profit += booking.totalPrice;
        }
      });
      setDaysBooked(totalDays);
      setTotalProfit(profit);
    } catch (error) {
      message.error('Error fetching bookings');
    }
  };

  useEffect(() => {
    const calculatePostedDays = () => {
      if (listing && listing.postedOn) {
        const postedDate = new Date(listing.postedOn);
        const currentDate = new Date();
        const differenceInTime = currentDate.getTime() - postedDate.getTime();
        const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
        setDaysSincePosted(differenceInDays);
        const maxiPrice = listing.price * maxDaysBooked;
        setMaxPrice(maxiPrice);
        console.log('Days since posted:', listing.postedOn);
      }
    };

    if (location.state) {
      const { listing } = location.state as { listing: Listing };
      setListing(listing);
      calculatePostedDays();
    }
  }, [location, listingId, listing]);
  useEffect(() => {
    if (listingId) {
      fetchBookings();
    }
  }, [listingId]); // 确保 listingId 是依赖项

  const handleAcceptBooking = async (bookingId: number) => {
    try {
      // 调用接受预订的API
      const response = await fetch(`http://localhost:5005/bookings/accept/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to accept booking');
      }
      // 更新状态
      fetchBookings();
      message.success('Booking accepted successfully');
    } catch (error) {
      message.error('Error accepting booking');
    }
  };

  const handleRejectBooking = async (bookingId: number) => {
    try {
      // 调用拒绝预订的API
      const response = await fetch(`http://localhost:5005/bookings/reject/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to reject booking');
      }
      // 更新状态
      fetchBookings();
      message.success('Booking rejected successfully');
    } catch (error) {
      message.error('Error rejecting booking');
    }
  };
  return (
    <div className={'bookingDetails'}>
      <h3>Booking Details: {listing?.title}</h3>
      <div className={'chartsDisplay'}>
        <div className={'yearDisplay'}>
          <Card hoverable className={'liquidDisplay'}>
            <h5>All Booking Days This Year:</h5>
            <LiquidChart value={daysBooked} max={maxDaysBooked} />
          </Card>
          <Card hoverable className={'liquidDisplay'}>
            <h5>Posted: {daysSincePosted} Day(s)</h5>
          </Card>
          <Card hoverable className={'liquidDisplay'}>
            <h5>Total Profit This Year:</h5>
            <LiquidChart value={totalProfit} max={maxPrice} />
          </Card>
        </div>
      </div>
      <div className={'bookingHistory'}>
        <h3>Booking History</h3>
        <List
          itemLayout="horizontal"
          dataSource={bookings}
          renderItem={(booking: Booking) => (
            <List.Item
              actions={[
                booking.status === 'pending' && (
                  <>
                    <Button onClick={() => handleAcceptBooking(booking.id)} type="primary">
                      Accept
                    </Button>
                    <Button onClick={() => handleRejectBooking(booking.id)} danger>
                      Reject
                    </Button>
                  </>
                ),
              ]}
            >
              <List.Item.Meta
                title={`Booking ID: ${booking.id}`}
                description={`Date Range: ${formatDateRange(booking.dateRange)} - Status: ${booking.status}`}
              />
              <div>Total Price: ${booking.totalPrice}</div>
            </List.Item>
          )}
        />
      </div>

</div>
  );
};

export default BookingDetails;

function formatDateRange (dateRange: string[]): string {
  return dateRange.map(date => dayjs(date).format('YYYY-MM-DD')).join(' to ');
}
