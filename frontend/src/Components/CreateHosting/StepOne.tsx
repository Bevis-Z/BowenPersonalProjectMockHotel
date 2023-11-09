import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

interface StepOneProps {
  images: UploadFile<any>[];
  title: string;
  address: string;
  price: string;
  propertyType: string;
  setTitle: (value: string) => void;
  setPropertyType: (value: string) => void;
  setAddress: (value: string) => void;
  setPrice: (value: string) => void;
  onNext: () => void;
  onFileListChange: (files: UploadFile[]) => void;
}

const StepOne: React.FC<StepOneProps> = ({ images, title, address, price, setTitle, propertyType, setPropertyType, setAddress, setPrice, onNext, onFileListChange }) => {
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
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
        <Upload
          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
          listType="picture-card"
          fileList={images}
          onChange={({ fileList }) => onFileListChange(fileList)}
          showUploadList={{
            showPreviewIcon: false, // 隐藏预览图标
            showRemoveIcon: true
          }}
        >
          {images.length >= 8 ? null : uploadButton}
        </Upload>
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
