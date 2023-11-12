import React, { useState } from 'react';
import { Button } from 'antd';

interface ReviewFormProps {
  userBookingId: number;
  onReviewSubmit: (bookingId: number, score: number, comment: string) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ userBookingId, onReviewSubmit }) => {
  const [reviewScore, setReviewScore] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>('');

  const handleSubmit = () => {
    onReviewSubmit(userBookingId, reviewScore, reviewComment);
  };

  return (
    <div>
      <h3>Leave a Review</h3>
      <input
        type="number"
        placeholder="Score (1-5)"
        value={reviewScore}
        onChange={(e) => setReviewScore(parseInt(e.target.value))}
      />
      <textarea
        placeholder="Comment"
        value={reviewComment}
        onChange={(e) => setReviewComment(e.target.value)}
      />
      <Button type="primary" onClick={handleSubmit}>Submit Review</Button>
    </div>
  );
};

export default ReviewForm;
