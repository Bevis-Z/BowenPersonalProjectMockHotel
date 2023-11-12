// ReviewList.tsx
import React, { useState } from 'react';
import { Review } from '../../HostingList/HostingList/HostingListInterface';
import { Button, List } from 'antd';
import './index.css';

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  const [visibleReviews, setVisibleReviews] = useState(5);

  const showMoreReviews = () => {
    setVisibleReviews(prev => prev + 5);
  };

  return (
    <div className={'reviews'}>
      <h2>Reviews and Comments</h2> {/* Header */}
      <hr /> {/* Horizontal line */}
      <List
        dataSource={reviews.slice(0, visibleReviews)}
        renderItem={(review, index) => (
          <List.Item key={index}>
            <p>Rating: {review.star}/5</p>
            <p>Comment: {review.comment}</p>
          </List.Item>
        )}
      />
      {visibleReviews < reviews.length && (
        <Button onClick={showMoreReviews}>View More</Button>
      )}
    </div>
  );
};

export default ReviewList;
