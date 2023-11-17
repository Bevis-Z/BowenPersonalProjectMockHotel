import React, { useEffect, useState } from 'react';
import { Listing } from '../../Components/HostingList/HostingList/HostingListInterface';
import fetchListings from '../../Components/HostingList/fetchListings';
import PublicHostingList from '../../Components/HostingList/PublicHostingList/PublicHostingList';
import styles from './index.module.css';
import { SearchFilters } from '../../App';

interface LandingPageProps {
  searchFilters: SearchFilters;
}

const LandingPage: React.FC<LandingPageProps> = ({ searchFilters }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchListings({ setIsLoading, setListings });
  }, []);

  console.log('Listings:', listings);

  return (
    <div className={styles.landingPage}>
      <PublicHostingList searchFilters={searchFilters} />
    </div>
  );
}

export default LandingPage;
