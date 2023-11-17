// ReviewList.tsx
import React, { useState } from 'react';
import { Review } from '../../HostingList/HostingList/HostingListInterface';
import { Button, List } from 'antd';
import styles from './index.module.css';

interface ReviewListProps {
  reviews: Review[];
}

// This is the ReviewList component that will be rendered in the ListingDetail component
const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  const [visibleReviews, setVisibleReviews] = useState(5);

  const showMoreReviews = () => {
    setVisibleReviews(prev => prev + 5);
  };

  return (
    <div className={styles.reviews}>
      <h2>Reviews and Comments</h2> {/* Header */}
      <hr className={styles.hr}/> {/* Horizontal line */}
      <List
        dataSource={reviews.slice(0, visibleReviews)}
        renderItem={(review, index) => (
          <List.Item key={index}>
            <p><b>Comment:</b> {review.comment}</p>
            <p><b>Rating:</b> {review.star}/5</p>
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
