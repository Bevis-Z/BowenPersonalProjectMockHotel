import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import './index.css';

interface Amenities {
  Wifi: boolean;
  TV: boolean;
  Kitchen: boolean;
  AirConditioning: boolean;
  Heating: boolean;
  WashingMachine: boolean;
  Dryer: boolean;
}
type Bed = {
  count: number;
  size: 'queen' | 'king' | 'double' | 'single';
};

type Bedroom = {
  type: string; // 你可以将这个改为具体的卧室类型，例如 'master' | 'guest' | '';
  beds: Bed[];
};
interface StepOneProps {
  images: string[];
  title: string;
  address: string;
  price: string;
  propertyType: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setPropertyType: React.Dispatch<React.SetStateAction<string>>;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  setPrice: React.Dispatch<React.SetStateAction<string>>;
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  onNext: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface Listing {
  id: number;
  title: string;
  address: string;
  price: string;
  thumbnail: string[];
  metadata: {
    propertyType: string;
    bathroomNumber: string;
    bedrooms: Bedroom[];
    amenities: string[];
  };
}

type createHostingProps = {
  show: boolean;
  onHide: () => void; // Assuming no parameters can pass to this function
  editing?: boolean; // 新增：标识是否为编辑模式
  initialData?: Listing; // 新增：编辑模式下的初始数据
  onHostCreated: () => void;
};
const StepOne:React.FC<StepOneProps> = ({ images, title, address, price, setTitle, propertyType, setPropertyType, setAddress, setPrice, onNext, handleFileChange }) => {
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
            <div key={index} className="image-container">
              <img src={image} alt={`Preview ${index}`} className="img-thumbnail"/>
              <button onClick={() => index}>Delete</button>
            </div>
          ))}
        </div>
      </div>
      <div className={'propertyType'}>
        <a>Property Type</a>
        <Form.Select
          onChange={(event) => setPropertyType(event.target.value)}
          value={propertyType}
        >
          <option value="">Select Property Type</option>
          <option value="Apartment">Apartment</option>
          <option value="TownHouse">TownHouse</option>
          <option value="House">House</option>
        </Form.Select>

      </div>
      <Button variant="primary" onClick={onNext}>
        Next
      </Button>
    </Form>
  );
};
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
function createHosting ({ show, onHide, editing = false, initialData, onHostCreated }: createHostingProps) {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [propertyType, setPropertyType] = useState('');
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
  const [bedrooms, setBedrooms] = useState<Bedroom[]>([]);
  const resetForm = () => {
    setTitle('');
    setAddress('');
    setPrice('');
    setImages([]);
    setBathroomNumber('');
    setPropertyType('');
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
  // Use the useEffect hook to reset the form when the show prop changes.
  useEffect(() => {
    // When the show prop set to false, reset the form
    if (!show) {
      resetForm();
    }
  }, [show]);
  useEffect(() => {
    if (editing && initialData) {
      setTitle(initialData.title);
      setAddress(initialData.address);
      setPrice(initialData.price);
      setImages(initialData.thumbnail);
      setPropertyType(initialData.metadata.propertyType);
      setBathroomNumber(initialData.metadata.bathroomNumber);
      setBedrooms(initialData.metadata.bedrooms);
      setAmenities({
        Wifi: initialData.metadata.amenities.includes('Wifi'),
        TV: initialData.metadata.amenities.includes('TV'),
        Kitchen: initialData.metadata.amenities.includes('Kitchen'),
        AirConditioning: initialData.metadata.amenities.includes('AirConditioning'),
        Heating: initialData.metadata.amenities.includes('Heating'),
        WashingMachine: initialData.metadata.amenities.includes('WashingMachine'),
        Dryer: initialData.metadata.amenities.includes('Dryer'),
      });
    }
  }, [editing, initialData]);
  const createHostingRequest = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const metaData = {
      propertyType,
      bathroomNumber,
      bedrooms,
      amenities: Object.keys(amenities).filter((key): key is keyof Amenities => amenities[key as keyof Amenities]),
    };
    if (editing && initialData) {
      const response = await fetch(`http://localhost:5005/listings/${initialData.id}`, {
        method: 'PUT',
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
        alert('Modify successfully');
        onHide();
        onHostCreated && onHostCreated(); // 调用回调函数
        setStep(1);
      }
    }
    if (!editing) {
      const response = await fetch('http://localhost:5005/listings/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title, address, price, thumbnail: images, metadata: metaData })
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        alert('Create successfully');
        onHide();
        onHostCreated && onHostCreated(); // 调用回调函数
        setStep(1);
      }
    }
  }
  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else {
      setStep(1);
    }
  };
  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Welcome to Airbnb</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {step === 1 && (
            <StepOne
              images={images}
              title={title}
              address={address}
              price={price}
              propertyType={propertyType}
              setPropertyType={setPropertyType}
              setTitle={setTitle}
              setAddress={setAddress}
              setImages={setImages}
              setPrice={setPrice}
              onNext={handleNextStep}
              handleFileChange={handleFileChange}
            />
          )}
          {step === 2 && (
            <StepTwo
              bathroomNumber={bathroomNumber}
              bedrooms={bedrooms}
              amenities={amenities}
              setBathroomNumber={setBathroomNumber}
              setBedrooms={setBedrooms}
              setAmenities={setAmenities}
              onBack={handlePreviousStep}
              createHostingRequest={createHostingRequest}
            />)}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default createHosting;
