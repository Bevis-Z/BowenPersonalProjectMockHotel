import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { message, List, Button, Card } from 'antd';
import { Booking, Listing } from '../HostingList/HostingList/HostingListInterface';
import dayjs from 'dayjs';
import LiquidChart from './LiquidChart';
import styles from './index.module.css';

// This component is used to display the booking details for a listing
const BookingDetails: React.FC = () => {
  const { listingId } = useParams();
  const location = useLocation();
  const [daysSincePosted, setDaysSincePosted] = useState(0);
  const [listing, setListing] = useState<Listing | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [daysBooked, setDaysBooked] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const maxDaysBooked = 365;
  // Fetch bookings for the listing to check the bookings for the current login user
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
      const currentYear = new Date().getFullYear(); // Get the current year

      bookingsForListing.forEach((booking: Booking) => {
        const start = new Date(booking.dateRange[0]);
        const end = new Date(booking.dateRange[1]);

        // Check if the booking is for the current year and has been accepted
        if (start.getFullYear() === currentYear && booking.status === 'accepted') {
          const days = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
          totalDays += Math.ceil(days);
          profit += booking.totalPrice;
        }
      });
      setDaysBooked(totalDays);
      setTotalProfit(profit);
    } catch (error) {
      console.log('Error fetching bookings');
    }
  };

  // Fetch the listing details
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
  }, [listingId]);
  // Handler to accept booking
  const handleAcceptBooking = async (bookingId: number) => {
    try {
      // Get the booking details
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
      // Refresh the state
      fetchBookings();
      message.success('Booking accepted successfully');
    } catch (error) {
      message.error('Error accepting booking');
    }
  };
  // Handler to reject booking
  const handleRejectBooking = async (bookingId: number) => {
    try {
      // Request to reject booking
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
      // Update the state
      fetchBookings();
      message.success('Booking rejected successfully');
    } catch (error) {
      message.error('Error rejecting booking');
    }
  };
  return (
    <div className={styles.bookingDetails}>
      <h3>Booking Details: {listing?.title}</h3>
      <div className={styles.chartsDisplay}>
        <div className={styles.yearDisplay}>
          <Card style={{ height: 'inherit', width: 'fit-content' }} hoverable>
            <h5>All Booking Days This Year:</h5>
            <LiquidChart value={daysBooked} max={maxDaysBooked} />
          </Card>
          <Card hoverable>
            <h5>Posted: {daysSincePosted} Day(s)</h5>
          </Card>
          <Card hoverable>
            <h5>Total Profit This Year:</h5>
            <LiquidChart value={totalProfit} max={maxPrice} />
          </Card>
        </div>
      </div>
      <div className={styles.bookingHistory}>
        <h3>Booking History</h3>
        <List
          itemLayout="horizontal"
          dataSource={bookings}
          renderItem={(booking: Booking) => (
            <List.Item
              actions={[
                booking.status === 'pending' && (
                  <div className={styles.actionPriceBox}>
                    <div>Amount: ${booking.totalPrice}</div>
                    <div className={styles.actionBox}>
                      <Button onClick={() => handleAcceptBooking(booking.id)} type="primary">
                        Accept
                      </Button>
                      <Button onClick={() => handleRejectBooking(booking.id)} danger>
                        Reject
                      </Button>
                    </div>
                  </div>
                ),
              ]}
            >
              <List.Item.Meta
                title={`ID: ${booking.id}`}
                description={
                  <div>
                    {formatDateRange(booking.dateRange)}
                    <br />
                    Status: {booking.status}
                  </div>
                }
              />
              {booking.status !== 'pending' && (<div>Amount: ${booking.totalPrice}</div>)}
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
