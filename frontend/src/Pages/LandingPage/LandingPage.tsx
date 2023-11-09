import React, { useEffect, useState } from 'react';
import { Listing } from '../../Components/HostingList/HostingList/HostingListInterface';
import fetchListings from '../../Components/HostingList/fetchListings';
import PublicHostingList from '../../Components/HostingList/PublicHostingList/PublicHostingList';
import './index.css';

interface SearchFilters {
  searchText: string;
  minBedrooms: number | null;
  maxBedrooms: number | null;
  // ...可能还有其他属性...
}

function LandingPage () {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchText: '',
    minBedrooms: null,
    maxBedrooms: null,
    // ...为其他属性提供初始值...
  });
  useEffect(() => {
    fetchListings({ setIsLoading, setListings });
  }, []);
  console.log('Listings:', listings);

  return (
    <div className={'landingPage'}>
      <PublicHostingList searchFilters={searchFilters} />
    </div>
  );
}

export default LandingPage;
