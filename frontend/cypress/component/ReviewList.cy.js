import React from 'react';
import { mount } from 'cypress/react';
import ReviewList from '../../src/Components/ListingDetail/ReviewList/ReviewList';

describe('ReviewList Component Tests', () => {
  it('renders and interacts with the ReviewList component', () => {
    const reviews = [
      { comment: 'Great place', star: 5 },
      { comment: 'Amazing experience', star: 4 },
      { comment: 'Amazing experience', star: 4 },
      { comment: 'Amazing experience', star: 4 },
      { comment: 'Amazing experience', star: 4 },
      { comment: 'Amazing experience', star: 4 },
      { comment: 'Amazing experience', star: 4 },
      { comment: 'Amazing experience', star: 4 },
      { comment: 'Amazing experience', star: 4 },
      { comment: 'Amazing experience', star: 4 },
      { comment: 'Amazing experience', star: 4 },
      { comment: 'Amazing experience', star: 4 },
      { comment: 'Amazing experience', star: 4 },
    ];

    mount(<ReviewList reviews={reviews} />);
    cy.contains('h2', 'Reviews and Comments').should('exist');
  });
});
