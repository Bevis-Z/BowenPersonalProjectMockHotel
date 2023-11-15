import React, { useState } from 'react';
import { Input, Button, Card } from 'antd';
import './index.css';

interface ReviewFormProps {
  userBookingId: number;
  onReviewSubmit: (bookingId: number, score: number, comment: string) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ userBookingId, onReviewSubmit }) => {
  const [reviewScore, setReviewScore] = useState<number | string>(0);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [isScoreValid, setIsScoreValid] = useState<boolean>(true); // Use this to show error message if score is invalid
  const isInputValid = isScoreValid && typeof reviewScore === 'number' && reviewScore >= 0 && reviewScore <= 5 && reviewComment.trim() !== '';

  const handleSubmit = () => {
    if (isInputValid) {
      // User has entered a valid review
      onReviewSubmit(userBookingId, reviewScore as number, reviewComment);

      setReviewScore(0);
      setReviewComment('');
    }
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const score = parseInt(e.target.value);
    if (score >= 0 && score <= 5) {
      setReviewScore(score);
      setIsScoreValid(true);
    } else {
      setReviewScore(e.target.value);
      setIsScoreValid(false);
    }
  };
  return (
    <Card hoverable className={'reviewCard'}>
      <h3>Make a Review</h3>
      <Input
        type="number"
        placeholder="Score (1-5)"
        value={typeof reviewScore === 'number' ? reviewScore : ''}
        onChange={handleScoreChange}
      />
      {!isScoreValid && <p style={{ color: 'red' }}>Please enter a score between 0 and 5.</p>}
      <Input.TextArea
        rows={6}
        placeholder="Comment"
        value={reviewComment}
        onChange={(e) => setReviewComment(e.target.value)}
      />
      <Button type="primary" onClick={handleSubmit} disabled={!isInputValid}
      >Submit Review</Button>
    </Card>
  );
};

export default ReviewForm;
