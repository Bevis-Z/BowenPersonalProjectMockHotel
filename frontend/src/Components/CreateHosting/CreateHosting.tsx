import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import { UploadFile } from 'antd/es/upload/interface';
import { message } from 'antd';

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
  type: string;
  beds: Bed[];
};
interface Listing {
  id: number;
  title: string;
  address: string;
  price: number;
  thumbnail: string[];
  metadata: {
    propertyType: string;
    bathroomNumber: string;
    bedrooms: Bedroom[];
    amenities: string[];
  };
}

export type createHostingProps = {
  show: boolean;
  onHide: () => void; // Assuming no parameters can pass to this function
  editing?: boolean; // 新增：标识是否为编辑模式
  initialData?: Listing; // 新增：编辑模式下的初始数据
  onHostCreated: () => void;
};
function createHosting ({ show, onHide, editing = false, initialData, onHostCreated }: createHostingProps) {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]); // 存储 Base64 编码的图片
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState(0);
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
    setPrice(0);
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
      if (data.error) {
        message.error(data.error);
      } else {
        message.success('Modify successfully');
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
        message.error(data.error);
      } else {
        message.success('Create successfully');
        onHide();
        onHostCreated && onHostCreated();
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
  const toUploadFileList = (images: string[]): UploadFile<any>[] => {
    return images.map((image, index) => ({
      uid: index.toString(),
      name: `image${index}`,
      status: 'done',
      url: image,
    }));
  };
  const handleUploadChange = (newFileList: UploadFile<any>[]) => {
    const newImagesPromises = newFileList.map(file => {
      return new Promise<string>((resolve, reject) => {
        if (file.originFileObj) {
          const reader = new FileReader();
          reader.onload = e => {
            if (e.target && e.target.result) {
              resolve(e.target.result as string);
            } else {
              reject(new Error('FileReader did not return a result'));
            }
          };
          reader.onerror = error => reject(error);
          reader.readAsDataURL(file.originFileObj);
        } else if (file.url) {
          // 如果文件已经有 URL（例如，编辑现有列表时），直接使用它
          resolve(file.url);
        } else {
          reject(new Error('No file to read'));
        }
      });
    });

    Promise.all(newImagesPromises)
      .then(newImages => {
        setImages(newImages);
      })
  };
  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? 'Edit Host' : 'Welcome to Airbnb'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {step === 1 && (
            <StepOne
              images={toUploadFileList(images)}
              title={title}
              address={address}
              price={price}
              propertyType={propertyType}
              setPropertyType={setPropertyType}
              setTitle={setTitle}
              setAddress={setAddress}
              setPrice={setPrice}
              onNext={handleNextStep}
              onFileListChange={handleUploadChange}
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
