import React from 'react';
import { Button, Form } from 'react-bootstrap';

type Bed = {
  count: number;
  size: 'queen' | 'king' | 'double' | 'single';
};

type Bedroom = {
  type: string; // 你可以将这个改为具体的卧室类型，例如 'master' | 'guest' | '';
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
  const addBedroom = (): void => {
    setBedrooms([...bedrooms, { type: '', beds: [{ count: 1, size: 'queen' }] }]);
  };
  const updateBedroom = (index: number, newType: string): void => {
    const newBedrooms = bedrooms.map(bedroom => ({
      ...bedroom,
      beds: bedroom.beds.map(bed => ({ ...bed }))
    }));

    // Use the non-null assertion operator '!'
    newBedrooms[index]!.type = newType;
    setBedrooms(newBedrooms);
  };
  const addBed = (bedroomIndex: number): void => {
    const newBedrooms = bedrooms.map(bedroom => ({
      ...bedroom,
      beds: bedroom.beds.map(bed => ({ ...bed }))
    }));

    newBedrooms[bedroomIndex]?.beds.push({ count: 1, size: 'queen' });
    setBedrooms(newBedrooms);
  };

  const updateBed = (
    bedroomIndex: number,
    bedIndex: number,
    newCount: number,
    newSize: 'queen' | 'king' | 'double' | 'single'
  ): void => {
    const newBedrooms = bedrooms.map(bedroom => ({
      ...bedroom,
      beds: bedroom.beds.map(bed => ({ ...bed }))
    }));

    newBedrooms[bedroomIndex]!.beds[bedIndex]! = { count: Number(newCount), size: newSize };
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
              <Form.Select onChange={(e) => updateBedroom(bedroomIndex, e.target.value)} value={bedroom.type}>
                <option value="">Select bedroom type</option>
                <option value="master">Master</option>
                <option value="guest">Guest</option>
              </Form.Select>
              {bedroom.beds.map((bed, bedIndex) => (
                <div key={bedIndex}>
                  <input
                    type="number"
                    value={bed.count}
                    onChange={(e) => updateBed(bedroomIndex, bedIndex, Number(e.target.value), bed.size)}
                  /><Form.Select
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
                </div>
              ))}
              <Button onClick={() => addBed(bedroomIndex)}>Add Bed</Button>
              <br></br>
            </div>
          ))}
          <Button onClick={addBedroom}>Add Bedroom</Button>
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
        <Button variant="primary" onClick={onBack}>
          Back
        </Button>
        <button type="submit" id="createHosting" className="btn btn-primary" onClick={createHostingRequest}>Create
        </button>
      </div>
    </Form>
  );
};

export default StepTwo;
