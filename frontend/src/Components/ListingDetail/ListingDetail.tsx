import React from 'react';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

const ListingDetail = () => {
  const location = useLocation();
  const listing = location.state?.listing;
  const searchFilters = location.state?.searchFilters;
  if (!listing) {
    return <div>Loading...</div>;
  }

  // 根据是否有日期范围来确定显示的价格
  const priceDisplay = searchFilters && searchFilters.startDate && searchFilters.endDate
    ? `Price for Stay: ${calculatePriceForStay(listing.price, searchFilters.startDate, searchFilters.endDate)}`
    : `Price per Night: ${listing.price}`;

  return (
    <div>
      <h1>{listing.title}</h1>
      <p>Address: {listing.address}</p>
      <p>{priceDisplay}</p>
      {/* 展示其他信息 */}
      <p>Amenities: {/* ... */}</p>
      <p>Type: {listing.metadata.propertyType}</p>
      <p>Reviews: {/* ... */}</p>
      <p>Rating: {listing.averageRating}</p>
      <p>Bedrooms: {listing.metadata.bedrooms.length}</p>
      <p>Beds: {listing.totalBeds}</p>
      <p>Bathrooms: {listing.metadata.bathroomNumber}</p>
      {/* 展示图片 */}
      {/**/}
    </div>
  );
};

export default ListingDetail;

// 辅助函数：计算总住宿价格
function calculatePriceForStay (pricePerNight: number, startDate: Date, endDate: Date) {
  const days = dayjs(endDate).diff(dayjs(startDate), 'day');
  return pricePerNight * days;
}
