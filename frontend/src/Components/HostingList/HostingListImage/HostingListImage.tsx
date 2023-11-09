import React from 'react';
import { Carousel } from 'antd';
import './index.css';

interface HostingListImageProps {
  thumbnails: string[]; // An array of thumbnail image URLs
}
const contentStyle: React.CSSProperties = {
  margin: 0,
  height: '18em',
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
      {thumbnails.length > 0
        ? thumbnails.map((thumbnail, index) => (
          <div key={index}>
            <img
              className="carousel-content"
              style={contentStyle}
              src={thumbnail}
              alt={`Slide ${index}`}
            />
          </div>
        ))
        : (
        <div>
          <img
            className="carousel-content"
            style={contentStyle}
            src={ 'https://a0.muscache.com/im/pictures/miso/Hosting-747560259841294213/original/986b4fb6-4c99-4de2-908b-7c2cdcd6568b.jpeg?im_w=720' } // 使用默认图片
            alt="Default Slide"
          />
        </div>
          )}
    </Carousel>
  );
};

export default HostingListImage;
