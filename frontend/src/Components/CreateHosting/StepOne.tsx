import React from 'react';
import { Button, Form } from 'react-bootstrap';

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

export default StepOne;
