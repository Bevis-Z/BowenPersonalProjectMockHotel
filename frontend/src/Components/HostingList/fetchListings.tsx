import { Bedroom, Listing, ListingDetails, Review } from './HostingList/HostingListInterface';
import React from 'react';

const calculateTotalBeds = (bedrooms: Bedroom[]): number => {
  return bedrooms.reduce((total, bedroom) => {
    return total + bedroom.beds.reduce((bedTotal, bed) => bedTotal + bed.count, 0);
  }, 0);
};

const calculateAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;
  const totalRating = reviews.reduce((total, review) => total + review.star, 0);
  return totalRating / reviews.length;
};

interface FetchListingsProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setListings: React.Dispatch<React.SetStateAction<Listing[]>>;
}
const fetchListings = async ({ setIsLoading, setListings }: FetchListingsProps) => {
  setIsLoading(true);
  try {
    const response = await fetch('http://localhost:5005/listings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json() as { listings: Listing[], error?: string };
    if (data.error) {
      throw new Error(data.error);
    } else {
      console.log('Initial data:', data); // 日志输出：初始数据
      const listingsWithDetails: Listing[] = await Promise.all(
        data.listings.map(async (listing): Promise<Listing> => {
          try {
            const detailsResponse = await fetch(`http://localhost:5005/listings/${listing.id}`);
            const detailsJson = await detailsResponse.json();
            if (detailsJson.error) {
              throw new Error(detailsJson.error);
            } else {
              const detailsData = detailsJson.listing as ListingDetails;
              console.log('Details data:', detailsData); // 日志输出：详细数据
              return {
                ...listing,
                ...detailsData,
                totalBeds: calculateTotalBeds(detailsData.metadata.bedrooms),
                averageRating: calculateAverageRating(detailsData.reviews),
              };
            }
          } catch (error) {
            console.error(`Failed to fetch details for listing ${listing.id}:`, error);
            return listing;
          }
        })
      );
      console.log('Listings with details:', listingsWithDetails);
      setListings(listingsWithDetails);
    }
  } catch (error) {
    console.error('Failed to fetch listings:', error);
    alert('Failed to load listings.');
  }
  setIsLoading(false);
};

export default fetchListings;
