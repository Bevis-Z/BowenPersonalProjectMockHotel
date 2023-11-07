import React from 'react';
import { Carousel } from 'antd';
import './index.css';

interface HostingListImageProps {
  thumbnails: string[]; // An array of thumbnail image URLs
}
const contentStyle: React.CSSProperties = {
  margin: 0,
  height: '180px',
  width: '200px',
  color: 'white',
  lineHeight: '220px',
  textAlign: 'center',
  background: 'orange',
};

const HostingListImage: React.FC<HostingListImageProps> = ({ thumbnails }) => {
  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  };

  return (
    <Carousel className="carousel-container" afterChange={onChange}>
      {thumbnails.map((thumbnail, index) => (
        <div key={index}>
          <img
            className="carousel-content"
            style={contentStyle}
            src={thumbnail}
            alt={`Slide ${index}`}
          />
        </div>
      ))}
    </Carousel>
  );
};

export default HostingListImage;
