import React from 'react';
import { MdTv, MdKitchen, MdAcUnit, MdLocalLaundryService } from 'react-icons/md';
import { FaSnowflake, FaSink } from 'react-icons/fa';
import { BiWifi2 } from 'react-icons/bi';
import styles from './amenities.module.css';
interface AmenitiesMapping {
  [key: string]: {
    icon: React.ElementType;
    text: string;
  };
}

const amenitiesMapping: AmenitiesMapping = {
  Wifi: { icon: BiWifi2, text: 'Wifi' },
  TV: { icon: MdTv, text: 'TV' },
  Kitchen: { icon: MdKitchen, text: 'Kitchen' },
  AirConditioning: { icon: MdAcUnit, text: 'Air Conditioning' },
  Heating: { icon: FaSnowflake, text: 'Heating' },
  WashingMachine: { icon: MdLocalLaundryService, text: 'Washing Machine' },
  Dryer: { icon: FaSink, text: 'Dryer' },
};

// This is the RenderAmenities component that will be rendered in the ListingDetail component
export const renderAmenities = (amenities: string[]) => {
  return (
    <div className={styles.amenitiesContainer}>
      {amenities.map((amenity, index) => {
        const Amenity = amenitiesMapping[amenity];
        if (!Amenity) return null;

        const AmenityIcon = Amenity.icon;
        return (
          <div key={index} className={styles.amenity}>
            <AmenityIcon />
            <span>{Amenity.text}</span>
          </div>
        );
      })}
    </div>
  );
};
