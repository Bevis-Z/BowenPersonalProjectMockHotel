import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DatePicker, Button, message, Card } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import HostingListImage from '../HostingList/HostingListImage/HostingListImage';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { RangeValue } from 'rc-picker/lib/interface';
import { Booking } from '../HostingList/HostingList/HostingListInterface';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList/ReviewList';
import { BookingList } from './BookingList/BookingList';
import './index.css';
import { IconText } from '../HostingList/HostingList/HostingList';
import { StarOutlined } from '@ant-design/icons';
import { BiSolidBath, BiSolidBed } from 'react-icons/bi';
import { MdBedroomParent } from 'react-icons/md';
import { renderAmenities } from './RenderAmenities/RenderAmenities';

const { RangePicker } = DatePicker;

// This is the ListingDetail component that will be rendered in the App component
// Contains the logic for booking a listing and submitting a review
const ListingDetail: React.FC = () => {
  const [userHasBooking, setUserHasBooking] = useState<boolean>(false);
  const [userBookings, setUserBookings] = useState<Booking[]>([]); // Add a state to hold user bookings
  const location = useLocation();
  const listing = location.state?.listing;
  const searchFilters = location.state?.searchFilters;
  const [bookingDates, setBookingDates] = useState<RangePickerProps['value']>(null);

  const currentUserEmail = localStorage.getItem('currentUserEmail');
  const [userBookingId, setUserBookingId] = useState<number | null>(null);

  const navigate = useNavigate();
  // Cannot book a listing in the past
  const disabledDate = (current: Dayjs): boolean => {
    return current && current < dayjs().startOf('day');
  };
  // Set the booking dates if the search filters contain a start and end date
  useEffect(() => {
    if (searchFilters?.startDate && searchFilters?.endDate) {
      const start = dayjs(searchFilters.startDate);
      const end = dayjs(searchFilters.endDate);
      if (start.isValid() && end.isValid()) {
        setBookingDates([start, end]);
      }
    }
  }, [searchFilters]);
  // Set the loading state to true when the component mounts
  if (!listing) {
    return <div>Loading...</div>;
  }
  // Submit a review for a booking
  const handleReviewSubmit = async (bookingId: number, score: number, userComment: string) => {
    try {
      const reviewPayload = {
        review: {
          star: score,
          comment: userComment
        }
      };
      const response = await fetch(`http://localhost:5005/listings/${listing.id}/review/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(reviewPayload)
      });
      if (!response.ok) {
        throw new Error('Failed to submit review');
      }
      message.success('Review submitted successfully!');

      // Fetch the updated listing details to get the new reviews
    } catch (error) {
      message.error('Failed to submit review.');
    }
  };
  // Book a listing
  const handleBookingConfirm = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Please login to book this listing.');
      navigate('/login');
      return;
    }
    if (!bookingDates || !bookingDates[0] || !bookingDates[1]) {
      message.error('Please select the booking dates.');
      return;
    }
    const totalPrice = calculatePriceForStay(
      listing.price,
      bookingDates[0].toDate(),
      bookingDates[1].toDate()
    );

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
      setBookingDates(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      message.error(errorMessage);
    }
  };
  // Update the booking dates when the user selects a new date range
  const handleBookingDatesChange = (
    dates: RangeValue<Dayjs>,
  ) => {
    setBookingDates(dates);
    console.log('Booking dates:', dates);
  };
  const priceDisplay = searchFilters && searchFilters.startDate && searchFilters.endDate
    ? `Price for Stay: ${calculatePriceForStay(listing.price, searchFilters.startDate, searchFilters.endDate)}`
    : `Price per Night: ${listing.price}`;
  // Get the user's bookings for this listing
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
      const bookingData = await response.json();
      const userBooking = bookingData.bookings.find((booking: Booking) =>
        booking.owner === currentUserEmail && booking.listingId.toString() === listing.id.toString() && (booking.status === 'accepted' || 'pending')
      );
      setUserHasBooking(!!userBooking);
      setUserBookingId(userBooking ? userBooking.id : null);
      console.log('userBookingId', bookingData);
      const userBookingsForListing = bookingData.bookings.filter((booking: Booking) =>
        booking.owner === currentUserEmail && booking.listingId.toString() === listing.id.toString()
      );
      setUserBookings(userBookingsForListing); // Update the state with the user's bookings for this listing
    } catch (error) {
      message.error('Error fetching bookings');
    }
  }
  if (localStorage.getItem('token')) {
    useEffect(() => {
      const interval = setInterval(() => {
        fetchBookings();
      }, 1000); // Set interval to 1 second

      return () => clearInterval(interval);
    }, [listing.id]);
  }

  return (
    <div className={'listDetail'}>
      <h1>{listing.title} ({listing.metadata.propertyType})</h1>
      <div className={'imageContent'}>
        <HostingListImage thumbnails={listing.thumbnail} />
        <div className={'bookingReviewBox'}>
          <Card className={'bookingCard'}>
            <div className={'booking'}>
              <h3>{listing.address}</h3>
              <h6>{priceDisplay}</h6>
              <div className={'scoreBeds'}>
                <IconText icon={StarOutlined} text={`${listing.averageRating?.toFixed(1) || 'N/A'} (${listing.reviews.length} reviews)`} />
                <div className={'roomDetail'}>
                  <p><MdBedroomParent/>{listing.metadata.bedrooms.length}</p>
                  <p><BiSolidBed/>{listing.totalBeds}</p>
                  <p><BiSolidBath/>{listing.metadata.bathroomNumber}</p>
                </div>
              </div>
              <div className={'confirmBooking'}>
                <RangePicker
                  format="YYYY-MM-DD"
                  onChange={handleBookingDatesChange}
                  value={bookingDates as [dayjs.Dayjs | null, dayjs.Dayjs | null]} // Ensure the value type aligns with what RangePicker expects
                  disabledDate={disabledDate} // Use the disabledDate function
                />
                <Button
                  type="primary"
                  onClick={handleBookingConfirm}
                  disabled={!bookingDates || !bookingDates[0] || !bookingDates[1]}
                >
                  Confirm Booking
                </Button>
              </div>
            </div>
          </Card>
          {userHasBooking && userBookingId && (
            <ReviewForm userBookingId={userBookingId} onReviewSubmit={handleReviewSubmit} />
          )}
        </div>
      </div>
      <div className={'addressDisplay'}>
        <h3>What this place offers</h3>
        <div className="amenities">
          {renderAmenities(listing.metadata.amenities)}
        </div>
      </div>
      <ReviewList reviews={listing.reviews} />
      <BookingList userBookings={userBookings} />
    </div>
  );
};

export default ListingDetail;

// Used to calculate the price for a stay
function calculatePriceForStay (pricePerNight: number, startDate: Date, endDate: Date) {
  const days = dayjs(endDate).diff(dayjs(startDate), 'day');
  return pricePerNight * days;
}
