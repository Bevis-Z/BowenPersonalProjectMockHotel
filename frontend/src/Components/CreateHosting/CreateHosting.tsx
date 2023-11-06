import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import './index.css';

type createHostingProps = {
  show: boolean;
  onHide: () => void; // Assuming no parameters can pass to this function
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
function createHosting ({ show, onHide }: createHostingProps) {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [bathroomNumber, setBathroomNumber] = useState('');
  const [amenities, setAmenities] = useState<Amenities>({
    Wifi: false,
    TV: false,
    Kitchen: false,
    AirConditioning: false,
    Heating: false,
    WashingMachine: false,
    Dryer: false,
  });
  type Bed = {
    count: number;
    size: 'queen' | 'king' | 'double' | 'single';
  };

  type Bedroom = {
    type: string; // 你可以将这个改为具体的卧室类型，例如 'master' | 'guest' | '';
    beds: Bed[];
  };

  const [bedrooms, setBedrooms] = useState<Bedroom[]>([]);

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
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Get all the files that the user has selected
    const files = event.target.files ? Array.from(event.target.files) : [];

    const imageStrings: string[] = [];

    // Set the numbers of files that have read
    let filesRead = 0;

    // Process each file that the user selected
    files.forEach((file) => {
      const fileReader = new FileReader();

      // When the file reader loads the file
      fileReader.onload = (e: ProgressEvent<FileReader>) => {
        // Make sure the file a string
        const base64String = e.target?.result as string;
        imageStrings.push(base64String);
        filesRead += 1;

        if (filesRead === files.length) {
          setImages(imageStrings);
        }
      };

      fileReader.readAsDataURL(file);
    });
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
  const resetForm = () => {
    setTitle('');
    setAddress('');
    setPrice('');
    setImages([]);
    setBathroomNumber('');
    setBedrooms([]);
    setAmenities({
      Wifi: false,
      TV: false,
      Kitchen: false,
      AirConditioning: false,
      Heating: false,
      WashingMachine: false,
      Dryer: false,
    })
  };
  const handleAmenityChange = (amenityKey: keyof Amenities, checked: boolean) => {
    setAmenities(prev => ({ ...prev, [amenityKey]: checked }));
  };

  // Use the useEffect hook to reset the form when the show prop changes.
  useEffect(() => {
    // When the show prop set to false, reset the form
    if (!show) {
      resetForm();
    }
  }, [show]);
  const createHostingRequest = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const metaData = {
      bathroomNumber,
      bedrooms,
      amenities: Object.keys(amenities).filter((key): key is keyof Amenities => amenities[key as keyof Amenities]),
    };
    const response = await fetch('http://localhost:5005/listings/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ title, address, price, thumbnail: images, metadata: metaData })
    });
    const data = await response.json();
    console.log(data);
    if (data.error) {
      alert(data.error);
    } else {
      alert('Create successfully');
      onHide();
    }
  }
  const StepOne = () => {
    return (
    <Form>
      <div>
        <label>Title</label>
        <Form.Control type="text" className="form-control" onChange={(event) => setTitle(event.target.value)}
                      value={title}/>
      </div>
      <div>
        <label>Address</label>
        <Form.Control type="text" onChange={(event) => setAddress(event.target.value)} className="form-control"
                      value={address}/>
      </div>
      <div>
        <label>Price</label>
        <Form.Control type="text" onChange={(event) => setPrice(event.target.value)} className="form-control"
                      value={price}/>
      </div>
      <div className="mb-3">
        <label htmlFor="formFileMultiple" className="form-label">Thumbnail</label>
        <Form.Control
          className="form-control"
          type="file"
          id="formFileMultiple"
          multiple
          onChange={handleFileChange}
        />
        <div className="image-preview">
          {images.map((image, index) => (
            <img key={index} src={image} alt={`Preview ${index}`} className="img-thumbnail"/>
          ))}
        </div>
      </div>
      <div className={'propertyType'}>
        <a>Property Type</a>
        <Form.Select>
          <option value="1">Apartment</option>
          <option value="2">TownHouse</option>
          <option value="3">House</option>
        </Form.Select>
      </div>
    </Form>
    );
  };
  const StepTwo = () => {
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
        <button type="submit" id="createHosting" className="btn btn-primary" onClick={createHostingRequest}>Create
        </button>
      </div>
    </Form>
    );
  };
  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Welcome to Airbnb</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {step === 1 && (
            <StepOne/>
          )}
          {step === 2 && <StepTwo />}
        </Modal.Body>
        <Modal.Footer>
          {step === 1 && (
            <Button variant="primary" onClick={() => setStep(2)}>
              Next
            </Button>
          )}
          {step === 2 && (
            <>
              <Button variant="secondary" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button variant="primary" onClick={createHostingRequest}>
                Create
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default createHosting;
