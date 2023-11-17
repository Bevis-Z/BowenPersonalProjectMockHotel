import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import './index.css';
import { Input, Button } from 'antd';

type Bed = {
  count: number;
  size: 'queen' | 'king' | 'double' | 'single';
};

type Bedroom = {
  type: string;
  beds: Bed[];
};
interface Amenities {
  Wifi: boolean;
  TV: boolean;
  Kitchen: boolean;
  AirConditioning: boolean;
  Heating: boolean;
  WashingMachine: boolean;
  Dryer: boolean;
}

interface StepTwoProps {
  bathroomNumber: string;
  bedrooms: Bedroom[];
  amenities: Amenities;
  setBathroomNumber: React.Dispatch<React.SetStateAction<string>>;
  setBedrooms: React.Dispatch<React.SetStateAction<Bedroom[]>>;
  setAmenities: React.Dispatch<React.SetStateAction<Amenities>>;
  createHostingRequest: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onBack: () => void;
}
const StepTwo: React.FC<StepTwoProps> = ({ bathroomNumber, bedrooms, amenities, setBathroomNumber, setBedrooms, setAmenities, onBack, createHostingRequest }) => {
  const [isFormValid, setIsFormValid] = useState(false);

  // When form data changes, check if the form is valid
  useEffect(() => {
    // Check if data is valid
    const isBathroomNumberValid = bathroomNumber.trim() !== '';
    const areBedroomsValid = bedrooms.every(bedroom => bedroom.type !== '' && bedroom.beds.every(bed => bed.count > 0));
    const areAmenitiesValid = Object.values(amenities).some(value => value === true);

    // Change the state of isFormValid
    setIsFormValid(isBathroomNumberValid && areBedroomsValid && areAmenitiesValid);
  }, [bathroomNumber, bedrooms, amenities]);
  // Add a bedroom to the list of bedrooms
  const addBedroom = (): void => {
    setBedrooms([...bedrooms, { type: '', beds: [{ count: 1, size: 'queen' }] }]);
  };
  // Update the bedroom type
  const updateBedroom = (index: number, newType: string): void => {
    const newBedrooms = bedrooms.map((bedroom, idx) => {
      if (idx === index) {
        return {
          ...bedroom,
          type: newType
        };
      }
      return bedroom;
    });

    setBedrooms(newBedrooms);
  };
  // Add a bed to the bedroom
  const addBed = (bedroomIndex: number): void => {
    const newBedrooms = bedrooms.map(bedroom => ({
      ...bedroom,
      beds: bedroom.beds.map(bed => ({ ...bed }))
    }));

    newBedrooms[bedroomIndex]?.beds.push({ count: 1, size: 'queen' });
    setBedrooms(newBedrooms);
  };
  // Remove a bedroom from the list of bedrooms
  const removeBedroom = (bedroomIndex: number): void => {
    const newBedrooms = [...bedrooms];
    newBedrooms.splice(bedroomIndex, 1);
    setBedrooms(newBedrooms);
  };
  // Remove a bed from the bedroom
  const removeBed = (bedroomIndex: number, bedIndex: number): void => {
    const bedroom = bedrooms[bedroomIndex];
    if (bedroom && bedroom.beds.length > 1) {
      bedroom.beds.splice(bedIndex, 1);
      setBedrooms([...bedrooms]);
    }
  };
  const updateBed = (
    bedroomIndex: number,
    bedIndex: number,
    newCount: number,
    newSize: 'queen' | 'king' | 'double' | 'single'
  ): void => {
    const newBedrooms = bedrooms.map((bedroom, idx) => {
      if (idx === bedroomIndex) {
        const newBeds = bedroom.beds.map((bed, bedIdx) => {
          if (bedIdx === bedIndex) {
            return { count: Number(newCount), size: newSize };
          }
          return bed;
        });
        return { ...bedroom, beds: newBeds };
      }
      return bedroom;
    });

    setBedrooms(newBedrooms);
  };

  const amenityOptions = [
    { key: 'Wifi', label: 'Wifi' },
    { key: 'TV', label: 'TV' },
    { key: 'Kitchen', label: 'Kitchen' },
    { key: 'AirConditioning', label: 'Air conditioning' },
    { key: 'Heating', label: 'Heating' },
    { key: 'WashingMachine', label: 'Washing machine' },
    { key: 'Dryer', label: 'Dryer' },
  ];
  const handleAmenityChange = (amenityKey: keyof Amenities, checked: boolean) => {
    setAmenities(prev => ({ ...prev, [amenityKey]: checked }));
  };
  return (
    <Form>
      <div className={'propertyDetails'}>
        <div className={'bathroom'}>
          <a>Bathroom Numbers</a>
          <Form.Control type="text" onChange={(e) => setBathroomNumber(e.target.value)} value={bathroomNumber}/>
        </div>
        <a>Property bedrooms</a>
        <div>
          {bedrooms.map((bedroom, bedroomIndex) => (
            <div key={bedroomIndex}>
              <Form.Select id={'bedRoomSelect'} onChange={(e) => updateBedroom(bedroomIndex, e.target.value)} value={bedroom.type}>
                <option value="">Select bedroom type</option>
                <option value="master">Master</option>
                <option value="guest">Guest</option>
              </Form.Select>
              {bedrooms.length > 1 && ( // Check if there is more than one bedroom before rendering the delete button.
                <Button danger onClick={() => removeBedroom(bedroomIndex)}>
                  Remove Bedroom
                </Button>
              )}
              {bedroom.beds.map((bed, bedIndex) => (
                <div key={bedIndex} className={'inputBedCount'}>
                  <Input
                    type="number"
                    value={bed.count}
                    onChange={(e) => updateBed(bedroomIndex, bedIndex, Number(e.target.value), bed.size)}
                  />
                  <Form.Select
                  onChange={(e) => {
                    if (['queen', 'king', 'double', 'single'].includes(e.target.value)) {
                      updateBed(bedroomIndex, bedIndex, bed.count, e.target.value as 'queen' | 'king' | 'double' | 'single');
                    }
                  }}
                  value={bed.size}
                  >
                    <option value="queen">Queen</option>
                    <option value="king">King</option>
                    <option value="double">Double</option>
                    <option value="single">Single</option>
                  </Form.Select>
                  {bedroom.beds.length > 1 && ( // Check if there is more than one bed before rendering the delete button.
                    <Button danger onClick={() => removeBed(bedroomIndex, bedIndex)}>
                      Remove Bed
                    </Button>
                  )}
                </div>
              ))}
              <Button id={'addBedBtn'} type="primary" ghost onClick={() => addBed(bedroomIndex)}>Add Bed</Button>
              <br></br>
            </div>
          ))}
          <Button type="primary" id={'addBedroom'} ghost onClick={addBedroom}>Add Bedroom</Button>
        </div>
        <a>Amenities</a>
        {
          amenityOptions.map(amenity => (
            <Form.Check
              key={amenity.key}
              type="checkbox"
              label={amenity.label}
              onChange={(e) => handleAmenityChange(amenity.key as keyof Amenities, e.target.checked)}
              checked={amenities[amenity.key as keyof Amenities]}
            />
          ))
        }
      </div>
      <div>
        <Button type="primary" ghost onClick={onBack}>
          Back
        </Button>
        <Button type="primary" id="createHosting" disabled={!isFormValid} onClick={createHostingRequest}>Confirm
        </Button>
      </div>
    </Form>
  );
};

export default StepTwo;
